
// Currency conversion with real-time exchange rates from exchangerate-api
const RATES_CACHE_KEY = "explorear_exchange_rates";
const RATES_CACHE_TIME = 1000 * 60 * 60; // 1 hour

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", flag: "🇦🇪" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc", flag: "🇨🇭" },
];

const fallbackRates = {
  USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.5, JPY: 149.5,
  AED: 3.67, CAD: 1.36, AUD: 1.52, SGD: 1.34, CHF: 0.88,
};

let cachedRates = null;

export function detectUserCurrency() {
  try {
    const locale = navigator.language || "en-US";
    if (locale.includes("en-US")) return "USD";
    const map = {
      "en-GB": "GBP", "en-AU": "AUD", "en-CA": "CAD", "en-SG": "SGD",
      "de": "EUR", "fr": "EUR", "es": "EUR", "it": "EUR", "nl": "EUR",
      "ja": "JPY", "en-IN": "INR", "hi": "INR",
      "ar-AE": "AED", "ar": "AED",
      "de-CH": "CHF", "fr-CH": "CHF", "it-CH": "CHF",
    };
    for (const [key, val] of Object.entries(map)) {
      if (locale.toLowerCase().includes(key.toLowerCase())) return val;
    }
  } catch {}
  return "USD";
}

export async function fetchExchangeRates() {
  if (cachedRates) return cachedRates;
  try {
    const cached = JSON.parse(localStorage.getItem(RATES_CACHE_KEY) || "null");
    if (cached && Date.now() - cached.timestamp < RATES_CACHE_TIME) {
      cachedRates = cached.rates;
      return cachedRates;
    }
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();
    if (data?.rates) {
      const rates = {};
      CURRENCIES.forEach(c => { rates[c.code] = data.rates[c.code] || fallbackRates[c.code]; });
      cachedRates = rates;
      localStorage.setItem(RATES_CACHE_KEY, JSON.stringify({ rates, timestamp: Date.now() }));
      return rates;
    }
  } catch {}
  cachedRates = fallbackRates;
  return fallbackRates;
}

export function convertAmount(amount, fromCurrency, toCurrency, rates) {
  if (!rates || !amount) return 0;
  const usdAmount = fromCurrency === "USD" ? amount : amount / rates[fromCurrency];
  return usdAmount * rates[toCurrency];
}

export function formatCurrency(amount, currencyCode, rates) {
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  const symbol = currency?.symbol || "$";
  const converted = convertAmount(amount, "USD", currencyCode, rates);
  const decimals = currencyCode === "JPY" ? 0 : 0;
  return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

// Parse a price string like "$1,200" or "€16" into a numeric USD value
export function parsePriceToUSD(priceStr) {
  if (!priceStr) return 0;
  const symbolMap = { "$": "USD", "€": "EUR", "£": "GBP", "₹": "INR", "¥": "JPY", "₩": "KRW" };
  const symbolMatch = priceStr.match(/[$€£₹¥₩]/);
  const fromCurrency = symbolMatch ? symbolMap[symbolMatch[0]] : "USD";
  const num = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
  if (!num) return 0;
  const usdAmount = fromCurrency === "USD" ? num : num / (fallbackRates[fromCurrency] || 1);
  return usdAmount;
}