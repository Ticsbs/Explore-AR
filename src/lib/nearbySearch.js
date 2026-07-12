// Nearby Places search using Overpass API (OpenStreetMap)
// Route calculation using OSRM (free, keyless routing API)

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

const OSRM_URL = "https://router.project-osrm.org/route/v1/foot";

const categoryQueries = {
  food: `node["amenity"~"restaurant|cafe|fast_food|bar|pub"](around:3000,{lat},{lon});`,
  medical: `node["amenity"~"hospital|clinic|pharmacy|doctors|dentist"](around:3000,{lat},{lon});`,
  hotels: `node["tourism"~"hotel|motel|guest_house|hostel|apartment"](around:3000,{lat},{lon});`,
};

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function categorizePlace(category, tags) {
  if (category === "food") {
    if (tags.amenity === "restaurant") return "Restaurant";
    if (tags.amenity === "cafe") return "Café";
    if (tags.amenity === "fast_food") return "Fast Food";
    if (tags.amenity === "bar") return "Bar";
    if (tags.amenity === "pub") return "Pub";
    return "Food";
  }
  if (category === "medical") {
    if (tags.amenity === "hospital") return "Hospital";
    if (tags.amenity === "clinic") return "Clinic";
    if (tags.amenity === "pharmacy") return "Pharmacy";
    if (tags.amenity === "doctors") return "Doctor";
    if (tags.amenity === "dentist") return "Dentist";
    return "Medical";
  }
  if (category === "hotels") {
    if (tags.tourism === "hotel") return "Hotel";
    if (tags.tourism === "motel") return "Motel";
    if (tags.tourism === "guest_house") return "Guest House";
    if (tags.tourism === "hostel") return "Hostel";
    return "Accommodation";
  }
  return "Place";
}

export async function fetchNearbyPlaces(lat, lon, category) {
  const queryTemplate = categoryQueries[category];
  if (!queryTemplate) return [];

  const query = queryTemplate.replace(/{lat}/g, lat).replace(/{lon}/g, lon);
  const fullQuery = `[out:json][timeout:25];(${query});out body 20;`;

  let lastError;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(fullQuery)}`,
      });
      if (!res.ok) throw new Error(`Overpass API returned ${res.status}`);
      const data = await res.json();

      return (data.elements || [])
        .map((el) => {
          const tags = el.tags || {};
          const name = tags.name || tags["name:en"] || "Unknown Place";
          const type = categorizePlace(category, tags);
          const distance = getDistance(lat, lon, el.lat, el.lon);
          return {
            id: el.id,
            name,
            type,
            lat: el.lat,
            lon: el.lon,
            distance: distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`,
            distanceKm: distance,
          };
        })
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 15);
    } catch (err) {
      lastError = err;
      // Try next endpoint
    }
  }
  throw lastError || new Error("All Overpass endpoints failed");
}

export async function fetchRoute(fromLat, fromLon, toLat, toLon) {
  const res = await fetch(
    `${OSRM_URL}/${fromLon},${fromLat};${toLon},${toLat}?overview=full&geometries=geojson`
  );
  if (!res.ok) throw new Error("Routing service unavailable");
  const data = await res.json();
  if (!data.routes || data.routes.length === 0) throw new Error("No route found");

  const route = data.routes[0];
  return {
    geometry: route.geometry,
    distance: route.distance < 1000 ? `${Math.round(route.distance)} m` : `${(route.distance / 1000).toFixed(1)} km`,
    duration: route.duration < 60 ? `${Math.round(route.duration)} sec` : `${Math.round(route.duration / 60)} min`,
    distanceMeters: route.distance,
    durationSeconds: route.duration,
  };
}