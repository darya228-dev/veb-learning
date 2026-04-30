import { Request, Response } from "express";
import * as service from "../services/tasks.service";

interface TaskParams {
  id: string;
}

export const getAll = async (req: Request, res: Response) => {
  const result = await service.getAll({
    page: 1,
    limit: 10,
  });

  res.json(result);
};

export const getById = async (req: Request<TaskParams>, res: Response) => {
  const task = await service.getById(req.params.id);
  res.json(task);
};

export const create = async (req: Request, res: Response) => {
  const task = await service.create(req.body);
  res.status(201).json(task);
};

export const update = async (req: Request<TaskParams>, res: Response) => {
  const task = await service.update(req.params.id, req.body);
  res.json(task);
};

export const remove = async (req: Request<TaskParams>, res: Response) => {
  await service.remove(req.params.id);
  res.status(204).send();
};

export const getStats = async (req: Request, res: Response) => {
  const result = await service.getStats();
  res.json(result);
};