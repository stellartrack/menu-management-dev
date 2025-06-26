import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import allRoutes from "./routes/index.js";
import errorHandler from "./middleware/error/errorHandler.middleware.js";
import { PORT } from "./config/env.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Dynamically loaded routes under this base
app.use("/api/proxy", allRoutes);

// Global error handler
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
