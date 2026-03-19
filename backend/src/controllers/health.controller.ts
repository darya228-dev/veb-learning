import { Request, Response } from "express";
import * as service from "../services/health.service";

export const health = (req: Request, res: Response) => {
  res.json(service.health());
};