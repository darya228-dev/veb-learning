import { Request, Response } from "express";
import * as service from "../services/tasks.service";

interface TaskParams {
  id: string;
}

export const getAll = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  console.log('page', page, 'limit', limit, 'status', req.query.status);
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const result = service.getAll({
    page,
    limit,
    status,
  });
  return res.json(result);
};

export const getById = async (req: Request<TaskParams>, res: Response) => {
  const task = service.getById(req.params.id);
  res.json(task);
};

// export const create = async (req: Request, res: Response) => {
//   const task = service.create(req.body);
//   res.status(201).json(task);
// };
export const create = async (req: Request, res: Response) => {
  console.log("BODY RAW:", req.body);
  const task = service.create(req.body);
  res.status(201).json(task);
};

export const update = async (req: Request<TaskParams>, res: Response) => {
  const task = service.update(req.params.id, req.body);
  res.json(task);
};

export const remove = async (req: Request<TaskParams>, res: Response) => {
  service.remove(req.params.id);
  res.status(204).send();
};