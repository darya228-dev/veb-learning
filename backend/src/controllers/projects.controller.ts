import { Router, Request, Response } from "express";

const router = Router();

let projects: { id: string; name: string }[] = [];

router.get("/projects", (req: Request, res: Response) => {
  res.json(projects);
});

router.post("/projects", (req: Request, res: Response) => {
  const project = {
    id: Date.now().toString(),
    name: req.body.name
  };

  projects.push(project);

  res.status(201).json(project);
});

export default router;