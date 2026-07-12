import React from "react";
import { motion } from "framer-motion";
import { Cloud, Sun, Droplets, Wind } from "lucide-react";

export default function WeatherWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-3xl p-5 flex items-center gap-4"
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-orange-400/20 flex items-center justify-center">
        <Sun className="w-7 h-7 text-yellow-400" />
      </div>
      <div className="flex-1">
        <p className="text-white/50 text-xs font-medium">Current Location</p>
        <p className="text-2xl font-bold text-white font-heading">24°C</p>
      </div>
      <div className="flex flex-col gap-1.5 text-xs text-white/50">
        <span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-blue-400" /> 45%</span>
        <span className="flex items-center gap-1"><Wind className="w-3 h-3 text-teal-400" /> 12 km/h</span>
        <span className="flex items-center gap-1"><Cloud className="w-3 h-3 text-white/40" /> Partly Cloudy</span>
      </div>
    </motion.div>
  );
}