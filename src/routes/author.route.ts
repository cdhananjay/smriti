import express from "express";
import { getInfo } from "../controllers/user.controller";
const authorRouter = express.Router();

authorRouter.get("/info/:id", getInfo);

export {authorRouter};