import express from "express";
import cors from "cors";

import logger from "./middleware/logger";
import tasksRoutes from "./routes/tasks.routes";
import projectsRoutes from "./routes/projects.routes";
import usersRoutes from "./routes/users.routes";
import healthRoutes from "./routes/health.routes";
import errorMiddleware from "./infrastructure/errorMiddleware";

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

app.use(express.json());
app.use(logger);

app.use("/api/v1/tasks", tasksRoutes);
app.use("/api/v1/projects", projectsRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/health", healthRoutes);


app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});


export default app;