"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Post, Todo, User, Activity, Comment } from "../utils/types";
import { CURRENT_USER, MOCK_POSTS, MOCK_TODOS } from "../utils/data";

interface AppContextType {
  currentUser: User;
  posts: Post[];
  todos: Todo[];
  activityLog: Activity[];
  isAuthenticated: boolean;
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
  loginUser: () => void;
  logoutUser: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_ACTIVITIES: Activity[] = [
  { id: "a1", type: "like", text: "Le dio me gusta a la publicación de la Transformada de Fourier de Diego", time: "Hace 2h", accent: "#FF6B6B" },
  { id: "a2", type: "save", text: "Guardó el curso de Introducción a Ciencia de Datos", time: "Hace 5h", accent: "#3094FF" },
  { id: "a3", type: "comment", text: "Comentó en la hoja de trucos de Algoritmos", time: "Hace 1d", accent: "#4CAF50" },
  { id: "a4", type: "publish", text: "Publicó el recurso de la hoja de trucos de Algoritmos", time: "Hace 1d", accent: "#20B2AA" },
  { id: "a5", type: "follow", text: "Comenzó a seguir a Sofia Herrera", time: "Hace 3d", accent: "#7B68EE" },
];

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [posts, setPosts] = useState<Post[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activityLog, setActivityLog] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Cargar estado inicial desde localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("sg_user");
      const storedPosts = localStorage.getItem("sg_posts");
      const storedTodos = localStorage.getItem("sg_todos");
      const storedActivity = localStorage.getItem("sg_activity");
      const storedAuth = localStorage.getItem("sg_auth");

      if (storedUser) setCurrentUser(JSON.parse(storedUser));
      
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      } else {
        // Enriquecer posts iniciales con listas de comentarios vacías
        const enriched = MOCK_POSTS.map(p => ({
          ...p,
          commentsList: p.commentsList || [
            {
              id: `c_init_${p.id}`,
              authorName: "Pedro Páramo",
              avatar: "PP",
              text: "¡Excelente material! Me sirvió muchísimo para repasar.",
              createdAt: "Hace 1d"
            }
          ]
        }));
        setPosts(enriched);
        localStorage.setItem("sg_posts", JSON.stringify(enriched));
      }

      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      } else {
        setTodos(MOCK_TODOS);
        localStorage.setItem("sg_todos", JSON.stringify(MOCK_TODOS));
      }

      if (storedActivity) {
        setActivityLog(JSON.parse(storedActivity));
      } else {
        localStorage.setItem("sg_activity", JSON.stringify(INITIAL_ACTIVITIES));
      }

      if (storedAuth) {
        setIsAuthenticated(storedAuth === "true");
      }

      setIsLoaded(true);
    }
  }, []);

  // Guardar cambios en localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("sg_user", JSON.stringify(currentUser));
    }
  }, [currentUser, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("sg_posts", JSON.stringify(posts));
    }
  }, [posts, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("sg_todos", JSON.stringify(todos));
    }
  }, [todos, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("sg_activity", JSON.stringify(activityLog));
    }
  }, [activityLog, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("sg_auth", String(isAuthenticated));
    }
  }, [isAuthenticated, isLoaded]);

  const toggleLike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.liked;
          const likesCount = isLiked ? post.likes + 1 : Math.max(0, post.likes - 1);
          
          // Registrar actividad si es like positivo
          if (isLiked) {
            const newAct: Activity = {
              id: `act_${Date.now()}`,
              type: "like",
              text: `Le dio me gusta a la publicación de ${post.author.name}`,
              time: "Ahora mismo",
              accent: "#FF6B6B",
            };
            setActivityLog((prev) => [newAct, ...prev]);
          }

          return { ...post, liked: isLiked, likes: likesCount };
        }
        return post;
      })
    );
  };

  const toggleSave = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isSaved = !post.saved;
          const savesCount = isSaved ? post.saves + 1 : Math.max(0, post.saves - 1);

          // Registrar actividad
          const newAct: Activity = {
            id: `act_${Date.now()}`,
            type: "save",
            text: isSaved 
              ? `Guardó la publicación: "${post.title || post.body.substring(0, 25)}..."`
              : `Quitó de guardados: "${post.title || post.body.substring(0, 25)}..."`,
            time: "Ahora mismo",
            accent: "#3094FF",
          };
          setActivityLog((prev) => [newAct, ...prev]);

          return { ...post, saved: isSaved, saves: savesCount };
        }
        return post;
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      authorName: currentUser.name,
      avatar: currentUser.avatar,
      text: text.trim(),
      createdAt: "Ahora mismo",
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const updatedCommentsList = post.commentsList ? [...post.commentsList, newComment] : [newComment];
          
          // Registrar actividad
          const newAct: Activity = {
            id: `act_${Date.now()}`,
            type: "comment",
            text: `Comentó en la publicación de ${post.author.name}: "${text.substring(0, 20)}..."`,
            time: "Ahora mismo",
            accent: "#4CAF50",
          };
          setActivityLog((prev) => [newAct, ...prev]);

          return {
            ...post,
            comments: post.comments + 1,
            commentsList: updatedCommentsList,
          };
        }
        return post;
      })
    );
  };

  const purchasePost = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          // Registrar actividad de compra
          const newAct: Activity = {
            id: `act_${Date.now()}`,
            type: "save",
            text: `Adquirió con éxito el recurso Premium: "${post.title}"`,
            time: "Ahora mismo",
            accent: "#FFD700",
          };
          setActivityLog((prev) => [newAct, ...prev]);

          return { ...post, purchased: true };
        }
        return post;
      })
    );
  };

  const reportPost = (postId: string, reason: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          // Registrar actividad
          const newAct: Activity = {
            id: `act_${Date.now()}`,
            type: "comment",
            text: `Reportó la publicación de ${post.author.name} por: "${reason}" (DMCA)`,
            time: "Ahora mismo",
            accent: "#FF6B6B",
          };
          setActivityLog((prev) => [newAct, ...prev]);

          return { ...post, reported: true };
        }
        return post;
      })
    );
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
    const newPost: Post = {
      id: `p_${Date.now()}`,
      author: currentUser,
      type: newPostData.type,
      title: newPostData.title,
      body: newPostData.body,
      tags: newPostData.tags,
      likes: 0,
      comments: 0,
      commentsList: [],
      saves: 0,
      createdAt: "Ahora mismo",
      isPremium: newPostData.isPremium,
      price: newPostData.price,
      subject: newPostData.subject,
      liked: false,
      saved: false,
      purchased: false,
      reported: false,
    };

    setPosts((prev) => [newPost, ...prev]);

    // Registrar actividad de publicación
    const newAct: Activity = {
      id: `act_${Date.now()}`,
      type: "publish",
      text: `Publicó un nuevo contenido: "${newPost.title || newPost.body.substring(0, 25)}..."`,
      time: "Ahora mismo",
      accent: "#20B2AA",
    };
    setActivityLog((prev) => [newAct, ...prev]);
  };

  const addTodoItem = (text: string, label: Todo["label"], priority: Todo["priority"], dueDate?: string) => {
    const newTodo: Todo = {
      id: `t_${Date.now()}`,
      text,
      done: false,
      label,
      priority,
      dueDate: dueDate || undefined,
    };

    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodoItem = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTodoItem = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const updateBio = (newBio: string) => {
    setCurrentUser((prev) => ({ ...prev, bio: newBio }));
  };

  const loginUser = () => setIsAuthenticated(true);
  const logoutUser = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("sg_auth");
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        posts,
        todos,
        activityLog,
        isAuthenticated,
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
