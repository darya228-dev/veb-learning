import { Router, Request, Response } from "express";

const router = Router();

// Тип для проекта
interface Project {
  id: string;
  name: string;
}

// Массив проектов
let projects: Project[] = [];

// GET /projects
router.get("/projects", (req: Request, res: Response) => {
  res.json(projects);
});

// POST /projects
router.post("/projects", (req: Request, res: Response) => {
  const project: Project = {
    id: Date.now().toString(),
    name: req.body.name,
  };

  projects.push(project);

  res.status(201).json(project);
});

export default router;