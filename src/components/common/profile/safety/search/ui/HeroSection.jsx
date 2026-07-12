import React from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <div className="relative h-[420px] sm:h-[480px] rounded-3xl overflow-hidden mx-4">
      <img
        src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&q=80"
        alt="Travel destination"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#08111F] via-[#08111F]/40 to-transparent" />
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-teal-600/10 animate-gradient" />

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-white/60 text-sm font-medium mb-1">✨ AI-Powered Travel</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-heading leading-tight">
            Discover the World<br />
            <span className="gradient-text">Like Never Before</span>
          </h1>
          <p className="text-white/50 text-sm mt-2 max-w-md">
            Explore destinations with AI planning and personalized itineraries.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3 mt-5"
        >
          {/* Search bar */}
          <div className="flex-1 glass rounded-2xl flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/10 transition-colors">
            <Search className="w-4 h-4 text-white/40" />
            <span className="text-white/40 text-sm">Search destinations...</span>
          </div>
          
          {/* AI Button */}
          <Link to="/planner">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm font-semibold glow-blue whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              Plan Trip
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}