/**
 * Seeds the SQLite database with the same mock content that used to live in
 * app/utils/data.ts, so the app has something to show on first run.
 *
 * Usage:
 *   npm run db:seed
 *
 * Safe to re-run: it wipes and recreates all tables every time, so you
 * always get back to a known starting state.
 */
import bcrypt from "bcryptjs";
import { db } from "../app/lib/db";

const SEED_PASSWORD = "password123"; // same password for every seeded user — see README

interface SeedUser {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: "student" | "creator" | "moderator";
  university: string;
  followers: number;
  following: number;
  bio: string;
}

const USERS: SeedUser[] = [
  {
    id: "u1",
    name: "Valentina Cruz",
    username: "vcruz",
    email: "vcruz@demo.scholargrid.com",
    avatar: "VC",
    role: "student",
    university: "UNAM",
    followers: 312,
    following: 89,
    bio: "CS @ UNAM · Interested in ML, distributed systems & academic equity.",
  },
  {
    id: "u2",
    name: "Diego Ramírez",
    username: "dramirez",
    email: "dramirez@demo.scholargrid.com",
    avatar: "DR",
    role: "creator",
    university: "IPN",
    followers: 1402,
    following: 210,
    bio: "Math & Physics educator. Creator of premium problem sets.",
  },
  {
    id: "u3",
    name: "Sofia Herrera",
    username: "sherrera",
    email: "sherrera@demo.scholargrid.com",
    avatar: "SH",
    role: "creator",
    university: "TEC",
    followers: 890,
    following: 134,
    bio: "Data Science instructor. Building structured learning paths.",
  },
];

interface SeedPost {
  id: string;
  authorId: string;
  type: "post" | "book" | "course" | "resource";
  title?: string;
  body: string;
  tags: string[];
  saves: number;
  isPremium: boolean;
  price?: number;
  subject?: string;
  likedByUserIds: string[]; // which seed users "already" liked this post
}

const POSTS: SeedPost[] = [
  {
    id: "p1",
    authorId: "u2",
    type: "post",
    body: "Just wrapped up a full derivation of the Fourier Transform from first principles. Thread below — DM me for the LaTeX source. This is the approach I use with my students and it cuts confusion by ~60%.",
    tags: ["math", "calculus", "fourier"],
    saves: 91,
    isPremium: false,
    subject: "Mathematics",
    likedByUserIds: [],
  },
  {
    id: "p2",
    authorId: "u3",
    type: "course",
    title: "Intro to Data Science with Python — 2025 Edition",
    body: "12 modules, 40+ notebooks, real datasets. Covers pandas, sklearn, visualization and a final capstone project. Fully updated for Python 3.12.",
    tags: ["python", "datascience", "ML"],
    saves: 203,
    isPremium: true,
    price: 149,
    subject: "Data Science",
    likedByUserIds: ["u1"],
  },
  {
    id: "p3",
    authorId: "u1",
    type: "resource",
    title: "Algorithms Cheat Sheet — Big O Reference",
    body: "One-page reference for Big O complexities across sorting, searching, graph, and DP algorithms. PDF available. Great for technical interview prep.",
    tags: ["algorithms", "cs", "interview"],
    saves: 430,
    isPremium: false,
    subject: "Computer Science",
    likedByUserIds: ["u1", "u2", "u3"],
  },
  {
    id: "p4",
    authorId: "u2",
    type: "book",
    title: "Linear Algebra: Intuition Before Formalism",
    body: "A 200-page ebook that builds visual intuition for vector spaces, eigenvalues, and SVD before introducing notation. Ideal for ML practitioners.",
    tags: ["linearalgebra", "ebook", "ML"],
    saves: 188,
    isPremium: true,
    price: 89,
    subject: "Mathematics",
    likedByUserIds: [],
  },
  {
    id: "p5",
    authorId: "u3",
    type: "post",
    body: "Hot take: most universities still teach statistics from 1970s textbooks. Here are 5 modern resources that actually teach you how to think probabilistically in 2025.",
    tags: ["statistics", "education", "resources"],
    saves: 77,
    isPremium: false,
    subject: "Statistics",
    likedByUserIds: [],
  },
];

const TODOS = [
  { id: "t1", userId: "u1", text: "Finish Chapter 5 exercises — Discrete Math", done: false, label: "assignment", dueDate: "Today", priority: "high" },
  { id: "t2", userId: "u1", text: "Review lecture notes for Algorithms midterm", done: false, label: "exam", dueDate: "Jun 6", priority: "high" },
  { id: "t3", userId: "u1", text: "Read Ramírez's Fourier Transform thread", done: true, label: "study", dueDate: null, priority: "low" },
  { id: "t4", userId: "u1", text: "Submit final project report draft", done: false, label: "project", dueDate: "Jun 10", priority: "medium" },
  { id: "t5", userId: "u1", text: "Set up Python environment for DS course", done: true, label: "study", dueDate: null, priority: "medium" },
  { id: "t6", userId: "u1", text: "Buy Linear Algebra ebook", done: false, label: "personal", dueDate: null, priority: "low" },
] as const;

const ACTIVITIES = [
  { id: "a1", userId: "u1", type: "like", text: "Le dio me gusta a la publicación de la Transformada de Fourier de Diego", accent: "#FF6B6B" },
  { id: "a2", userId: "u1", type: "save", text: "Guardó el curso de Introducción a Ciencia de Datos", accent: "#3094FF" },
  { id: "a3", userId: "u1", type: "comment", text: "Comentó en la hoja de trucos de Algoritmos", accent: "#4CAF50" },
  { id: "a4", userId: "u1", type: "publish", text: "Publicó el recurso de la hoja de trucos de Algoritmos", accent: "#20B2AA" },
  { id: "a5", userId: "u1", type: "follow", text: "Comenzó a seguir a Sofia Herrera", accent: "#7B68EE" },
] as const;

async function seed() {
  console.log("Seeding database...");

  // Wipe in FK-safe order, then let app/lib/db.ts's CREATE TABLE IF NOT
  // EXISTS calls (already run on import) stand as the schema.
  db.exec(`
    DELETE FROM activity;
    DELETE FROM comments;
    DELETE FROM likes;
    DELETE FROM saves;
    DELETE FROM purchases;
    DELETE FROM todos;
    DELETE FROM posts;
    DELETE FROM sessions;
    DELETE FROM users;
  `);

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  const insertUser = db.prepare(
    `INSERT INTO users (id, name, username, email, password_hash, avatar, role, university, followers, following, bio)
     VALUES (@id, @name, @username, @email, @passwordHash, @avatar, @role, @university, @followers, @following, @bio)`
  );
  for (const u of USERS) {
    insertUser.run({ ...u, passwordHash });
  }
  console.log(`  ${USERS.length} users created (password for all: "${SEED_PASSWORD}")`);

  const insertPost = db.prepare(
    `INSERT INTO posts (id, author_id, type, title, body, tags, saves, is_premium, price, subject)
     VALUES (@id, @authorId, @type, @title, @body, @tags, @saves, @isPremium, @price, @subject)`
  );
  const insertLike = db.prepare(
    `INSERT INTO likes (post_id, user_id) VALUES (?, ?)`
  );
  for (const p of POSTS) {
    insertPost.run({
      id: p.id,
      authorId: p.authorId,
      type: p.type,
      title: p.title ?? null,
      body: p.body,
      tags: JSON.stringify(p.tags),
      saves: p.saves,
      isPremium: p.isPremium ? 1 : 0,
      price: p.price ?? null,
      subject: p.subject ?? null,
    });
    for (const uid of p.likedByUserIds) {
      insertLike.run(p.id, uid);
    }
  }
  console.log(`  ${POSTS.length} posts created`);

  // One welcoming seed comment per post, matching the original frontend's
  // "enrich initial posts with a comment" behavior.
  const insertComment = db.prepare(
    `INSERT INTO comments (id, post_id, author_id, text) VALUES (?, ?, ?, ?)`
  );
  for (const p of POSTS) {
    insertComment.run(
      `c_init_${p.id}`,
      p.id,
      "u3", // arbitrary seed commenter
      "¡Excelente material! Me sirvió muchísimo para repasar."
    );
  }

  const insertTodo = db.prepare(
    `INSERT INTO todos (id, user_id, text, done, label, due_date, priority)
     VALUES (@id, @userId, @text, @done, @label, @dueDate, @priority)`
  );
  for (const t of TODOS) {
    insertTodo.run({ ...t, done: t.done ? 1 : 0 });
  }
  console.log(`  ${TODOS.length} todos created (for u1 / Valentina)`);

  const insertActivity = db.prepare(
    `INSERT INTO activity (id, user_id, type, text, accent) VALUES (@id, @userId, @type, @text, @accent)`
  );
  for (const a of ACTIVITIES) {
    insertActivity.run(a);
  }
  console.log(`  ${ACTIVITIES.length} activity entries created`);

  console.log("\nSeed complete. Demo accounts (all use the same password):");
  for (const u of USERS) {
    console.log(`  ${u.email}  /  ${SEED_PASSWORD}  (${u.name})`);
  }
}

seed()
  .then(() => {
    console.log("\nDone.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
