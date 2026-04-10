import ApiError from "../infrastructure/apiError";
import * as store from "../store/tasks.store";
import { STATUSES, PRIORITIES, Task, CreateTaskDto, UpdateTaskDto, createTaskDto } from "../domain/task.dto";
import { oneOfEnum, requireString, optionalString } from "../infrastructure/validation";
import { db } from "../infrastructure/db"; // ← ТИ ЗАБУВ ІМПОРТ


export const getAll = async (params: { page?: number; limit?: number; status?: string }) => {
  let result = await store.getAll(); // ← ФІКС

  if (params.status) {
    if (!STATUSES.includes(params.status as any)) {
      throw new ApiError(400, "VALIDATION_ERROR", `Invalid status: ${params.status}`);
    }
    result = result.filter(t => t.status === params.status);
  }

  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;

  const start = (page - 1) * limit;
  const paginated = result.slice(start, start + limit);

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

export const getById = async (id: string): Promise<Task> => {
  const task = await store.getById(id); // ← ФІКС

  if (!task) {
    throw new ApiError(404, "NOT_FOUND", "Task not found");
  }

  return task;
};


export const create = async (data: CreateTaskDto): Promise<Task> => {
  const errors: { field: string; message: string }[] = [];

  try {
    oneOfEnum(data.status, STATUSES, "status");
  } catch (e) {
    if (e instanceof Error) {
      errors.push({ field: "status", message: e.message });
    }
  }

  if (data.priority) {
    try {
      oneOfEnum(data.priority, PRIORITIES, "priority");
    } catch (e) {
      if (e instanceof Error) {
        errors.push({ field: "priority", message: e.message });
      }
    }
  }

  if (errors.length) {
    throw new ApiError(400, "VALIDATION_ERROR", "Validation failed", errors);
  }

  optionalString(data.message, "message");
  optionalString(data.author, "author");

  const taskDto = createTaskDto(data);

  return await store.add(taskDto); // ← ФІКС
};


export const update = async (id: string, data: UpdateTaskDto): Promise<Task> => {
  const task = await store.getById(id); // ← ФІКС

  if (!task) {
    throw new ApiError(404, "NOT_FOUND", "Task not found");
  }

  requireString(data.subject, "subject");
  oneOfEnum(data.status, STATUSES, "status");
  if (data.priority) oneOfEnum(data.priority, PRIORITIES, "priority");

  optionalString(data.message, "message");
  optionalString(data.author, "author");

  const updatedTask = await store.update(id, data);

  if (!updatedTask) {
    throw new ApiError(500, "INTERNAL_ERROR", "Failed to update task");
  }

  return updatedTask;
};


export const remove = async (id: string): Promise<void> => {
  const task = await store.getById(id); // ← ФІКС

  if (!task) {
    throw new ApiError(404, "NOT_FOUND", "Task not found");
  }

  await store.remove(id);
};


export const getStats = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT status, COUNT(*) as count FROM tasks GROUP BY status`,
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows as any[]);
      }
    );
  });
};


export const getWithUsers = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT t.*, u.name as userName
       FROM tasks t
       LEFT JOIN users u ON t.userId = u.id`,
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows as any[]);
      }
    );
  });
};