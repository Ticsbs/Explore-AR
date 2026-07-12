import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Shield, Phone, Hospital, Building, Pill, MapPin, Share2,
  AlertTriangle, CloudRain, Siren, Heart, ChevronRight, Loader2,
  Navigation, AlertCircle, Sun, CloudSun, Cloud, CloudSnow, CloudLightning, CloudFog, CloudDrizzle,
} from "lucide-react";
import { useLocation } from "@/lib/LocationContext";
import { getWeatherInfo } from "@/lib/weatherCodes";
import { getEmergencyNumbers, calculateSafetyScore } from "@/lib/safetyData";
import ShareLocationCard from "@/components/safety/ShareLocationCard";

const iconMap = {
  Sun, CloudSun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, CloudDrizzle,
};

// Fetch real nearby emergency services using the Overpass API (OpenStreetMap)
async function fetchNearbyServices(lat, lon) {
  const radius = 5000; // 5km
  const query = `[out:json][timeout:25];(
    node["amenity"="hospital"](around:${radius},${lat},${lon});
    node["amenity"="police"](around:${radius},${lat},${lon});
    node["amenity"="pharmacy"](around:${radius},${lat},${lon});
  );out body 10;`;

  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
    });
    if (!res.ok) throw new Error("Failed to fetch services");
    const data = await res.json();

    const services = (data.elements || []).map((el) => {
      const tags = el.tags || {};
      const name = tags.name || tags["name:en"] || "";
      let type = "Service";
      let icon = Building;
      let color = "from-blue-500/20 to-blue-600/20";
      let iconColor = "text-blue-400";

      if (tags.amenity === "hospital") {
        type = "Hospital";
        icon = Hospital;
        color = "from-red-500/20 to-red-600/20";
        iconColor = "text-red-400";
      } else if (tags.amenity === "police") {
        type = "Police";
        icon = Shield;
        color = "from-indigo-500/20 to-indigo-600/20";
        iconColor = "text-indigo-400";
      } else if (tags.amenity === "pharmacy") {
        type = "Pharmacy";
        icon = Pill;
        color = "from-emerald-500/20 to-emerald-600/20";
        iconColor = "text-emerald-400";
      }

      // Calculate distance (approximate)
      const distance = getDistance(lat, lon, el.lat, el.lon);

      return {
        id: el.id,
        name,
        type,
        distance: distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`,
        icon,
        color,
        iconColor,
      };
    });

    // Sort by distance and limit to 5
    return services
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
      .slice(0, 5);
  } catch {
    return [];
  }
}

// Haversine distance in km
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const safetyTips = [
  "Keep digital copies of all travel documents",
  "Share your itinerary with a trusted contact",
  "Register with your country's embassy",
  "Avoid displaying expensive jewelry or electronics",
  "Use official transportation services only",
];

export default function Safety() {
  const [sosActive, setSosActive] = useState(false);
  const { location, loading, error, refresh } = useLocation();
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [nearbyServices, setNearbyServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);

  // Fetch live weather from Open-Meteo (same API as the weather widget)
  const fetchWeather = useCallback(async () => {
    if (!location) return;
    setWeatherLoading(true);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
      );
      if (!res.ok) throw new Error("Weather fetch failed");
      const data = await res.json();
      setWeather(data.current);
    } catch {
      setWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  }, [location]);

  // Fetch real nearby emergency services from Overpass API
  const fetchServices = useCallback(async () => {
    if (!location) return;
    setServicesLoading(true);
    const services = await fetchNearbyServices(location.lat, location.lng);
    setNearbyServices(services);
    setServicesLoading(false);
  }, [location]);

  useEffect(() => {
    fetchWeather();
    fetchServices();
  }, [fetchWeather, fetchServices]);

  // Calculate safety score based on real data:
  // - Country safety level (from real Global Peace Index / travel advisory data)
  // - Current weather conditions (from Open-Meteo)
  // - Time of day (night reduces score slightly)
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour > 20;
  const safetyScore = location
    ? calculateSafetyScore(location.countryCode, weather?.weather_code, isNight)
    : null;

  const emergencyContacts = location
    ? getEmergencyNumbers(location.countryCode)
    : null;

  const weatherInfo = weather ? getWeatherInfo(weather.weather_code) : null;
  const WeatherIcon = weatherInfo ? iconMap[weatherInfo.icon] || Cloud : null;

  // Determine weather advisory level
  const getWeatherAdvisory = () => {
    if (!weather) return null;
    const code = weather.weather_code;
    if (code >= 95) return { level: "Severe", color: "red", message: "Thunderstorms in your area. Seek shelter indoors." };
    if (code >= 81) return { level: "Heavy Rain", color: "blue", message: "Heavy rain expected. Avoid outdoor activities." };
    if (code >= 71) return { level: "Snow", color: "blue", message: "Snowfall expected. Drive carefully and dress warmly." };
    if (code >= 61) return { level: "Rain", color: "blue", message: "Rain expected. Carry an umbrella." };
    if (code >= 51) return { level: "Drizzle", color: "blue", message: "Light drizzle expected. An umbrella is advisable." };
    if (code === 45 || code === 48) return { level: "Fog", color: "yellow", message: "Reduced visibility due to fog. Drive carefully." };
    if (code <= 2) return { level: "Clear", color: "green", message: "Weather conditions are clear. No advisories." };
    return { level: "Normal", color: "green", message: "Weather conditions are normal." };
  };

  const advisory = getWeatherAdvisory();
  const advisoryColors = {
    red: "bg-red-500/10 border-red-500/20 text-red-400",
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    yellow: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    green: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  };

  const scoreColor = safetyScore === null ? "text-white/30" :
    safetyScore >= 8 ? "text-emerald-400" :
    safetyScore >= 6 ? "text-yellow-400" :
    safetyScore >= 4 ? "text-orange-400" : "text-red-400";

  const scoreLabel = safetyScore === null ? "Detecting..." :
    safetyScore >= 8 ? "Your area is generally safe" :
    safetyScore >= 6 ? "Exercise normal caution" :
    safetyScore >= 4 ? "Exercise increased caution" : "Avoid non-essential travel";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          <p className="text-white/40 text-sm">Getting your location...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B1220] pb-28">
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-400" />
            <h1 className="text-2xl font-bold text-white font-heading">Safety Center</h1>
          </div>
        </div>
        <div className="mx-4 mt-8 glass-card rounded-3xl p-6 flex flex-col items-center text-center gap-3">
          <AlertCircle className="w-10 h-10 text-orange-400" />
          <div>
            <p className="text-white font-semibold">
              {error.type === "denied" ? "Location Access Required" : "Location Error"}
            </p>
            <p className="text-white/40 text-xs mt-1 max-w-[260px]">
              {error.type === "denied"
                ? "Enable location permissions to see real-time safety information for your area"
                : "Couldn't determine your location. Please try again."}
            </p>
          </div>
          <button
            onClick={refresh}
            className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-medium flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" /> Enable Location
          </button>
        </div>
      </div>
    );
  }

  const contactEntries = emergencyContacts
    ? [
        { name: "Emergency", number: emergencyContacts.general, icon: Phone },
        { name: "Ambulance", number: emergencyContacts.ambulance, icon: Siren },
        { name: "Fire", number: emergencyContacts.fire, icon: AlertTriangle },
        { name: "Police", number: emergencyContacts.police, icon: Shield },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#0B1220] pb-28">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-400" />
          <h1 className="text-2xl font-bold text-white font-heading">Safety Center</h1>
        </div>
        {location && (
          <p className="text-white/40 text-sm mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {location.city}{location.country ? `, ${location.country}` : ""}
          </p>
        )}
      </div>

      {/* SOS Button */}
      <div className="flex justify-center mt-4 mb-8">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setSosActive(!sosActive)}
          className="relative"
        >
          {sosActive && (
            <>
              <div className="absolute inset-0 w-32 h-32 rounded-full bg-red-500/20 animate-pulse-ring" />
              <div className="absolute inset-0 w-32 h-32 rounded-full bg-red-500/10 animate-pulse-ring" style={{ animationDelay: "0.5s" }} />
            </>
          )}
          <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all ${sosActive ? "bg-red-500 glow-orange shadow-red-500/50" : "bg-gradient-to-br from-red-500/30 to-red-600/30 border border-red-500/20"}`}>
            <Siren className={`w-8 h-8 ${sosActive ? "text-white" : "text-red-400"}`} />
            <span className={`text-sm font-bold mt-1 ${sosActive ? "text-white" : "text-red-400"}`}>
              {sosActive ? "ACTIVE" : "SOS"}
            </span>
          </div>
        </motion.button>
      </div>

      {/* Safety Score — based on country, weather, and time of day */}
      <div className="mx-4 glass-card rounded-3xl p-5 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Safety Score</p>
            {safetyScore !== null ? (
              <>
                <p className={`text-3xl font-bold font-heading mt-1 ${scoreColor}`}>{safetyScore}/10</p>
                <p className="text-white/40 text-xs mt-1">{scoreLabel}</p>
              </>
            ) : (
              <div className="flex items-center gap-2 mt-2">
                <Loader2 className="w-4 h-4 text-white/30 animate-spin" />
                <p className="text-white/30 text-sm">Calculating...</p>
              </div>
            )}
          </div>
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
            <Shield className={`w-8 h-8 ${scoreColor}`} />
          </div>
        </div>
        {location?.countryCode && (
          <p className="text-white/30 text-xs mt-3">
            Based on safety data for {location.country} · {isNight ? "Nighttime" : "Daytime"} · {weatherInfo?.text || "Weather loading..."}
          </p>
        )}
      </div>

      {/* Weather Advisory — real weather from Open-Meteo */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mx-4 border rounded-2xl p-4 flex items-start gap-3 mb-6 ${advisory ? advisoryColors[advisory.color] : "bg-white/5 border-white/10"}`}
      >
        {weatherLoading ? (
          <Loader2 className="w-5 h-5 text-white/40 animate-spin mt-0.5" />
        ) : WeatherIcon ? (
          <WeatherIcon className={`w-5 h-5 mt-0.5 ${advisory ? advisoryColors[advisory.color].split(" ").find(c => c.startsWith("text-")) : "text-white/40"}`} />
        ) : (
          <CloudRain className="w-5 h-5 text-white/40 mt-0.5" />
        )}
        <div className="flex-1">
          <p className={`text-sm font-semibold ${advisory ? advisoryColors[advisory.color].split(" ").find(c => c.startsWith("text-")) : "text-white/60"}`}>
            Weather Advisory
          </p>
          {advisory ? (
            <p className="text-white/50 text-xs mt-0.5">{advisory.message}</p>
          ) : (
            <p className="text-white/30 text-xs mt-0.5">Loading weather data...</p>
          )}
          {weather && (
            <p className="text-white/40 text-xs mt-1">
              {Math.round(weather.temperature_2m)}°C · {weatherInfo?.text} · {weather.relative_humidity_2m}% humidity
            </p>
          )}
        </div>
      </motion.div>

      {/* Emergency Contacts — real numbers for the detected country */}
      {contactEntries.length > 0 && (
        <div className="px-4 mb-6">
          <h3 className="text-white font-semibold text-sm mb-3">Emergency Contacts</h3>
          <div className="grid grid-cols-4 gap-2">
            {contactEntries.map((c) => (
              <motion.a
                key={c.name}
                href={`tel:${c.number}`}
                whileTap={{ scale: 0.95 }}
                className="glass-card rounded-2xl p-3 flex flex-col items-center gap-1.5"
              >
                <c.icon className="w-5 h-5 text-red-400" />
                <span className="text-white/60 text-[10px]">{c.name}</span>
                <span className="text-white text-xs font-bold">{c.number}</span>
              </motion.a>
            ))}
          </div>
        </div>
      )}

      {/* Nearby Services — real data from Overpass API (OpenStreetMap) */}
      <div className="px-4 mb-6">
        <h3 className="text-white font-semibold text-sm mb-3">Nearby Services</h3>
        {servicesLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-4 flex items-center gap-3 animate-pulse">
                <div className="w-11 h-11 rounded-xl bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/3 bg-white/5 rounded" />
                  <div className="h-2 w-1/3 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : nearbyServices.length > 0 ? (
          <div className="space-y-3">
            {nearbyServices.map((s, i) => (
              <motion.div
                key={s.id || i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-4 flex items-center gap-3"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}>
                  <s.icon className={`w-5 h-5 ${s.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{s.name || s.type}</p>
                  <p className="text-white/40 text-xs">{s.type} · {s.distance}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-white/30 text-sm">No nearby services found within 5km</p>
          </div>
        )}
      </div>

      {/* Share Location */}
      <div className="mb-6">
        <ShareLocationCard location={location} error={error} onRefreshLocation={refresh} />
      </div>

      {/* Safety Tips */}
      <div className="px-4">
        <h3 className="text-white font-semibold text-sm mb-3">Safety Tips</h3>
        <div className="glass-card rounded-2xl p-4 space-y-3">
          {safetyTips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-teal-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Heart className="w-3 h-3 text-teal-400" />
              </div>
              <p className="text-white/60 text-xs leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}