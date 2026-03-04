import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index.js";
import errorHandler from "./middleware/error.middleware.js";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use(
  helmet({
    // Allow images/files under /uploads to be loaded cross-origin by the frontend
    crossOriginResourcePolicy: { policy: "cross-origin" },
    // Disable COEP so the browser doesn't block embedded cross-origin resources
    crossOriginEmbedderPolicy: false,
  }),
);

// CORS — restrict to configured frontend origin
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

// Body size limits (prevent payload bombs)
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

// Serve static files from uploads directory
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/v1", routes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
