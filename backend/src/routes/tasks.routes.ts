import { Router } from "express";
import wrap from "../infrastructure/wrap";
import { getAll, getById, create, update, remove } from "../controllers/tasks.controller";

const router = Router();

router.get("/", wrap(getAll));
router.get("/:id", wrap(getById));
router.post("/", wrap(create));
router.put("/:id", wrap(update));
router.delete("/:id", wrap(remove));

export default router;