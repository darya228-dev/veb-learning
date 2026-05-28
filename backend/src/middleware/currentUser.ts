import { Request, Response, NextFunction } from "express";
import { db } from "../infrastructure/db";
import ApiError from "../infrastructure/apiError";

declare global {
    namespace Express {
        interface Request {
            currentUserId?: string;
            currentUserRole?: string;
        }
    }
}

export default function currentUser(req: Request, res: Response, next: NextFunction) {
    const userId = req.header("X-Demo-UserId");

    if (!userId) {
        return next(new ApiError(401, "UNAUTHORIZED", "X-Demo-UserId header is required"));
    }

    db.get("SELECT id, role FROM users WHERE id = ?", [userId], (err, row: any) => {
        if (err) return next(err);

        if (!row) {
            return next(new ApiError(401, "UNAUTHORIZED", "Invalid user"));
        }

        req.currentUserId = row.id;
        req.currentUserRole = row.role;

        next();
    });
}