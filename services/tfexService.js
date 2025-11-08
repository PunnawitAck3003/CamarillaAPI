// import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import { autoScroll } from "../utils/puppeteerUtils.js";
import {
  convertThaiDate,
  getEngDayName,
  getNextTradingDay,
  formatDate,
} from "../utils/dateUtils.js";
import { generateCamarillaLevels } from "./camarillaService.js";

// export async function scrapeTfexIntraday() {
//   const url = "https://www.tfex.co.th/th/products/equity/set50-index-futures/S50Z25/intraday";
//   const { data } = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
//   const $ = cheerio.load(data);

//   const high = $("label:contains('ราคาสูงสุด')").parent().find(".price").text().trim();
//   const low = $("label:contains('ราคาต่ำสุด')").parent().find(".price").text().trim();
//   const open = $("label:contains('ราคาเปิด')").parent().find(".price").text().trim();
//   const close = $(".lastest").first().text().trim();
//   const settlement = $("label:contains('ราคาที่ใช้ชำระราคา')").last().parent().find(".price").text().trim();

//   return {
//     high,
//     low,
//     open,
//     close,
//     settlement: parseFloat(settlement).toFixed(1),
//     range: (parseFloat(high) - parseFloat(low)).toFixed(1),
//     scrapedAt: new Date().toISOString(),
//   };
// }

export async function fetchHistoricalData(symbol) {
  const upperSymbol = symbol.toUpperCase();
  const urlMap = {
    S5: `https://www.tfex.co.th/th/products/equity/set50-index-futures/${upperSymbol}/historical-trading`,
    GO: `https://www.tfex.co.th/th/products/precious-metal/gold-online-futures/${upperSymbol}/historical-trading`,
  };

  const prefix = upperSymbol.slice(0, 2);
  const url = urlMap[prefix];
  if (!url) throw new Error(`Unsupported symbol prefix: ${prefix}`);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.waitForSelector("table.b-table");
  await autoScroll(page);

  const data = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll("table.b-table tbody tr"));
    return rows.map((row) => {
      const cols = Array.from(row.querySelectorAll("td span")).map((c) =>
        c.innerText.trim()
      );
      const toNumber = (str) => {
        const cleaned = str.replace(/,/g, "").replace(/[^\d.-]/g, "");
        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
      };
      const high = toNumber(cols[2]);
      const low = toNumber(cols[3]);
      return {
        date: cols[0],
        open: toNumber(cols[1]),
        high,
        low,
        close: toNumber(cols[4]),
        settlement: toNumber(cols[5]),
        change: cols[6],
        changePercent: cols[7],
        volume: cols[8],
        openInterest: cols[9],
        range: isNaN(high) || isNaN(low) ? null : +(high - low).toFixed(2),
      };
    });
  });

  await browser.close();

  return {
    scrapedAt: new Date().toISOString(),
    symbol: upperSymbol,
    count: data.length,
    data,
  };
}

export async function summarizeTfexData(symbol) {
  const hist = await fetchHistoricalData(symbol);
  const records = hist.data;

  if (!records || records.length < 2) throw new Error("Not enough data");

  const latest = records[0];
  const prev = records[1];
  const trend = latest.range >= prev.range ? "In" : "Out";
  const nextDate = getNextTradingDay(latest.date);
  const latestDate = convertThaiDate(latest.date);
  const latestDay = getEngDayName(latestDate);
  const { high, low, close, settlement } = latest;
  const levels = generateCamarillaLevels(high, low, settlement);

  return {
    scrapedAt: hist.scrapedAt,
    symbol: symbol.toUpperCase(),
    trend,
    latest: {
      date: formatDate(latestDate),
      day: latestDay,
      high,
      low,
      close,
      settlement,
    },
    nextTradingDay: {
      date: formatDate(nextDate),
      day: getEngDayName(nextDate),
    },
    camarillaLevels: levels,
  };
}
