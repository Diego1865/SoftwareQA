export type Screen = "feed" | "todo" | "upload" | "profile" | "login";

export type ContentType = "post" | "book" | "course" | "resource";
export type Tag = string;

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: "student" | "creator" | "moderator";
  university: string;
  followers: number;
  following: number;
  bio: string;
}

export interface Comment {
  id: string;
  authorName: string;
  avatar: string;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  author: User;
  type: ContentType;
  title?: string;
  body: string;
  tags: Tag[];
  likes: number;
  comments: number;
  commentsList?: Comment[];
  saves: number;
  createdAt: string;
  isPremium: boolean;
  price?: number;
  thumbnail?: string;
  subject?: string;
  liked?: boolean;
  saved?: boolean;
  purchased?: boolean;
  reported?: boolean;
}

export interface Todo {
  id: string;
  text: string;
  done: boolean;
  label: "study" | "assignment" | "exam" | "personal" | "project";
  dueDate?: string;
  priority: "low" | "medium" | "high";
}

export interface Activity {
  id: string;
  type: "like" | "save" | "comment" | "publish" | "follow";
  text: string;
  time: string;
  accent: string;
}
