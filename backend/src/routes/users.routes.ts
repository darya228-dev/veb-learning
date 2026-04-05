import { Router, Request, Response } from "express";
import * as store from "../store/users.store";

const router = Router();

router.get("/", (req, res) => {
    res.json(store.getAll());
});

router.get("/:id", (req, res) => {
    const user = store.getById(req.params.id);
    if (!user) return res.status(404).json({ error: "Not found" });

    res.json(user);
});

router.post("/", (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ error: "Name required" });
    }

    const user = store.add(req.body.name);
    res.status(201).json(user);
});

router.delete("/:id", (req, res) => {
    store.remove(req.params.id);
    res.status(204).send();
});

export default router;