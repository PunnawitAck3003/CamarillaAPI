import express from "express";
import {
  fetchHistoricalData,
  summarizeTfexData,
} from "../services/tfexService.js";

const router = express.Router();

// intraday data
// router.get("/s50z25", async (req, res) => {
//   try {
//     const data = await scrapeTfexIntraday();
//     res.json(data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to scrape TFEX data" });
//   }
// });

// historical data
router.get("/:symbol/historical", async (req, res) => {
  try {
    const result = await fetchHistoricalData(req.params.symbol);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to scrape TFEX historical data" });
  }
});

// summary
router.get("/:symbol/summary", async (req, res) => {
  try {
    const summary = await summarizeTfexData(req.params.symbol);
    res.json(summary);
  } catch (err) {
    console.error("❌ Summary error:", err.message);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

export default router;
