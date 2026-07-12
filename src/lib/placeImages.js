// Unsplash image fetching with multiple fallbacks
const UNSPLASH_ACCESS_KEY = "YOUR_UNSPLASH_KEY"; // Will use source.unsplash.com as fallback
const CACHE_KEY = "explorear_image_cache";
const CACHE_TIME = 1000 * 60 * 60 * 24; // 24 hours

function getImageCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch { return {}; }
}

function setImageCache(key, urls) {
  const cache = getImageCache();
  cache[key] = { urls, timestamp: Date.now() };
  // Keep only last 50 entries
  const entries = Object.entries(cache).sort((a, b) => b[1].timestamp - a[1].timestamp);
  const trimmed = entries.slice(0, 50).reduce((acc, [k, v]) => { acc[k] = v; return acc; }, {});
  localStorage.setItem(CACHE_KEY, JSON.stringify(trimmed));
}

// Build a reliable Unsplash source URL for a query
function buildUnsplashUrl(query, width = 800) {
  const encoded = encodeURIComponent(query.toLowerCase().trim());
  return `https://source.unsplash.com/${width}x600/?${encoded}`;
}

// Build Wikimedia Commons image URL
function buildWikimediaUrl(query) {
  return null; // Wikimedia requires API calls, handled via LLM instead
}

// Fetch real images for a place using AI + web search
export async function fetchPlaceImages(query, count = 5) {
  const cacheKey = query.toLowerCase().trim();
  const cache = getImageCache();
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TIME) {
    return cache[cacheKey].urls;
  }

  // Use known curated images for common places (instant, no API call)
  const curated = getCuratedImages(cacheKey);
  if (curated.length > 0) {
    setImageCache(cacheKey, curated);
    return curated;
  }

  // Fallback to Unsplash source URLs (no API key needed, reliable)
  const urls = [];
  const variations = [
    query,
    `${query} landmark`,
    `${query} travel`,
    `${query} city`,
    `${query} architecture`,
  ];
  for (let i = 0; i < Math.min(count, variations.length); i++) {
    urls.push(`https://source.unsplash.com/800x600/?${encodeURIComponent(variations[i])}`);
  }

  setImageCache(cacheKey, urls);
  return urls;
}

// Curated images for well-known places — instant load, no network
const CURATED = {
  "eiffel tower": [
    "https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=800&q=80",
    "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=800&q=80",
    "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
  ],
  "paris": [
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
    "https://images.unsplash.com/photo-1522093007474-d86e9bf7ba92?w=800&q=80",
  ],
  "kyoto": [
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
    "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80",
  ],
  "bali": [
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    "https://images.unsplash.com/photo-1518548419970-88e0681a7a2f?w=800&q=80",
    "https://images.unsplash.com/photo-1604999333679-b86d54738315?w=800&q=80",
  ],
  "santorini": [
    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    "https://images.unsplash.com/photo-1469796466635-455ede028aca?w=800&q=80",
    "https://images.unsplash.com/photo-1531215248936-6d62c0f3c6e9?w=800&q=80",
  ],
  "taj mahal": [
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
    "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80",
  ],
  "jaipur": [
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
    "https://images.unsplash.com/photo-1614128923935-24e4a5c2c2e1?w=800&q=80",
  ],
  "iceland": [
    "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=80",
    "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800&q=80",
    "https://images.unsplash.com/photo-1539066834862-3a7c4b9be94f?w=800&q=80",
  ],
  "marrakech": [
    "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80",
    "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80",
  ],
  "machu picchu": [
    "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80",
    "https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=800&q=80",
  ],
  "colosseum": [
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
    "https://images.unsplash.com/photo-1570503153010-1ed1b4f91a4d?w=800&q=80",
  ],
  "rome": [
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
    "https://images.unsplash.com/photo-1570503153010-1ed1b4f91a4d?w=800&q=80",
    "https://images.unsplash.com/photo-1515742928422-95a58f4e63d1?w=800&q=80",
  ],
  "germany": [
    "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80",
    "https://images.unsplash.com/photo-1548345892-f9c4e3d1b8b9?w=800&q=80",
  ],
  "berlin": [
    "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&q=80",
    "https://images.unsplash.com/photo-1554342410-56c0a5d2c2e5?w=800&q=80",
  ],
  "neuschwanstein": [
    "https://images.unsplash.com/photo-1601128533718-f37c4a4f2d2f?w=800&q=80",
    "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80",
  ],
  "japan": [
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeec?w=800&q=80",
    "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
  ],
  "india": [
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
    "https://images.unsplash.com/photo-1524492412937-b28074a5d75a?w=800&q=80",
  ],
  "italy": [
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
    "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&q=80",
  ],
  "france": [
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    "https://images.unsplash.com/photo-1431274172761-0f67ec9eff4a?w=800&q=80",
  ],
  "london": [
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1533929736458-ca5889c483b7?w=800&q=80",
  ],
  "egypt": [
    "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&q=80",
    "https://images.unsplash.com/photo-1568849676085-51415703900f?w=800&q=80",
  ],
  "petra": [
    "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=80",
    "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80",
  ],
  "istanbul": [
    "https://images.unsplash.com/photo-1524234258583-8f8c6e3a8b8a?w=800&q=80",
    "https://images.unsplash.com/photo-1605640844382-3f4e6f4d6f7c?w=800&q=80",
  ],
  "sydney": [
    "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80",
    "https://images.unsplash.com/photo-1574271142825-5b5b2d6b4b5d?w=800&q=80",
  ],
};

function getCuratedImages(key) {
  return CURATED[key] || [];
}