import * as store from "../store/tasks.store";
import { createTaskDto, Task, CreateTaskDto } from "../domain/task.dto";
import ApiError from "../infrastructure/apiError";

export const getAll = (filters: any): Task[] => {
  let result = store.getAll();

  if (filters.status) {
    result = result.filter(t => t.status === filters.status);
  }

  return result;
};

export const getById = (id: string): Task => {
  const task = store.getById(id);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return task;
};

export const create = (data: CreateTaskDto): Task => {
  const task = createTaskDto(data);
  return store.add(task);
};

export const update = (id: string, data: Partial<Task>): Task => {
  const task = store.update(id, data);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return task;
};

export const remove = (id: string): void => {
  store.remove(id);
};