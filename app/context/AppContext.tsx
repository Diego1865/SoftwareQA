"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Post, Todo, User, Activity } from "../utils/types";

interface AppContextType {
  currentUser: User | null;
  posts: Post[];
  todos: Todo[];
  activityLog: Activity[];
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  purchasePost: (postId: string) => void;
  reportPost: (postId: string, reason: string) => void;
  addPost: (newPostData: {
    type: Post["type"];
    title?: string;
    body: string;
    tags: string[];
    subject?: string;
    isPremium: boolean;
    price?: number;
  }) => void;
  addTodoItem: (text: string, label: Todo["label"], priority: Todo["priority"], dueDate?: string) => void;
  toggleTodoItem: (id: string) => void;
  deleteTodoItem: (id: string) => void;
  updateBio: (newBio: string) => void;
  loginUser: (email: string, password: string) => Promise<boolean>;
  signupUser: (data: {
    name: string;
    university: string;
    role: "student" | "creator";
    email: string;
    password: string;
  }) => Promise<boolean>;
  logoutUser: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- small fetch helper -------------------------------------------------
// Every API route lives under /api and uses the session cookie for auth, so
// `credentials: "include"` keeps that cookie flowing on every request.
async function api<T>(
  url: string,
  options: RequestInit = {}
): Promise<{ ok: boolean; status: number; data: T | { error: string } }> {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activityLog, setActivityLog] = useState<Activity[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Local cache so the UI has something to show immediately on reload while
  // the network requests below are in flight. The database (via the API
  // routes) is always the real source of truth — these are just last-known
  // snapshots, overwritten as soon as fresh data arrives.
  const cacheLocally = useCallback(
    (key: string, value: unknown) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value));
      }
    },
    []
  );

  const loadAuthenticatedData = useCallback(async () => {
    const [postsRes, todosRes, activityRes] = await Promise.all([
      api<{ posts: Post[] }>("/api/posts"),
      api<{ todos: Todo[] }>("/api/todos"),
      api<{ activity: Activity[] }>("/api/activity"),
    ]);

    if (postsRes.ok && "posts" in postsRes.data) {
      setPosts(postsRes.data.posts);
      cacheLocally("sg_posts", postsRes.data.posts);
    }
    if (todosRes.ok && "todos" in todosRes.data) {
      setTodos(todosRes.data.todos);
      cacheLocally("sg_todos", todosRes.data.todos);
    }
    if (activityRes.ok && "activity" in activityRes.data) {
      setActivityLog(activityRes.data.activity);
      cacheLocally("sg_activity", activityRes.data.activity);
    }
  }, [cacheLocally]);

  // On mount: try the offline cache first (instant paint), then check the
  // real session with the server and reconcile against the database. This
  // is the standard "hydrate from an external source on mount" effect —
  // the local reads below are synchronous (localStorage), and the server
  // check immediately after replaces them with authoritative data.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("sg_user");
    const storedPosts = localStorage.getItem("sg_posts");
    const storedTodos = localStorage.getItem("sg_todos");
    const storedActivity = localStorage.getItem("sg_activity");

    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial hydration from localStorage, immediately reconciled against the server below
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
    if (storedPosts) setPosts(JSON.parse(storedPosts));
    if (storedTodos) setTodos(JSON.parse(storedTodos));
    if (storedActivity) setActivityLog(JSON.parse(storedActivity));

    (async () => {
      const meRes = await api<{ user: User | null }>("/api/auth/me");
      const user = meRes.ok && "user" in meRes.data ? meRes.data.user : null;

      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        cacheLocally("sg_user", user);
        await loadAuthenticatedData();
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("sg_user");
        localStorage.removeItem("sg_posts");
        localStorage.removeItem("sg_todos");
        localStorage.removeItem("sg_activity");
      }
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Post actions -------------------------------------------------

  const toggleLike = (postId: string) => {
    // Optimistic update so the tap feels instant, then reconcile with the
    // server's response (which has the real counts).
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? Math.max(0, p.likes - 1) : p.likes + 1,
            }
          : p
      )
    );

    api<{ post: Post }>(`/api/posts/${postId}/like`, { method: "POST" }).then(
      (res) => {
        if (res.ok && "post" in res.data) {
          const updated = res.data.post;
          setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
          api<{ activity: Activity[] }>("/api/activity").then((a) => {
            if (a.ok && "activity" in a.data) setActivityLog(a.data.activity);
          });
        }
      }
    );
  };

  const toggleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              saved: !p.saved,
              saves: p.saved ? Math.max(0, p.saves - 1) : p.saves + 1,
            }
          : p
      )
    );

    api<{ post: Post }>(`/api/posts/${postId}/save`, { method: "POST" }).then(
      (res) => {
        if (res.ok && "post" in res.data) {
          const updated = res.data.post;
          setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
          api<{ activity: Activity[] }>("/api/activity").then((a) => {
            if (a.ok && "activity" in a.data) setActivityLog(a.data.activity);
          });
        }
      }
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;

    api<{ post: Post }>(`/api/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }).then((res) => {
      if (res.ok && "post" in res.data) {
        const updated = res.data.post;
        setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
        api<{ activity: Activity[] }>("/api/activity").then((a) => {
          if (a.ok && "activity" in a.data) setActivityLog(a.data.activity);
        });
      }
    });
  };

  const purchasePost = (postId: string) => {
    api<{ post: Post }>(`/api/posts/${postId}/purchase`, {
      method: "POST",
    }).then((res) => {
      if (res.ok && "post" in res.data) {
        const updated = res.data.post;
        setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
        api<{ activity: Activity[] }>("/api/activity").then((a) => {
          if (a.ok && "activity" in a.data) setActivityLog(a.data.activity);
        });
      }
    });
  };

  const reportPost = (postId: string, reason: string) => {
    api<{ post: Post }>(`/api/posts/${postId}/report`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }).then((res) => {
      if (res.ok && "post" in res.data) {
        const updated = res.data.post;
        setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
        api<{ activity: Activity[] }>("/api/activity").then((a) => {
          if (a.ok && "activity" in a.data) setActivityLog(a.data.activity);
        });
      }
    });
  };

  const addPost = (newPostData: {
    type: Post["type"];
    title?: string;
    body: string;
    tags: string[];
    subject?: string;
    isPremium: boolean;
    price?: number;
  }) => {
    api<{ post: Post }>("/api/posts", {
      method: "POST",
      body: JSON.stringify(newPostData),
    }).then((res) => {
      if (res.ok && "post" in res.data) {
        const created = res.data.post;
        setPosts((prev) => [created, ...prev]);
        api<{ activity: Activity[] }>("/api/activity").then((a) => {
          if (a.ok && "activity" in a.data) setActivityLog(a.data.activity);
        });
      }
    });
  };

  // --- Todo actions -------------------------------------------------

  const addTodoItem = (
    text: string,
    label: Todo["label"],
    priority: Todo["priority"],
    dueDate?: string
  ) => {
    api<{ todo: Todo }>("/api/todos", {
      method: "POST",
      body: JSON.stringify({ text, label, priority, dueDate: dueDate || undefined }),
    }).then((res) => {
      if (res.ok) {
        const created = (res.data as { todo: Todo }).todo;
        setTodos((prev) => [created, ...prev]);
      }
    });
  };

  const toggleTodoItem = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );

    api<{ todo: Todo }>(`/api/todos/${id}`, { method: "PATCH" }).then((res) => {
      if (res.ok && "todo" in res.data) {
        const updated = res.data.todo;
        setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      }
    });
  };

  const deleteTodoItem = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    api(`/api/todos/${id}`, { method: "DELETE" });
  };

  // --- Profile / auth actions -----------------------------------------

  const updateBio = (newBio: string) => {
    setCurrentUser((prev) => (prev ? { ...prev, bio: newBio } : prev));
    api<{ user: User }>("/api/user/bio", {
      method: "PATCH",
      body: JSON.stringify({ bio: newBio }),
    });
  };

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    setAuthError(null);
    const res = await api<{ user: User } | { error: string }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) }
    );

    if (res.ok && "user" in res.data) {
      setCurrentUser(res.data.user);
      setIsAuthenticated(true);
      cacheLocally("sg_user", res.data.user);
      await loadAuthenticatedData();
      return true;
    }

    setAuthError("error" in res.data ? res.data.error : "No se pudo iniciar sesión");
    return false;
  };

  const signupUser = async (data: {
    name: string;
    university: string;
    role: "student" | "creator";
    email: string;
    password: string;
  }): Promise<boolean> => {
    setAuthError(null);
    const res = await api<{ user: User } | { error: string }>(
      "/api/auth/signup",
      { method: "POST", body: JSON.stringify(data) }
    );

    if (res.ok && "user" in res.data) {
      setCurrentUser(res.data.user);
      setIsAuthenticated(true);
      cacheLocally("sg_user", res.data.user);
      await loadAuthenticatedData();
      return true;
    }

    setAuthError("error" in res.data ? res.data.error : "No se pudo crear la cuenta");
    return false;
  };

  const logoutUser = () => {
    api("/api/auth/logout", { method: "POST" }).finally(() => {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setPosts([]);
      setTodos([]);
      setActivityLog([]);
      if (typeof window !== "undefined") {
        localStorage.removeItem("sg_user");
        localStorage.removeItem("sg_posts");
        localStorage.removeItem("sg_todos");
        localStorage.removeItem("sg_activity");
      }
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        posts,
        todos,
        activityLog,
        isAuthenticated,
        isLoading,
        authError,
        toggleLike,
        toggleSave,
        addComment,
        purchasePost,
        reportPost,
        addPost,
        addTodoItem,
        toggleTodoItem,
        deleteTodoItem,
        updateBio,
        loginUser,
        signupUser,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp debe ser usado dentro de un AppContextProvider");
  }
  return context;
};
