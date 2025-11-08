export function generateCamarillaLevels(high, low, close) {
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

  const rounded = {};
  for (const [key, value] of Object.entries(levels)) {
    rounded[key] = parseFloat(value.toFixed(2));
  }
  return rounded;
}
