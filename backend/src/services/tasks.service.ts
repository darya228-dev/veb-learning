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

type ValidationErrorItem = {
  field: string;
  message: string;
};

export const create = (data: CreateTaskDto): Task => {

  const errors: ValidationErrorItem[] = [];
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
    const fields = errors.map(e => e.field);

    let message = "Validation failed";

    if (fields.includes("status") && fields.includes("priority")) {
      message = "Status and Priority are invalid";
    } else if (fields.includes("status")) {
      message = "Status is invalid";
    } else if (fields.includes("priority")) {
      message = "Priority is invalid";
    }

    throw new ApiError(400, "VALIDATION_ERROR", message, errors);
  }

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

export const getStats = () => {
  const tasks = store.getAll();

  const byStatus: Record<string, number> = {};
  const byPriority: Record<string, number> = {};
  const byStatusPriority: Record<string, Record<string, number>> = {};

  for (const task of tasks) {
    byStatus[task.status] = (byStatus[task.status] || 0) + 1;

    if (task.priority) {
      byPriority[task.priority] = (byPriority[task.priority] || 0) + 1;
    }

    if (!byStatusPriority[task.status]) {
      byStatusPriority[task.status] = {};
    }

    if (task.priority) {
      byStatusPriority[task.status][task.priority] = (byStatusPriority[task.status][task.priority] || 0) + 1;
    }

  }
  return { byPriority, byStatus, byStatusPriority };
};