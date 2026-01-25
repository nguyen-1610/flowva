// UI Types for components (from flowva)
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE'
}

export enum ViewType {
  DASHBOARD = 'DASHBOARD',
  BACKLOG = 'BACKLOG',
  KANBAN = 'KANBAN',
  CALENDAR = 'CALENDAR',
  CHAT = 'CHAT',
  SETTINGS = 'SETTINGS'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
}

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
