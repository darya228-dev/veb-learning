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
import * as service from "../services/tasks.service"; // 🔥 ОЦЕ ТРЕБА ДОДАТИ

const router = Router();
router.get("/stats", wrap(getStats));
router.get("/with-users", wrap(service.getWithUsers)); // або окремо

router.get("/", wrap(getAll));
router.post("/", wrap(create));

router.get("/:id", wrap(getById));
router.put("/:id", wrap(update));
router.delete("/:id", wrap(remove));

router.get("/with-users", async (req, res, next) => {
    try {
        const data = await service.getWithUsers();
        res.json(data);
    } catch (err) {
        next(err);
    }
});

export default router;