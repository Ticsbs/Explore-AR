import React from "react";
import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";

const categoryColors = {
  History: { gradient: "from-amber-500/20 to-yellow-600/20", badge: "bg-amber-500/10 text-amber-300", icon: "🏛️" },
  Culture: { gradient: "from-blue-500/20 to-indigo-600/20", badge: "bg-blue-500/10 text-blue-300", icon: "🎭" },
  Adventure: { gradient: "from-orange-500/20 to-red-600/20", badge: "bg-orange-500/10 text-orange-300", icon: "⛰️" },
  Nature: { gradient: "from-emerald-500/20 to-teal-600/20", badge: "bg-emerald-500/10 text-emerald-300", icon: "🌿" },
  Food: { gradient: "from-pink-500/20 to-rose-600/20", badge: "bg-pink-500/10 text-pink-300", icon: "🍜" },
  Photography: { gradient: "from-purple-500/20 to-violet-600/20", badge: "bg-purple-500/10 text-purple-300", icon: "📸" },
  Shopping: { gradient: "from-rose-500/20 to-pink-600/20", badge: "bg-rose-500/10 text-rose-300", icon: "🛍️" },
  Nightlife: { gradient: "from-indigo-500/20 to-blue-600/20", badge: "bg-indigo-500/10 text-indigo-300", icon: "🌃" },
  Wildlife: { gradient: "from-green-500/20 to-emerald-600/20", badge: "bg-green-500/10 text-green-300", icon: "🦁" },
  "Eco Tourism": { gradient: "from-teal-500/20 to-green-600/20", badge: "bg-teal-500/10 text-teal-300", icon: "🌱" },
};

export default function RecommendationCard({ place, index = 0 }) {
  const cat = categoryColors[place.category] || categoryColors.Culture;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      className="glass-card rounded-2xl overflow-hidden flex cursor-pointer"
    >
      <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
        {place.image ? (
          <img src={place.image} alt={place.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${cat.gradient} flex items-center justify-center`}>
            <span className="text-3xl">{cat.icon}</span>
          </div>
        )}
      </div>

      <div className="flex-1 p-3 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-white font-semibold text-sm truncate">{place.name}</h3>
          {place.category && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${cat.badge}`}>
              {place.category}
            </span>
          )}
        </div>
        {place.reason && (
          <p className="text-teal-400/80 text-xs mb-1">{place.reason}</p>
        )}
        {place.description && (
          <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{place.description}</p>
        )}
        <div className="flex items-center gap-3 mt-1.5">
          {place.rating && (
            <span className="flex items-center gap-1 text-xs text-yellow-400">
              <Star className="w-3 h-3 fill-yellow-400" /> {place.rating}
            </span>
          )}
          {place.popularity_score && (
            <span className="text-white/30 text-xs">🔥 {place.popularity_score}%</span>
          )}
          {place.distance && (
            <span className="flex items-center gap-1 text-white/30 text-xs">
              <MapPin className="w-3 h-3" /> {place.distance}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}