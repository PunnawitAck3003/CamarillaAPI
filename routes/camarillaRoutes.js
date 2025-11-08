import express from "express";
import { generateCamarillaLevels } from "../services/camarillaService.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { high, low, close } = req.body;

  if (
    typeof high !== "number" ||
    typeof low !== "number" ||
    typeof close !== "number"
  ) {
    return res.status(400).json({ error: "Invalid input. Expected numbers." });
  }

  const result = generateCamarillaLevels(high, low, close);
  res.json(result);
});

export default router;
