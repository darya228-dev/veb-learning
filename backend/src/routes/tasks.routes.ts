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
import * as service from "../services/tasks.service";
import * as tasksService from "../services/tasks.service";
const router = Router();

router.get("/stats", async (req, res, next) => {
    try {
        const stats = await tasksService.getStats();
        res.json(stats);
    }
    catch (e) {
        next(e);
    }
});
router.get("/with-users", wrap(service.getWithUsers));
router.get("/", wrap(getAll));
router.post("/", wrap(create));
router.get("/:id", wrap(getById));
router.put("/:id", wrap(update));
router.delete("/:id", wrap(remove));

export default router;