import express from "express";
const blogRouter = express.Router();
import {
    createBlog,
    deleteBlog,
    searchBlogs,
    viewBlog,
} from "../controllers/blog.controller";
import { requireAuth } from "../middlewares/requireAuth.middleware";

blogRouter.post("/new", requireAuth, createBlog);
blogRouter.delete("/delete/:slug", requireAuth, deleteBlog);
blogRouter.get("/view/:slug", viewBlog);
blogRouter.get("/search", searchBlogs);

export { blogRouter };
