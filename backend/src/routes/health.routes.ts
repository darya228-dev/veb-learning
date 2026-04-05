import { Router } from "express";
import * as controller from "../controllers/health.controller";
import wrap from "../infrastructure/wrap";

const router = Router();


router.get("/health", wrap(controller.health));

export default router;