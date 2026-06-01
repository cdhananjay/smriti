import type { Request, Response } from "express";
import slugify from "slugify";
import { prisma } from "../lib/prisma";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";

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
    return res.status(401).json({ message: "Title and content is required." });
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

    return res.status(201).json({ slug: blog.slug, message: "blog created succesfully" });
  } catch (err) {
    console.error("FAILED TO CREATE BLOG", err);
    return res.status(500).json({ message: "failed to create blog" });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  const slug = req.params.slug;

  if (!slug) {
    return res.json(401).json({ message: "blog id not provided" });
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
      return res.status(401).json({ message: "invalid blog id" });
    }
    await prisma.blog.delete({
      where: {
        id: blog.id,
      },
    });
    return res.status(200).json({ message: "blog deleted" });
  } catch (err) {
    console.error("FAILED TO DELETE BLOG");
    return res.status(500).json({ message: "internal server error" });
  }
};

export const viewBlog = async (req: Request, res: Response) => {
  const slug = req.params.slug;

  if (!slug) {
    return res.status(401).json({ message: "invalid url, blog not found" });
  }

  try {
    const blog = await prisma.blog.findUnique({
      where: {
        slug: slug as string,
      },
      select: {
        title : true,
        content: true,
        createdAt: true,
        author: {
          select: {
            name: true,
            image: true,
            username: true
          }
        }
      }
    });
    if (!blog) {
      return res.status(404).json({ message: "requested blog not found" });
    }
    return res.status(200).json(blog);
  } catch (err) {
    console.log("ERROR FETCHING BLOG", err);
    return res.status(501).json({ message: "internal server error" });
  }
};
