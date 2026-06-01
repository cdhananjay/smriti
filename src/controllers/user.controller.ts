import type {Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getInfo = async (req: Request, res: Response) => {
    const username = req.params.username;
    if (!username) {
        return res.status(401).json({message: "invalid user id"});
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username as string
            }
        })
        if (!user) {
            return res.status(404).json({message: "user not found"});
        }
        return res.status(200).json({name: user.name, image: user.image, createdAt: user.createdAt});
    } catch (err) {
        console.log("ERROR FETCHING USER INFO", err);
        return res.status(500).json({message: "internal server error"})
    }
}