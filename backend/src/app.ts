import express, { Request, Response } from "express";
import cors from "cors";

// ВАЖЛИВО: залишаємо .js в імпортах, навіть якщо файли зараз .ts
import tasksRoutes from "./routes/tasks.routes";
import projectsRoutes from "./routes/projects.routes";
import healthRoutes from "./routes/health.routes";
import errorMiddleware from "./infrastructure/errorMiddleware";

const app = express();

app.use(cors());
app.use(express.json());

// Головна сторінка, щоб не було "Cannot GET /"
app.get("/", (req: Request, res: Response) => {
  res.send(`
    <h1>Сервер запрацював! 🚀</h1>
    <p>Доступні маршрути:</p>
    <ul>
      <li><a href="/health">/health</a></li>
      <li><a href="/api/v1/tasks">/api/v1/tasks</a></li>
      <li><a href="/api/v1/projects">/api/v1/projects</a></li>
    </ul>
  `);
});

// Підключення роутів
app.use("/api/v1/tasks", tasksRoutes);
app.use("/api/v1/projects", projectsRoutes);
app.use("/", healthRoutes);

// Обробка неіснуючих маршрутів (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Маршрут не знайдено" });
});

// Глобальний обробник помилок (має бути останнім)
app.use(errorMiddleware);

export default app;