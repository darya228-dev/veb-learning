import { Task, CreateTaskDto, UpdateTaskDto } from "../domain/task.dto";

let tasks: Task[] = [];

export const getAll = (): Task[] => tasks;

export const getById = (id: string): Task | undefined => {
  return tasks.find(t => t.id === id);
};

export const add = (task: CreateTaskDto): Task => {
  const newTask: Task = {
    ...task,
    id: Date.now().toString()
  };

  tasks.push(newTask);
  return newTask;
};

export const update = (id: string, data: UpdateTaskDto): Task | null => {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;

  const updatedTask: Task = { id, ...data };
  tasks[index] = updatedTask;

  return updatedTask;
};

export const remove = (id: string): void => {
  tasks = tasks.filter(t => t.id !== id);
};