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
app.set("trust proxy", 1);
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
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
