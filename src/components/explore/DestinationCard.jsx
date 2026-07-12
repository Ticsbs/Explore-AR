import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Heart, MapPin, Wallet, Cloud } from "lucide-react";
import { hapticTap } from "@/lib/haptics";

export default function DestinationCard({ destination, index = 0 }) {
  const [saved, setSaved] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative rounded-3xl overflow-hidden cursor-pointer min-w-[260px] sm:min-w-[280px]"
    >
      <div className="relative h-[340px]">
        <img
          src={destination.image}
          alt={destination.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Save button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => { e.stopPropagation(); hapticTap(); setSaved(!saved); }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center"
        >
          <Heart className={`w-5 h-5 ${saved ? "fill-red-500 text-red-500" : "text-white/70"}`} />
        </motion.button>

        {/* Category badge */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full glass text-xs font-medium text-white/90">
          {destination.category}
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-xl font-bold text-white font-heading">{destination.name}</h3>
          <div className="flex items-center gap-1 mt-1 text-white/60 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>{destination.country}</span>
          </div>
          <div className="flex items-center gap-3 mt-3 text-xs text-white/70">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              {destination.rating}
            </span>
            <span className="flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              {destination.budget}
            </span>
            <span className="flex items-center gap-1">
              <Cloud className="w-3.5 h-3.5 text-blue-400" />
              {destination.weather}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}