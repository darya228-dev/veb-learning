import ApiError from "../infrastructure/apiError";
import * as store from "../store/tasks.store";
import { STATUSES, PRIORITIES, Task, CreateTaskDto, UpdateTaskDto, createTaskDto } from "../domain/task.dto";
import { oneOfEnum, requireString, optionalString } from "../infrastructure/validation";


export const getAll = (params: { page?: number; limit?: number; status?: string }) => {
  let result = store.getAll();

  if (params.status) {
    if (!STATUSES.includes(params.status as any)) {
      throw new ApiError(400, "VALIDATION_ERROR", `Invalid status: ${params.status}`);
    }
    result = result.filter(t => t.status === params.status);
  }

  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;
  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = result.slice(start, end);

  return {
    data: paginated,
    meta: {
      total: result.length,
      page,
      limit,
      totalPages: Math.ceil(result.length / limit),
    },
  };
};

export const getById = (id: string): Task => {
  const task = store.getById(id);
  if (!task) {
    throw new ApiError(404, "NOT_FOUND", "Task not found");
  }
  return task;
};


export const create = (data: CreateTaskDto): Task => {

  requireString(data.subject, "subject")
  oneOfEnum(data.status, STATUSES, "status");
  if (data.priority) oneOfEnum(data.priority, PRIORITIES, "priority");


  optionalString(data.message, "message");
  optionalString(data.author, "author");

  const taskDto = createTaskDto(data);
  return store.add(taskDto);
};


export const update = (id: string, data: UpdateTaskDto): Task => {
  const task = store.getById(id);
  if (!task) {
    throw new ApiError(404, "NOT_FOUND", "Task not found");
  }


  requireString(data.subject, "subject")
  oneOfEnum(data.status, STATUSES, "status");
  if (data.priority) oneOfEnum(data.priority, PRIORITIES, "priority");


  optionalString(data.message, "message");
  optionalString(data.author, "author");

  const updatedTask = store.update(id, data);
  if (!updatedTask) {
    throw new ApiError(500, "INTERNAL_ERROR", "Failed to update task");
  }

  return updatedTask;
};


export const remove = (id: string): void => {
  const task = store.getById(id);
  if (!task) {
    throw new ApiError(404, "NOT_FOUND", "Task not found");
  }
  store.remove(id);
};