import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Sun, CloudSun, Cloud, CloudRain, CloudSnow, CloudLightning,
  CloudFog, CloudDrizzle, MapPin, Wind, Droplets, RefreshCw,
  Navigation, AlertCircle
} from "lucide-react";
import { getWeatherInfo } from "@/lib/weatherCodes";

const iconMap = {
  Sun, CloudSun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, CloudDrizzle,
};

export default function LiveWeatherWidget({ location, loading, error, refreshTrigger, onRefreshLocation }) {
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  const fetchWeather = useCallback(async () => {
    if (!location) return;
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
      );
      if (!res.ok) throw new Error("Weather fetch failed");
      const data = await res.json();
      setWeather(data.current);
    } catch {
      setWeatherError("Failed to fetch weather data");
    } finally {
      setWeatherLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather, refreshTrigger]);

  if (loading) {
    return (
      <div className="glass-card rounded-3xl p-5 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 w-24 bg-white/10 rounded" />
            <div className="h-8 w-16 bg-white/10 rounded" />
          </div>
          <div className="w-16 h-16 bg-white/10 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="h-12 bg-white/[0.03] rounded-xl" />
          <div className="h-12 bg-white/[0.03] rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6 flex flex-col items-center text-center gap-3"
      >
        <div className="w-14 h-14 rounded-full bg-orange-500/15 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-orange-400" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm">
            {error.type === "denied" ? "Location Access Required" : "Location Error"}
          </p>
          <p className="text-white/40 text-xs mt-1 max-w-[220px]">
            {error.type === "denied"
              ? "Enable location permissions in your browser to see live weather for your area"
              : "Couldn't determine your location. Please try again."}
          </p>
        </div>
        <button
          onClick={onRefreshLocation}
          className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-medium flex items-center gap-2 hover:bg-blue-500/30 transition-colors"
        >
          <Navigation className="w-4 h-4" /> Enable Location
        </button>
      </motion.div>
    );
  }

  if (weatherLoading || !weather) {
    return (
      <div className="glass-card rounded-3xl p-5 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 w-28 bg-white/10 rounded" />
            <div className="h-8 w-20 bg-white/10 rounded" />
          </div>
          <div className="w-16 h-16 bg-white/10 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="h-12 bg-white/[0.03] rounded-xl" />
          <div className="h-12 bg-white/[0.03] rounded-xl" />
        </div>
      </div>
    );
  }

  if (weatherError) {
    return (
      <div className="glass-card rounded-3xl p-6 flex flex-col items-center text-center gap-3">
        <AlertCircle className="w-8 h-8 text-orange-400" />
        <p className="text-white/50 text-sm">{weatherError}</p>
        <button
          onClick={fetchWeather}
          className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-medium flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  const weatherInfo = getWeatherInfo(weather.weather_code);
  const WeatherIcon = iconMap[weatherInfo.icon] || Cloud;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl p-5 relative overflow-hidden shadow-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-teal-500/5 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm">{location.city}</p>
              {location.country && <p className="text-white/40 text-xs">{location.country}</p>}
            </div>
          </div>
          <button
            onClick={() => { onRefreshLocation?.(); fetchWeather(); }}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-white/50 ${weatherLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold text-white font-heading">
                {Math.round(weather.temperature_2m)}
              </span>
              <span className="text-2xl text-white/40">°C</span>
            </div>
            <p className="text-white/60 text-sm mt-1">{weatherInfo.text}</p>
          </div>
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
            <WeatherIcon className={`w-10 h-10 ${weatherInfo.color}`} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="flex items-center gap-2 bg-white/[0.03] rounded-xl p-2.5">
            <Droplets className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <div>
              <p className="text-white/40 text-xs">Humidity</p>
              <p className="text-white text-sm font-medium">{weather.relative_humidity_2m}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/[0.03] rounded-xl p-2.5">
            <Wind className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-white/40 text-xs">Wind</p>
              <p className="text-white text-sm font-medium">{Math.round(weather.wind_speed_10m)} km/h</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}