import { connectDB } from "../utils/db.js";
import TfexHistorical from "../models/TfexHistorical.js";
import { fetchHistoricalData } from "./tfexService.js";
import { convertThaiDate, formatDate } from "../utils/dateUtils.js";

export async function scrapeAndSaveHistorical(symbol) {
    await connectDB();

    const scraped = await fetchHistoricalData(symbol);
    const rows = scraped.data;

    const saved = [];

    for (const item of rows) {
        // convert Thai date → normal date
        const d = convertThaiDate(item.date); // returns JS Date()
        const formatted = formatDate(d); // YYYY-MM-DD

        function parseThaiDate(dateStr) {
            const [d, m, y] = dateStr.split("/").map(Number);
            return new Date(y, m - 1, d);
        }

        const doc = {
            symbol: scraped.symbol,
            dateStr: formatted,
            date: parseThaiDate(formatted),
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
            settlement: item.settlement,
            change: item.change,
            changePercent: item.changePercent,
            volume: item.volume,
            openInterest: item.openInterest,
            range: item.range,
        };

        // upsert (insert or replace same date)
        await TfexHistorical.updateOne(
            { symbol: scraped.symbol, dateStr: formatted },
            { $set: doc },
            { upsert: true }
        );

        saved.push(doc);
    }

    return saved;
}

export async function getHistoricalFromDB(symbol) {
    await connectDB();

    return await TfexHistorical.find({ symbol: symbol.toUpperCase() })
        .sort({ date: -1 }) // latest first
        .lean();
}
