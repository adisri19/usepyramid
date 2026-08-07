export type TaskStatus = "To Do" | "Doing" | "Completed" | "On Hold" | "Backlog";
export type Priority = "No Priority" | "Urgent" | "High" | "Medium" | "Low";
export interface User {
    id: string;
    email?: string;
    fullName?: string;
    title?: string;
    username?: string;
    avatarUrl?: string;
    isGuest: boolean;
    provider: "google" | "guest";
    createdAt: string;
    updatedAt: string;
}
export interface Workspace {
    id: string;
    name: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
}
export interface Project {
    id: string;
    name: string;
    priority: Priority;
    lead?: User | string;
    workspace: string;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
}
export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: Priority;
    assignee?: User | string;
    reporter?: User | string;
    project?: Project | string;
    workspace: string;
    parentTask?: string;
    labels: string[];
    dueDate?: string;
    startDate?: string;
    createdAt: string;
    updatedAt: string;
}
export interface Comment {
    id: string;
    task: string;
    author: User;
    body: string;
    createdAt: string;
    updatedAt: string;
}
//# sourceMappingURL=index.d.ts.map