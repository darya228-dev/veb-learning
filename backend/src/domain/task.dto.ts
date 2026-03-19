export type TaskStatus = "open" | "in_progress" | "done";

export interface Task {
  id: string;
  subject: string;
  status: TaskStatus;
  priority?: string;
  message?: string;
  author?: string;
}

export type CreateTaskDto = Omit<Task, "id">;

export function createTaskDto(data: any): CreateTaskDto {
  return {
    subject: data.subject,
    status: data.status,
    priority: data.priority,
    message: data.message,
    author: data.author
  };
}