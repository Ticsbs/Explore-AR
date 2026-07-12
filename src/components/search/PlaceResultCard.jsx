import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const gradientColors = [
  "from-blue-500/30 to-teal-500/30",
  "from-purple-500/30 to-pink-500/30",
  "from-orange-500/30 to-red-500/30",
  "from-green-500/30 to-emerald-500/30",
  "from-indigo-500/30 to-blue-500/30",
  "from-amber-500/30 to-yellow-500/30",
];

export default function PlaceResultCard({ place, image, index, onClick }) {
  const gradient = gradientColors[index % gradientColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass-card rounded-2xl overflow-hidden cursor-pointer group"
    >
      <div className="relative h-32 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={place.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.classList.add("bg-gradient-to-br", gradient);
            }}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-3xl opacity-50">{place.categoryIcon}</span>
          </div>
        )}
        <div className="absolute top-2 left-2 px-2 py-1 rounded-full glass text-white/80 text-xs font-medium">
          {place.categoryIcon} {place.category}
        </div>
      </div>
      <div className="p-3">
        <p className="text-white text-sm font-semibold truncate">{place.name}</p>
        {place.location && (
          <p className="text-white/40 text-xs mt-0.5 flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 flex-shrink-0" /> {place.location}
          </p>
        )}
      </div>
    </motion.div>
  );
}