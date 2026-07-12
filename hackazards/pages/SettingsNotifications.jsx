import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Bell, CloudRain, Shield, Calendar, Plane } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/lib/LanguageContext";

const NOTIF_KEY = "explorear_notifications";

const defaults = {
  weather_alerts: true,
  safety_alerts: true,
  festival_reminders: true,
  trip_reminders: false,
};

export default function SettingsNotifications() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState(defaults);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(NOTIF_KEY) || "null");
      if (saved) setPrefs(saved);
    } catch {}
  }, []);

  const toggle = (key) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
  };

  const items = [
    { key: "weather_alerts", icon: CloudRain, color: "text-blue-400", bg: "from-blue-500/20 to-blue-600/20", label: t("notif.weather_alerts"), desc: t("notif.weather_alerts_desc") },
    { key: "safety_alerts", icon: Shield, color: "text-red-400", bg: "from-red-500/20 to-red-600/20", label: t("notif.safety_alerts"), desc: t("notif.safety_alerts_desc") },
    { key: "festival_reminders", icon: Calendar, color: "text-teal-400", bg: "from-teal-500/20 to-teal-600/20", label: t("notif.festival_reminders"), desc: t("notif.festival_reminders_desc") },
    { key: "trip_reminders", icon: Plane, color: "text-orange-400", bg: "from-orange-500/20 to-orange-600/20", label: t("notif.trip_reminders"), desc: t("notif.trip_reminders_desc") },
  ];

  return (
    <div className="min-h-screen bg-[#0B1220] pb-28">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/profile")} className="w-10 h-10 rounded-full glass flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white font-heading">{t("page.notifications")}</h1>
          <p className="text-white/40 text-sm">{t("notif.subtitle")}</p>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-card rounded-2xl p-4 flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.bg} flex items-center justify-center flex-shrink-0`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-semibold">{item.label}</p>
              <p className="text-white/40 text-xs mt-0.5">{item.desc}</p>
            </div>
            <Switch checked={prefs[item.key]} onCheckedChange={() => toggle(item.key)} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}