import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, RefreshCw } from "lucide-react";
import HeroSection from "@/components/explore/HeroSection";
import LiveWeatherWidget from "@/components/explore/LiveWeatherWidget";
import SectionHeader from "@/components/explore/SectionHeader";
import MapView from "@/components/explore/MapView";
import SearchBar from "@/components/search/SearchBar";
import NearbyPlaces from "@/components/explore/NearbyPlaces";
import SavedPlacesSection from "@/components/explore/SavedPlacesSection";
import { useLocation } from "@/lib/LocationContext";

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { location, loading, error, refresh: refreshLocation } = useLocation();

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef(0);


  const handlePullToRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshLocation();
    setRefreshTrigger((prev) => prev + 1);
    setTimeout(() => setIsRefreshing(false), 2000);
  }, [refreshLocation]);

  const onTouchStart = useCallback((e) => {
    if (window.scrollY <= 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  }, []);

  const onTouchMove = useCallback((e) => {
    if (window.scrollY <= 0 && touchStartY.current > 0) {
      const distance = e.touches[0].clientY - touchStartY.current;
      if (distance > 0) {
        setPullDistance(Math.min(distance * 0.4, 60));
      }
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    if (pullDistance > 40) {
      handlePullToRefresh();
    }
    setPullDistance(0);
    touchStartY.current = 0;
  }, [pullDistance, handlePullToRefresh]);

  return (
    <div
      className="min-h-screen bg-[#0B1220] pb-28"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="flex justify-center items-center overflow-hidden transition-all"
          style={{ height: isRefreshing ? 40 : pullDistance }}
        >
          <RefreshCw className={`w-5 h-5 text-blue-400 ${isRefreshing ? "animate-spin" : ""}`} />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <div>
          <p className="text-white/40 text-sm">Good morning 👋</p>
          <h1 className="text-xl font-bold text-white font-heading">Where to next?</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
          E
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)}
        />
      </div>

      {/* Hero */}
      <HeroSection />

      {/* Live Weather Widget */}
      <div className="px-4 mt-6">
        <LiveWeatherWidget
          location={location}
          loading={loading}
          error={error}
          refreshTrigger={refreshTrigger}
          onRefreshLocation={refreshLocation}
        />
      </div>

      {/* Interactive Map */}
      <div className="mt-8">
        <SectionHeader title="Your Travel Map" subtitle="Saved destinations around the world" />
        <div className="px-4">
          <MapView />
        </div>
      </div>

      {/* Nearby Places */}
      <NearbyPlaces location={location} />

      {/* Saved Places */}
      <div className="mt-8">
        <SectionHeader title="Your Saved Places" subtitle="Destinations you've added to your map" />
        <SavedPlacesSection />
      </div>

      {/* Daily Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mx-4 mt-8 glass-card rounded-3xl p-6"
      >
        <p className="text-white/30 text-xs font-medium uppercase tracking-wider mb-2">Daily Inspiration</p>
        <p className="text-white/80 text-sm italic leading-relaxed">
          "The world is a book, and those who do not travel read only one page."
        </p>
        <p className="text-white/40 text-xs mt-2">— Saint Augustine</p>
      </motion.div>

      {/* Floating Search Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/search")}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center glow-blue z-40"
      >
        <Search className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
}