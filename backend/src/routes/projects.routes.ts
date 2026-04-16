import { Router, Request, Response } from "express";
import * as store from "../store/projects.store";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const projects = await store.getAll();
  res.json(projects);
});

router.post("/", async (req: Request, res: Response) => {
  const project = await store.add(req.body.name);
  res.status(201).json(project);
});

export default router;