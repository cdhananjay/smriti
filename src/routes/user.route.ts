import express from "express";
import { getInfo, getUserBlogs } from "../controllers/user.controller";
const userRouter = express.Router();

userRouter.get("/info/:username", getInfo);
userRouter.get("/blogs/:username", getUserBlogs);

export { userRouter };
