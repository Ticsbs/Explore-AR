// Place search using OpenStreetMap Nominatim (free, no API key required)
// Place images & descriptions using Wikipedia REST API (free, no API key required)

export async function searchPlaces(query) {
  if (!query?.trim()) return [];
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&addressdetails=1&extratags=1&limit=10&accept-language=en`
  );
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

// Fetch Wikipedia summary for a place — returns description + thumbnail image
export async function fetchPlaceMedia(place) {
  // Try to get the Wikipedia title from OSM extratags (format: "en:Paris")
  const wikiTag = place?.extratags?.wikipedia || place?.extratags?.wikidata;
  let title = place?.name;

  if (wikiTag && wikiTag.includes(":")) {
    title = wikiTag.split(":")[1];
  }

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
    );
    if (res.ok) {
      const data = await res.json();
      return {
        image: data.thumbnail?.source || data.originalimage?.source || null,
        description: data.extract || null,
      };
    }
  } catch {}
  return { image: null, description: null };
}

// Batch fetch media for multiple places (limited to avoid rate limiting)
export async function fetchPlacesMedia(places) {
  const limited = places.slice(0, 8);
  const results = await Promise.all(
    limited.map(async (p) => {
      const media = await fetchPlaceMedia(p);
      return { place: p, ...media };
    })
  );
  return results;
}

// Map Nominatim class/type to a human-readable category
export function getPlaceCategory(item) {
  const cls = item.class;
  const type = item.type;

  if (cls === "place" && type === "city") return { label: "City", icon: "🏙️" };
  if (cls === "place" && type === "country") return { label: "Country", icon: "🌍" };
  if (cls === "place" && type === "state") return { label: "Region", icon: "🗺️" };
  if (cls === "place" && (type === "town" || type === "village")) return { label: "Town", icon: "🏘️" };
  if (cls === "place" && type === "island") return { label: "Island", icon: "🏝️" };
  if (cls === "historic") return { label: "Historic Landmark", icon: "🏛️" };
  if (cls === "tourism" && type === "attraction") return { label: "Attraction", icon: "🎡" };
  if (cls === "tourism" && type === "hotel") return { label: "Hotel", icon: "🏨" };
  if (cls === "tourism" && type === "museum") return { label: "Museum", icon: "🖼️" };
  if (cls === "tourism" && type === "viewpoint") return { label: "Viewpoint", icon: "🏔️" };
  if (cls === "tourism" && type === "beach") return { label: "Beach", icon: "🏖️" };
  if (cls === "amenity" && type === "restaurant") return { label: "Restaurant", icon: "🍽️" };
  if (cls === "amenity" && type === "cafe") return { label: "Cafe", icon: "☕" };
  if (cls === "amenity" && type === "bar") return { label: "Bar", icon: "🍹" };
  if (cls === "amenity" && type === "hospital") return { label: "Hospital", icon: "🏥" };
  if (cls === "amenity" && type === "pharmacy") return { label: "Pharmacy", icon: "💊" };
  if (cls === "amenity" && type === "place_of_worship") return { label: "Place of Worship", icon: "⛪" };
  if (cls === "leisure" && type === "park") return { label: "Park", icon: "🌳" };
  if (cls === "leisure" && type === "stadium") return { label: "Stadium", icon: "🏟️" };
  if (cls === "aeroway" && type === "aerodrome") return { label: "Airport", icon: "✈️" };
  if (cls === "railway") return { label: "Railway Station", icon: "🚉" };
  if (cls === "natural" && type === "peak") return { label: "Mountain", icon: "⛰️" };
  if (cls === "natural" && type === "waterfall") return { label: "Waterfall", icon: "💦" };
  if (cls === "natural" && type === "beach") return { label: "Beach", icon: "🏖️" };
  if (cls === "natural" && type === "volcano") return { label: "Volcano", icon: "🌋" };
  if (cls === "natural") return { label: "Natural Feature", icon: "🌿" };
  if (cls === "water") return { label: "Body of Water", icon: "🌊" };
  if (cls === "tourism") return { label: "Tourism", icon: "📍" };
  if (cls === "amenity") return { label: "Amenity", icon: "📍" };
  if (cls === "boundary") return { label: "Region", icon: "🗺️" };
  return { label: "Place", icon: "📍" };
}

// Parse a Nominatim result into a clean display object
export function parsePlace(item) {
  const addr = item.address || {};
  const category = getPlaceCategory(item);
  const name =
    item.name ||
    addr.city ||
    addr.town ||
    addr.village ||
    addr.country ||
    addr.state ||
    item.display_name?.split(",")[0] ||
    "Unknown";

  const locationParts = [
    addr.suburb,
    addr.city || addr.town || addr.village || addr.municipality,
    addr.state || addr.county,
    addr.country,
  ].filter(Boolean);
  const location = locationParts.join(", ") || item.display_name || "";

  return {
    id: item.place_id,
    name,
    displayName: item.display_name,
    location,
    country: addr.country || "",
    countryCode: (addr.country_code || "").toUpperCase(),
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    category: category.label,
    categoryIcon: category.icon,
    raw: item,
  };
}