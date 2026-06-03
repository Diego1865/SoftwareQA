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

export interface Post {
  id: string;
  author: User;
  type: ContentType;
  title?: string;
  body: string;
  tags: Tag[];
  likes: number;
  comments: number;
  saves: number;
  createdAt: string;
  isPremium: boolean;
  price?: number;
  thumbnail?: string;
  subject?: string;
  liked?: boolean;
  saved?: boolean;
}

export interface Todo {
  id: string;
  text: string;
  done: boolean;
  label: "study" | "assignment" | "exam" | "personal" | "project";
  dueDate?: string;
  priority: "low" | "medium" | "high";
}
