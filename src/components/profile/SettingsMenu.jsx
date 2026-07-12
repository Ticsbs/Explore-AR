import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bookmark, Heart, Accessibility, Bell, Languages, Moon, Settings,
  ChevronRight, LogOut
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { base44 } from "@/api/base44Client";
import { useTheme } from "@/lib/ThemeContext";
import { useLanguage } from "@/lib/LanguageContext";

export default function SettingsMenu() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [tripCount, setTripCount] = useState(null);
  const [placeCount, setPlaceCount] = useState(null);

  useEffect(() => {
    base44.entities.Trip.list("-created_date", 50)
      .then((trips) => setTripCount(trips.length))
      .catch(() => setTripCount(0));
    base44.entities.SavedPlace.list("-created_date", 50)
      .then((places) => setPlaceCount(places.length))
      .catch(() => setPlaceCount(0));
  }, []);

  const items = [
    { label: t("menu.saved_itineraries"), icon: Bookmark, color: "text-blue-400", badge: tripCount, path: "/saved-itineraries" },
    { label: t("menu.favorites"), icon: Heart, color: "text-red-400", badge: placeCount, path: "/favorite-destinations" },
    { label: t("menu.accessibility"), icon: Accessibility, color: "text-teal-400", path: "/accessibility" },
    { label: t("menu.notifications"), icon: Bell, color: "text-yellow-400", path: "/settings/notifications" },
    { label: t("menu.language"), icon: Languages, color: "text-purple-400", path: "/settings/language" },
    { label: t("menu.dark_mode"), icon: Moon, color: "text-indigo-400", toggle: true },
    { label: t("menu.account"), icon: Settings, color: "text-white/50", path: "/settings/account" },
  ];

  return (
    <div className="px-4 mt-6 space-y-2">
      {items.map((item) => (
        <motion.div
          key={item.label}
          whileTap={{ scale: 0.98 }}
          onClick={() => item.path && navigate(item.path)}
          className="glass-card rounded-2xl p-4 flex items-center gap-3 cursor-pointer"
        >
          <item.icon className={`w-5 h-5 ${item.color}`} />
          <span className="text-white/80 text-sm flex-1">{item.label}</span>
          {item.badge !== undefined && item.badge !== null && (
            <span className="text-white/40 text-xs">
              {item.badge > 0 ? item.badge : t("common.empty")}
            </span>
          )}
          {item.toggle ? (
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
          ) : (
            <ChevronRight className="w-4 h-4 text-white/20" />
          )}
        </motion.div>
      ))}

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => base44.auth.logout("/")}
        className="w-full glass-card rounded-2xl p-4 flex items-center gap-3 cursor-pointer"
      >
        <LogOut className="w-5 h-5 text-red-400" />
        <span className="text-red-400/80 text-sm">{t("menu.logout")}</span>
      </motion.button>
    </div>
  );
}