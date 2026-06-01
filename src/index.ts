import express from "express";
import type {Response, Request} from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import morgan from "morgan";
import cors from "cors";
import { blogRouter } from "./routes/blog.route";
import { requireAuth } from "./middlewares/requireAuth.middleware";
// Create a new express application instance
const app = express();

// Set the network port
const port = process.env.PORT || 3000;


app.use(cors({
    origin: process.env.BETTER_AUTH_URL,
    credentials: true
}))
app.use(morgan("dev"));

app.all("/api/auth/{*any}", toNodeHandler(auth));

// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth
app.use(express.json());

app.use("/blog", requireAuth ,blogRouter);

// Define the root path with a greeting message
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

// Start the Express server
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port} \n
        frontend running at ${process.env.BETTER_AUTH_URL}`);
});