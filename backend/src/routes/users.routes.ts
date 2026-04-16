import { Router, Request, Response } from "express";
import * as store from "../store/users.store";

const router = Router();

type IdParams = {
    id: string;
};

router.get("/", async (req: Request, res: Response) => {
    const users = await store.getAll();
    res.json(users);
});

router.get("/:id", async (req: Request<IdParams>, res: Response) => {
    const user = await store.getById(req.params.id);

    if (!user) return res.status(404).json({ error: "Not found" });

    res.json(user);
});

router.post("/", async (req: Request, res: Response) => {
    if (!req.body.name) {
        return res.status(400).json({ error: "Name required" });
    }

    const user = await store.add(req.body.name);
    res.status(201).json(user);
});

router.delete("/:id", async (req: Request<IdParams>, res: Response) => {
    await store.remove(req.params.id);
    res.status(204).send();
});

export default router;