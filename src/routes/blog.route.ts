import express from "express";
const blogRouter = express.Router();
import { createBlog } from "../controllers/blog.controller";

blogRouter.post("/new",createBlog)

export {blogRouter};