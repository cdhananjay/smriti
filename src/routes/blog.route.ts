import express from "express";
const blogRouter = express.Router();
import { createBlog, deleteBlog } from "../controllers/blog.controller";

blogRouter.post("/new",createBlog)
blogRouter.delete("/delete", deleteBlog)
export {blogRouter};