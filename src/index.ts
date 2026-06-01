import express from "express";
import type { Response, Request } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import morgan from "morgan";
import cors from "cors";
import { blogRouter } from "./routes/blog.route";
import { userRouter } from "./routes/user.route";
import winston from "winston";

const logFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
        return `${timestamp} [${level}]: ${message}`;
    }),
);
const logger = winston.createLogger({
    level: "info",
    format: logFormat,
    defaultMeta: { service: "user-service" },
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }),
    ],
});

if (process.env.ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: logFormat,
        }),
    );
}

const app = express();
const port = process.env.PORT || 3000;

app.use(
    cors({
        origin: process.env.BETTER_AUTH_URL,
        credentials: true,
    }),
);
app.use(morgan("dev"));
app.all("/api/auth/{*any}", toNodeHandler(auth));
// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth
app.use(express.json());

app.use("/api/blog", blogRouter);
app.use("/api/user", userRouter);

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "hello world" });
});

app.listen(port, () => {
    logger.info(
        `SERVER STARTED AT PORT ${port}, FRONTEND AT ${process.env.BETTER_AUTH_URL}`,
    );
});
