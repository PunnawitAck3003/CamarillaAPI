import express from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// ✅ ตั้งค่า Rate Limit
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 นาที
  max: 30, // จำกัด 30 requests / นาที / IP
  message: {
    error: "Too many requests, please try again later.",
  },
});
app.use(limiter);

// ✅ ฟังก์ชันคำนวณ Camarilla Levels
function generateCamarillaLevels(high, low, close) {
  const range = high - low;
  const levels = {
    H10: close + 1.7798 * range,
    H09: close + 1.65 * range,
    H08: close + 1.5202 * range,
    H07: close + 1.3596 * range,
    H06: (high / low) * close,
    H05: ((high / low) * close + close + 0.55 * range) / 2,
    H04: close + 0.55 * range,
    H03: close + 0.275 * range,
    H02: close + 0.18333333 * range,
    H01: close + 0.09166666 * range,
    L01: close - 0.09166666 * range,
    L02: close - 0.18333333 * range,
    L03: close - 0.275 * range,
    L04: close - 0.55 * range,
    L05: 2 * close - ((high / low) * close + close + 0.55 * range) / 2,
    L06: close - ((high / low) * close - close),
    L07: close - 1.3596 * range,
    L08: close - 1.5202 * range,
    L09: close - 1.65 * range,
    L10: close - 1.7798 * range,
  };
  
  // ✅ ปัดทุกค่าทศนิยมให้เหลือ 2 ตำแหน่ง
  const rounded = {};
  for (const [key, value] of Object.entries(levels)) {
    rounded[key] = parseFloat(value.toFixed(2));
  }

  return rounded;
}

// ✅ Route หลัก
app.post("/api/v1/camarilla", (req, res) => {
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

// ✅ Health check
app.get("/", (req, res) => {
  res.json({ message: "Camarilla API is running 🚀" });
});

// ✅ สำหรับ local
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

export default app; // 👈 สำคัญสำหรับ Vercel
