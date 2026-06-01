import type { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";

export const requireAuth = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    if (session == null) {
        return res
            .status(401)
            .json({ message: "user unathorized, register or login first" });
    }
    next();
};
