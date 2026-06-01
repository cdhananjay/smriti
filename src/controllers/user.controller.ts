import type {Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getInfo = async (req: Request, res: Response) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(401).json({message: "invalid user id"});
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId as string
            }
        })
        if (!user) {
            return res.status(404).json({message: "user not found"});
        }
        return res.status(200).json(user);
    } catch (err) {
        console.log("ERROR FETCHING USER INFO", err);
        return res.status(500).json({message: "internal server error"})
    }
}