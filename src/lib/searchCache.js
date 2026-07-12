// Search result caching and history
const CACHE_KEY = "explorear_search_cache";
const HISTORY_KEY = "explorear_search_history";
const TRENDING_KEY = "explorear_trending";
const CACHE_TIME = 1000 * 60 * 30; // 30 minutes

export function getSearchCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch { return {}; }
}

export function getCachedResult(query, category = "All") {
  const cache = getSearchCache();
  const key = `${query.toLowerCase()}::${category}`;
  const entry = cache[key];
  if (entry && Date.now() - entry.timestamp < CACHE_TIME) {
    return entry.data;
  }
  return null;
}

export function setCachedResult(query, category, data) {
  const cache = getSearchCache();
  const key = `${query.toLowerCase()}::${category}`;
  cache[key] = { data, timestamp: Date.now() };
  // Keep only last 30 entries
  const entries = Object.entries(cache).sort((a, b) => b[1].timestamp - a[1].timestamp);
  const trimmed = entries.slice(0, 30).reduce((acc, [k, v]) => { acc[k] = v; return acc; }, {});
  localStorage.setItem(CACHE_KEY, JSON.stringify(trimmed));
}

export function getSearchHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch { return []; }
}

export function addToSearchHistory(query) {
  if (!query?.trim()) return;
  let history = getSearchHistory();
  history = history.filter(h => h.toLowerCase() !== query.toLowerCase());
  history.unshift({ query, timestamp: Date.now() });
  history = history.slice(0, 8);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearSearchHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

export function getTrendingSearches() {
  try {
    const stored = JSON.parse(localStorage.getItem(TRENDING_KEY) || "[]");
    if (stored.length > 0) return stored;
  } catch {}
  return ["Eiffel Tower", "Kyoto", "Machu Picchu", "Santorini", "Taj Mahal", "Iceland"];
}

export function recordTrendingSearch(query) {
  const trending = getTrendingSearches();
  // Don't modify the trending list from user searches
  return trending;
}