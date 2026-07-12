import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Accessibility, Eye, Ear, MousePointer, Monitor, Subtitles,
  Hand, BookOpen, Volume2, ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";

const STORAGE_KEY = "explorear_accessibility";

const options = [
  { id: "high_contrast", label: "High Contrast", desc: "Increase color contrast for better visibility", icon: Monitor, color: "from-blue-500/20 to-blue-600/20", iconColor: "text-blue-400" },
  { id: "large_text", label: "Large Text", desc: "Increase text size throughout the app", icon: BookOpen, color: "from-purple-500/20 to-purple-600/20", iconColor: "text-purple-400" },
  { id: "voice_navigation", label: "Voice Navigation", desc: "Navigate using voice commands", icon: Volume2, color: "from-teal-500/20 to-teal-600/20", iconColor: "text-teal-400" },
  { id: "screen_reader", label: "Screen Reader", desc: "Enable screen reader optimizations", icon: Eye, color: "from-orange-500/20 to-orange-600/20", iconColor: "text-orange-400" },
  { id: "captions", label: "Captions", desc: "Show captions for audio content", icon: Subtitles, color: "from-pink-500/20 to-pink-600/20", iconColor: "text-pink-400" },
  { id: "sign_language", label: "Sign Language", desc: "Enable sign language overlays", icon: Hand, color: "from-indigo-500/20 to-indigo-600/20", iconColor: "text-indigo-400" },
  { id: "wheelchair_routes", label: "Wheelchair Routes", desc: "Show accessible routes and entrances", icon: Accessibility, color: "from-emerald-500/20 to-emerald-600/20", iconColor: "text-emerald-400" },
  { id: "reading_mode", label: "Reading Mode", desc: "Simplified, distraction-free interface", icon: MousePointer, color: "from-yellow-500/20 to-yellow-600/20", iconColor: "text-yellow-400" },
];

export default function AccessibilityPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [enabled, setEnabled] = useState({});

  // Load saved preferences from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      setEnabled(saved);
    } catch {}
  }, []);

  // Apply visual settings to the document root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("high-contrast", !!enabled.high_contrast);
    root.classList.toggle("large-text", !!enabled.large_text);
  }, [enabled.high_contrast, enabled.large_text]);

  const toggle = (id) => {
    setEnabled((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1220] pb-28">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/profile")} className="w-10 h-10 rounded-full glass flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <Accessibility className="w-5 h-5 text-teal-400" />
            <h1 className="text-2xl font-bold text-white font-heading">{t("page.accessibility")}</h1>
          </div>
          <p className="text-white/40 text-sm mt-1">Customize your experience</p>
        </div>
      </div>

      <div className="px-4 space-y-3">
        {options.map((opt, i) => (
          <motion.div
            key={opt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`glass-card rounded-2xl p-4 flex items-center gap-4 transition-all ${enabled[opt.id] ? "border-teal-500/30" : ""}`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${opt.color} flex items-center justify-center`}>
              <opt.icon className={`w-6 h-6 ${opt.iconColor}`} />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-semibold">{opt.label}</p>
              <p className="text-white/40 text-xs mt-0.5">{opt.desc}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => toggle(opt.id)}
              className={`w-12 h-7 rounded-full p-1 transition-all ${enabled[opt.id] ? "bg-teal-500" : "bg-white/10"}`}
            >
              <motion.div
                animate={{ x: enabled[opt.id] ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-5 h-5 rounded-full bg-white shadow-md"
              />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}