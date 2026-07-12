import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";

export const ALL_CATEGORIES = [
  "History", "Culture", "Adventure", "Nature", "Food",
  "Shopping", "Photography", "Nightlife", "Wildlife", "Eco Tourism",
];

const categoryConfig = {
  History: { emoji: "🏛️", color: "from-amber-500 to-yellow-600" },
  Culture: { emoji: "🎭", color: "from-blue-500 to-indigo-600" },
  Adventure: { emoji: "⛰️", color: "from-orange-500 to-red-600" },
  Nature: { emoji: "🌿", color: "from-emerald-500 to-teal-600" },
  Food: { emoji: "🍜", color: "from-pink-500 to-rose-600" },
  Shopping: { emoji: "🛍️", color: "from-rose-500 to-pink-600" },
  Photography: { emoji: "📸", color: "from-purple-500 to-violet-600" },
  Nightlife: { emoji: "🌃", color: "from-indigo-500 to-blue-600" },
  Wildlife: { emoji: "🦁", color: "from-green-500 to-emerald-600" },
  "Eco Tourism": { emoji: "🌱", color: "from-teal-500 to-green-600" },
};

export default function CategoryChips({ selectedCategories, onToggle, onClear }) {
  const hasSelection = selectedCategories.length > 0;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {hasSelection && (
        <button
          onClick={onClear}
          className="flex-shrink-0 w-8 h-8 rounded-full glass-card flex items-center justify-center"
        >
          <X className="w-3.5 h-3.5 text-white/40" />
        </button>
      )}
      {ALL_CATEGORIES.map(cat => {
        const config = categoryConfig[cat];
        const isSelected = selectedCategories.includes(cat);
        return (
          <button
            key={cat}
            onClick={() => onToggle(cat)}
            className="flex-shrink-0"
          >
            <motion.div
              layout
              initial={false}
              animate={{
                scale: isSelected ? 1.02 : 1,
              }}
              whileTap={{ scale: 0.95 }}
              className={`px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
                isSelected
                  ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                  : "glass-card text-white/50"
              }`}
            >
              <span>{config.emoji}</span>
              {cat}
              {isSelected && <Check className="w-3 h-3" />}
            </motion.div>
          </button>
        );
      })}
    </div>
  );
}