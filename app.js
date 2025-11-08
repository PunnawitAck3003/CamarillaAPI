import express from "express";
import cors from "cors";
import { limiter } from "./utils/rateLimiter.js";
import camarillaRoutes from "./routes/camarillaRoutes.js";
import tfexRoutes from "./routes/tfexRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(limiter);

// routes
app.use("/api/v1/camarilla", camarillaRoutes);
app.use("/api/v1/tfex", tfexRoutes);

// health check
app.get("/", (req, res) => {
  res.json({ message: "Camarilla API is running 🚀" });
});

export default app;
