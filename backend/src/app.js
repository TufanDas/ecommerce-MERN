import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import env from "./config/env.js";


import authRoutes from "./routes/auth.routes.js";

import errorMiddleware from "./middleware/error.middleware.js";

const app = express();


// Middlewares
app.use(
    cors({
        origin: env.clientUrl,
        credentials: true,
    })
);



app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// AUTHENTICAATION ROUTES
app.use("/api/v1/auth", authRoutes);


// Health check
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "E-commerce API is running",
        note:"Full-Stack Application using MERN Stack"
    });
});


app.use(errorMiddleware);

export default app;