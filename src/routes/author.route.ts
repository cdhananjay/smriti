import express from "express";
import { getInfo } from "../controllers/user.controller";
const authorRouter = express.Router();

authorRouter.get("/info/:username", getInfo);

export {authorRouter};