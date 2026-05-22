import ApiError from "../infrastructure/apiError";
import * as store from "../store/tasks.store";
import { STATUSES, PRIORITIES, Task, CreateTaskDto, UpdateTaskDto, createTaskDto } from "../domain/task.dto";
import { oneOfEnum, requireString, optionalString } from "../infrastructure/validation";
import { db } from "../infrastructure/db";

export const getAll = async (
  params: {
    page?: number;
    limit?: number;
    status?: string;
  }
) => {
  const page = params.page && params.page > 0
    ? params.page
    : 1;

  const limit = params.limit && params.limit > 0
    ? params.limit
    : 5;

  if (params.status) {
    oneOfEnum(params.status, STATUSES, "status");
  }

  const result = await store.getPaginated(
    page,
    limit,
    params.status
  );

  return {
    data: result.items,
    meta: {
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit)
    }
  };
};

export const getById = async (id: string) => {
  const task = await store.getById(id);
  if (!task) throw new ApiError(404, "NOT_FOUND", "Task not found");
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

  return await store.add(taskDto);
};


export const update = async (id: string, data: UpdateTaskDto): Promise<Task> => {
  const task = await store.getById(id);

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
  const task = await store.getById(id);

  if (!task) {
    throw new ApiError(404, "NOT_FOUND", "Task not found");
  }

  await store.remove(id);
};

export const getStats = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT 
        status,
        COALESCE(priority, 'Undefined') as priority,
        COUNT(*) as count
      FROM tasks
      GROUP BY status, priority
      ORDER BY status, priority
      `,
      (err, rows: any[]) => {
        if (err) return reject(err);

        resolve({
          data: rows
        });
      }
    );
  });
};

export const getUserRoleStats = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT role, COUNT(*) as count
      FROM users
      GROUP BY role
      `,
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows as any[]);
      }
    );
  });
};


export const getWithUsers = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT t.*, u.name as userName
      FROM tasks t
      LEFT JOIN users u ON t.userId = u.id
      `,
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

console.log("SERVICE GET ALL");