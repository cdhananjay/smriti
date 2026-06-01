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
    
  if (!session || !session.user) { 
    console.error("USER SESSION NOT FOUND EVEN AFTER PASSSING REQUIRE AUTH MIDDLE WARE")
    return res.status(401).json({message: "user session not found. this should have never happened."})
  }
  
  try {
    const blog = await prisma.blog.create({
      data: {
        content,
        slug,
        title,
        authorId: session.user.id,
        }
    })
    
    return res.status(201).json({ blog, message: "blog created succesfully" });
  } catch (err) {
    console.error("FAILED TO CREATE BLOG", err);
    return res.status(500).json({ message: "failed to create blog" });
  }
};
