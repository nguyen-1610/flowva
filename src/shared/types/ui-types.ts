/**
 * UI Types - Frontend Component Types
 *
 * Chứa types cho UI components (không liên quan đến Database/Backend)
 * Dùng cho: Dashboard, Chat, Calendar UI components
 */

// --- VIEW & NAVIGATION ---
export enum ViewType {
  DASHBOARD = 'DASHBOARD',
  BACKLOG = 'BACKLOG',
  KANBAN = 'KANBAN',
  CALENDAR = 'CALENDAR',
  CHAT = 'CHAT',
  SETTINGS = 'SETTINGS',
}

// --- TASK STATUS (UI Display) ---
// Note: Nếu cần sync với Backend, import từ tasks.ts
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

// --- USER (UI Display) ---
// Lightweight user info cho UI components
export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
}

// --- TASK (UI Display) ---
// Simplified task cho UI components (mock data, prototypes)
// Production: Dùng TaskDTO từ tasks.ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignees: User[];
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  tag: string;
  sprint?: string;
}

// --- CHAT ---
export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  attachments?: { type: 'image' | 'file'; url: string; name: string }[];
}

export interface ChatThread {
  id: string;
  name: string;
  type: 'direct' | 'group';
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}
