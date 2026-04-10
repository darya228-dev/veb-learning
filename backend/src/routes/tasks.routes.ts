import { Router } from "express";
import wrap from "../infrastructure/wrap";
import {
    getAll,
    getById,
    create,
    update,
    remove,
    getStats
} from "../controllers/tasks.controller";

const router = Router();

router.get("/stats", wrap(getStats));
router.get("/", wrap(getAll));
router.post("/", wrap(create));
router.get("/:id", wrap(getById));
router.put("/:id", wrap(update));
router.delete("/:id", wrap(remove));

export default router;