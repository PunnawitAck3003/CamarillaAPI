import mongoose from "mongoose";

const TfexHistoricalSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true },
    dateStr: { type: String, required: true }, // เก็บแบบ dd/MM/yyyy (UI ใช้โชว์)
    date: Date,  // เก็บเป็น Date จริง (ใช้ sort/filter)
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    settlement: Number,
    change: String,
    changePercent: String,
    volume: String,
    openInterest: String,
    range: Number,
  },
  { timestamps: true }
);

// ห้าม symbol + date ซ้ำ
TfexHistoricalSchema.index({ symbol: 1, dateStr: 1 }, { unique: true });

export default mongoose.models.TfexHistorical ||
  mongoose.model("TfexHistorical", TfexHistoricalSchema);
