import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Star, Loader2, Trash2, Heart } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";

export default function FavoriteDestinations() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlaces = useCallback(async () => {
    setLoading(true);
    try {
      const result = await base44.entities.SavedPlace.list("-created_date", 50);
      setPlaces(result);
    } catch {
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  const handleDelete = useCallback(async (id) => {
    try {
      await base44.entities.SavedPlace.delete(id);
      fetchPlaces();
    } catch {}
  }, [fetchPlaces]);

  return (
    <div className="min-h-screen bg-[#0B1220] pb-28">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/profile")} className="w-10 h-10 rounded-full glass flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white font-heading">{t("page.favorites")}</h1>
          <p className="text-white/40 text-sm">{places.length} {places.length === 1 ? "place" : "places"}</p>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
          </div>
        ) : places.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-white/40 text-sm">{t("common.empty")}</p>
            <button
              onClick={() => navigate("/search")}
              className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm font-semibold"
            >
              {t("nav.search")}
            </button>
          </div>
        ) : (
          places.map((place, i) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              <div className="flex gap-3 p-3">
                {place.image_url ? (
                  <img src={place.image_url} alt={place.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" loading="lazy" />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500/20 to-teal-500/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-8 h-8 text-blue-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{place.name}</p>
                  {place.country && (
                    <p className="text-white/40 text-xs mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {place.country}
                    </p>
                  )}
                  {place.category && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-white/5 text-white/50 text-xs">
                      {place.category}
                    </span>
                  )}
                  {place.rating && (
                    <p className="text-yellow-400 text-xs mt-1 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400" /> {place.rating}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(place.id)}
                  className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 self-start"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
              {place.description && (
                <p className="text-white/40 text-xs px-3 pb-3 line-clamp-2">{place.description}</p>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}