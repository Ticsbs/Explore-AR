import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, MapPin, X } from "lucide-react";
import DestinationCard from "@/components/explore/DestinationCard";
import { DESTINATIONS, CATEGORIES } from "@/lib/destinations";

export default function Explore() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = DESTINATIONS.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || d.categories?.includes(activeCategory);
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-[#08111F] pb-28">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-white font-heading">Explore</h1>
        <p className="text-white/40 text-sm mt-1">Find your next adventure</p>
      </div>

      {/* Search */}
      <div className="px-4 flex gap-3">
        <div className="flex-1 glass-card rounded-2xl flex items-center gap-3 px-4 py-3">
          <Search className="w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-white text-sm outline-none w-full placeholder:text-white/30"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X className="w-4 h-4 text-white/40" />
            </button>
          )}
        </div>
        <button className="glass-card rounded-2xl w-12 h-12 flex items-center justify-center">
          <SlidersHorizontal className="w-4 h-4 text-white/60" />
        </button>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto px-4 mt-4 pb-2 scrollbar-hide">
        {["All", ...CATEGORIES.map(c => c.name)].map((cat) => (
          <motion.button
            key={cat}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat
                ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                : "glass-card text-white/50 hover:text-white/70"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 mt-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((d, i) => (
            <DestinationCard key={d.id} destination={d} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <MapPin className="w-12 h-12 text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No destinations found</p>
        </div>
      )}
    </div>
  );
  }