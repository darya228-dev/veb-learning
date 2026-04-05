export const STATUSES = ["Technical", "Physical", "Undefined"] as const;
export const PRIORITIES = ["Low", "Medium", "High"] as const;

export type Status = (typeof STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];

export interface Task {
  id: string;
  subject: string;
  status: Status;
  priority?: Priority;
  message?: string;
  author?: string;
}
export function createTaskDto(data: CreateTaskDto): CreateTaskDto {
  return {
    subject: data.subject,
    status: data.status,
    priority: data.priority,
    message: data.message,
    author: data.author,
  };
}
export type CreateTaskDto = Omit<Task, "id">;
export type UpdateTaskDto = Omit<Task, "id">;