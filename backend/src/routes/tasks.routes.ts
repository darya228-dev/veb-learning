import { Router, Request, Response } from "express";
import wrap from "../infrastructure/wrap";
import currentUser from "../middleware/currentUser";
import {
    getAll,
    getById,
    create,
    update,
    remove,
    getStats
} from "../controllers/tasks.controller";
import * as tasksService from "../services/tasks.service";

const router = Router();

router.get("/stats", currentUser, wrap(getStats));

router.get("/with-users", currentUser, wrap(async (req: Request, res: Response) => {
    const data = await tasksService.getWithUsers();
    res.json(data);
}));

router.get("/", currentUser, wrap(getAll));
router.post("/", currentUser, wrap(create));
router.get("/:id", currentUser, wrap(getById));
router.put("/:id", currentUser, wrap(update));
router.delete("/:id", currentUser, wrap(remove));

export default router;