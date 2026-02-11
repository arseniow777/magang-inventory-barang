import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});