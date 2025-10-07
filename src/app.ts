import compression from "compression";
import cors from "cors";
import express from "express";
import { userRouter } from "./modules/user/user.routes";
import { postRouter } from "./modules/post/post.routes";

const app = express();

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(compression()); // Compresses response bodies for faster delivery
app.use(express.json()); // Parse incoming JSON requests

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Default route for testing
app.get("/", (_req, res) => {
  res.send("API is running");
});


// users
app.use("/api/v1/users", userRouter);
// post
app.use("/api/v1/posts", postRouter)



// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;
