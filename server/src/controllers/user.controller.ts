import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { logger } from "better-auth";

export const getInfo = async (req: Request, res: Response) => {
    const username = req.params.username;
    if (!username) {
        return res.status(400).json({ message: "invalid user id" });
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username as string,
            },
            select: {
                name: true,
                image: true,
                createdAt: true,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        return res.status(200).json({
            name: user.name,
            image: user.image,
            createdAt: user.createdAt,
        });
    } catch (err) {
        logger.error("ERROR FETCHING USER INFO", err);
        return res.status(500).json({ message: "internal server error" });
    }
};

export const getUserBlogs = async (req: Request, res: Response) => {
    const username = req.params.username;
    let page = Number(req.query.page) || 1;
    if (page < 0) page = 1;
    let limit = Number(req.query.limit) || 20;
    if (limit > 20) limit = 20;
    if (limit < 0) limit = 1;
    if (!username) {
        return res.status(400).json({ message: "username not provided" });
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username as string,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        const blogs = await prisma.blog.findMany({
            where: {
                authorId: user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
            skip: (page - 1) * limit,
            take: limit,
            select: {
                title: true,
                slug: true,
            },
        });
        return res.status(200).json({ blogs });
    } catch (err) {
        logger.error("ERROR FETCHING USER'S BLOGS", err);
        return res.status(500).json({ message: "internal server error" });
    }
};
