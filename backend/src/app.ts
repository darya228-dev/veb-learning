import express, { Request, Response } from "express";
import cors from "cors";

import logger from "./middleware/logger";
import tasksRoutes from "./routes/tasks.routes";
import projectsRoutes from "./routes/projects.routes";
import healthRoutes from "./routes/health.routes";
import errorMiddleware from "./infrastructure/errorMiddleware";
import usersRoutes from "./routes/users.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);
app.use(errorMiddleware);
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


app.use("/api/v1/tasks", tasksRoutes);
app.use("/api/v1/projects", projectsRoutes);
app.use("/", healthRoutes);


app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Маршрут не знайдено" });
});


app.use(errorMiddleware);

export default app;