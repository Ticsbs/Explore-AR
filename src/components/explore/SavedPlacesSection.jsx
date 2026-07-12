import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";

export default function SavedPlacesSection() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const data = await base44.entities.SavedPlace.list("-created_date", 20);
      setPlaces(data);
    } catch (err) {
      console.error("Failed to fetch saved places:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {[1, 2, 3].map((i) => (
          <div key={i} className="min-w-[260px] h-[200px] rounded-3xl bg-white/5 animate-pulse flex-shrink-0" />
        ))}
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="px-4">
        <div className="glass-card rounded-2xl p-8 text-center">
          <MapPin className="w-10 h-10 text-white/10 mx-auto mb-2" />
          <p className="text-white/40 text-sm">Add your first destination to see it here</p>
          <button
            onClick={() => navigate("/search")}
            className="mt-3 px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 text-xs font-medium flex items-center gap-2 mx-auto"
          >
            <Plus className="w-3 h-3" /> Search destinations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
      {places.map((place, i) => (
        <motion.div
          key={place.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
          whileHover={{ y: -6, scale: 1.02 }}
          className="group relative rounded-3xl overflow-hidden cursor-pointer min-w-[260px] flex-shrink-0"
        >
          <div className="relative h-[200px]">
            {place.image_url ? (
              <img
                src={place.image_url}
                alt={place.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-teal-500/20 flex items-center justify-center">
                <MapPin className="w-10 h-10 text-white/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bold font-heading">{place.name}</h3>
              {place.country && (
                <p className="text-white/60 text-xs mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {place.country}
                </p>
              )}
              {place.description && (
                <p
                  className="text-white/40 text-xs mt-1"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {place.description}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}