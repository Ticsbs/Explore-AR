import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Hospital, Hotel, MapPin } from "lucide-react";
import SectionHeader from "@/components/explore/SectionHeader";
import NearbyResultsSheet from "@/components/explore/NearbyResultsSheet";

const categories = [
  { id: "food", label: "Food", icon: Utensils, color: "from-orange-500/20 to-red-500/20", iconColor: "text-orange-400" },
  { id: "medical", label: "Medical", icon: Hospital, color: "from-red-500/20 to-pink-500/20", iconColor: "text-red-400" },
  { id: "hotels", label: "Hotels", icon: Hotel, color: "from-blue-500/20 to-teal-500/20", iconColor: "text-blue-400" },
];

export default function NearbyPlaces({ location }) {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <>
      <div className="mt-8 px-4">
        <SectionHeader title="Nearby Places" subtitle="Discover what's around you" />
        <div className="flex gap-4 mt-4">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => location && setActiveCategory(cat.id)}
              disabled={!location}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg ${!location ? "opacity-40" : ""}`}>
                <cat.icon className={`w-7 h-7 ${cat.iconColor}`} />
              </div>
              <span className="text-white/60 text-xs font-medium">{cat.label}</span>
            </motion.button>
          ))}
        </div>
        {!location && (
          <p className="text-white/30 text-xs text-center mt-3 flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3" /> Enable location to find nearby places
          </p>
        )}
      </div>

      <AnimatePresence>
        {activeCategory && location && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[200]"
              onClick={() => setActiveCategory(null)}
            />
            <NearbyResultsSheet
              category={activeCategory}
              location={location}
              onClose={() => setActiveCategory(null)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}