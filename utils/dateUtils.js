export function convertThaiDate(input) {
  const thaiMonths = {
    "ม.ค.": 0, "ก.พ.": 1, "มี.ค.": 2, "เม.ย.": 3,
    "พ.ค.": 4, "มิ.ย.": 5, "ก.ค.": 6, "ส.ค.": 7,
    "ก.ย.": 8, "ต.ค.": 9, "พ.ย.": 10, "ธ.ค.": 11,
  };

  // CASE 1 : 19/11/2025
  if (input.includes("/")) {
    const [d, m, y] = input.split("/").map(x => parseInt(x));
    return new Date(y, m - 1, d);
  }

  // CASE 2 : 19 พ.ย. 2568
  const parts = input.split(" ");
  const d = parseInt(parts[0]);
  const m = thaiMonths[parts[1]];
  const y = parseInt(parts[2]) - 543; // convert BE → CE

  return new Date(y, m, d);
}

export function getEngDayName(date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

export function getNextTradingDay(thaiDateStr) {
  let date = convertThaiDate(thaiDateStr);
  date.setDate(date.getDate() + 1);
  while ([0, 6].includes(date.getDay())) {
    date.setDate(date.getDate() + 1);
  }
  return date;
}

export function formatDate(date) {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}
