import type { Request, Response } from "express";
import slugify from "slugify";
import { prisma } from "../lib/prisma";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { logger } from "better-auth";
import { count } from "node:console";

const slugOptions = {
    replacement: "-", // replace spaces with replacement character, defaults to `-`
    lower: true, // convert to lower case, defaults to `false`
    strict: true, // strip special characters except replacement, defaults to `false`
    locale: "vi", // language code of the locale to use
    trim: true, // trim leading and trailing replacement chars, defaults to `true`
};

export const createBlog = async (req: Request, res: Response) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res
            .status(400)
            .json({ message: "Title and content is required." });
    }

    const slug = slugify(title, slugOptions) + "-" + Date.now();

    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    try {
        const blog = await prisma.blog.create({
            data: {
                content,
                slug,
                title,
                authorId: session!.user.id!,
            },
        });

        return res
            .status(201)
            .json({ slug: blog.slug, message: "blog created succesfully" });
    } catch (err) {
        logger.error("FAILED TO CREATE BLOG", err);
        return res.status(500).json({ message: "failed to create blog" });
    }
};

export const deleteBlog = async (req: Request, res: Response) => {
    const slug = req.params.slug;

    if (!slug) {
        return res.json(400).json({ message: "blog id not provided" });
    }

    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    try {
        const blog = await prisma.blog.findUnique({
            where: {
                slug: slug as string,
                authorId: session!.user.id,
            },
        });
        if (!blog) {
            return res.status(400).json({ message: "invalid blog id" });
        }
        await prisma.blog.delete({
            where: {
                id: blog.id,
            },
        });
        return res.status(200).json({ message: "blog deleted" });
    } catch (err) {
        logger.error("FAILED TO DELETE BLOG", err);
        return res.status(500).json({ message: "internal server error" });
    }
};

export const viewBlog = async (req: Request, res: Response) => {
    const slug = req.params.slug;

    if (!slug) {
        return res.status(400).json({ message: "invalid url, blog not found" });
    }

    try {
        const blog = await prisma.blog.findUnique({
            where: {
                slug: slug as string,
            },
            select: {
                title: true,
                content: true,
                createdAt: true,
                author: {
                    select: {
                        name: true,
                        image: true,
                        username: true,
                    },
                },
            },
        });
        if (!blog) {
            return res
                .status(404)
                .json({ message: "requested blog not found" });
        }
        return res.status(200).json(blog);
    } catch (err) {
        logger.error("ERROR FETCHING BLOG", err);
        return res.status(501).json({ message: "internal server error" });
    }
};

export const searchBlogs = async (req: Request, res: Response) => {
    const q = (req.query.query as string) || "";
    let page = Number(req.query.page) || 1;
    if (page < 1) page = 1;
    let limit = Number(req.query.limit) || 10;
    if (limit > 20) limit = 20;
    if (limit < 1) limit = 1;
    if (!q.trim()) {
        return res.status(400).json({ message: "search query is required" });
    }
    try {
        const [blogs, totalResult] = await Promise.all([
            prisma.$queryRaw`
                SELECT
                    b.title, b.slug, b."createdAt",
                    u.name as author_name,
                    u.image as author_image,
                    u.username as author_username,
                    ts_rank(
                        to_tsvector('english', coalesce(b.title, '') || ' ' || coalesce(b.content, '')),
                        plainto_tsquery('english', ${q})
                    ) as rank
                FROM "Blog" b
                JOIN "user" u ON u.id = b."authorId"
                WHERE
                    to_tsvector('english', coalesce(b.title, '') || ' ' || coalesce(b.content, ''))
                    @@ plainto_tsquery('english', ${q})
                ORDER BY rank DESC
                LIMIT ${limit}
                OFFSET ${(page - 1) * limit}
            `,
            prisma.$queryRaw<[{ count: bigint }]>`
                SELECT count(*) as count
                FROM "Blog" b
                WHERE
                    to_tsvector('english', coalesce(b.title, '') || ' ' || coalesce(b.content, ''))
                    @@ plainto_tsquery('english', ${q})
            `,
        ]);
        const total = Number(totalResult[0]?.count) || 0;
        return res.status(200).json({
            blogs,
            totalBlogs : total, 
        });
    } catch (err) {
        logger.error("ERROR SEARCHING BLOGS", err);
        return res.status(500).json({ message: "internal server error" });
    }
};