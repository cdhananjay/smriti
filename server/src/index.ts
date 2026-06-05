import express from "express";
import type { Response, Request } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import morgan from "morgan";
import cors from "cors";
import { blogRouter } from "./routes/blog.route";
import { userRouter } from "./routes/user.route";
import winston from "winston";
import { rateLimit } from "express-rate-limit";
import { prisma } from "./lib/prisma";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
});

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
app.use(limiter);
app.use("/api/blog", blogRouter);
app.use("/api/user", userRouter);

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "hello world" });
});

const server = app.listen(port, () => {
    logger.info(
        `SERVER STARTED AT PORT ${port}, FRONTEND AT ${process.env.BETTER_AUTH_URL}`,
    );
});

async function gracefulShutdown(signal: string) {
    console.log(`Received ${signal}. Starting graceful shutdown...`);

    // Stop accepting new connections
    server.close(async (err) => {
        if (err) {
            logger.error("Error during server close:", err);
            process.exit(1);
        }

        try {
            await prisma.$disconnect();

            logger.info("Shutdown complete");
            process.exit(0);
        } catch (error) {
            logger.error("Shutdown error:", error);
            process.exit(1);
        }
    });

    // Force exit if shutdown takes too long
    setTimeout(() => {
        logger.error("Forced shutdown");
        process.exit(1);
    }, 10000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
