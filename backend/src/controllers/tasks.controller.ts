import { Request, Response } from "express";
import * as service from "../services/tasks.service";

interface TaskParams {
  id: string;
}

export const getAll = async (req: Request, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const status = req.query.status ? String(req.query.status) : undefined;

  const result = await service.getAll(
    {
      page,
      limit,
      status
    },
    req.currentUserId,
    req.currentUserRole
  );

  res.json(result);
};

export const getById = async (req: Request<TaskParams>, res: Response) => {
  const task = await service.getById(
    req.params.id,
    req.currentUserId!,
    req.currentUserRole
  );

  res.json(task);
};

export const create = async (req: Request, res: Response) => {
  const task = await service.create(req.body, req.currentUserId!);
  res.status(201).json(task);
};

export const update = async (req: Request<TaskParams>, res: Response) => {
  const task = await service.update(
    req.params.id,
    req.body,
    req.currentUserId!,
    req.currentUserRole
  );

  res.json(task);
};

export const remove = async (req: Request<TaskParams>, res: Response) => {
  await service.remove(
    req.params.id,
    req.currentUserId!,
    req.currentUserRole
  );

  res.status(204).send();
};

export const getStats = async (req: Request, res: Response) => {
  const result = await service.getStats(
    req.currentUserId!,
    req.currentUserRole
  );

  res.json(result);
};