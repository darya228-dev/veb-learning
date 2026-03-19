import { Task, CreateTaskDto } from "../domain/task.dto";

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

export const update = (id: string, data: Partial<Task>): Task | null => {
  const task = tasks.find(t => t.id === id);
  if (!task) return null;

  Object.assign(task, data);
  return task;
};

export const remove = (id: string): void => {
  tasks = tasks.filter(t => t.id !== id);
};