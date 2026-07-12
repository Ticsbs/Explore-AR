import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin, Trophy, Globe, Camera, Bookmark, Settings, ChevronRight,
  Star, Flame, Map, Award, Plane, Heart, Bell, Moon, Languages,
  Eye, Accessibility, LogOut
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import SettingsMenu from "@/components/profile/SettingsMenu";


const stats = [
  { label: "Countries", value: "12", icon: Globe, color: "text-blue-400" },
  { label: "Cities", value: "34", icon: MapPin, color: "text-teal-400" },
  { label: "Trips", value: "8", icon: Plane, color: "text-orange-400" },
  { label: "Photos", value: "256", icon: Camera, color: "text-purple-400" },
];



export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1220] pb-28">
      {/* Banner */}
      <div className="relative h-48 rounded-b-3xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80"
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/50 to-transparent" />
      </div>

      {/* Avatar */}
      <div className="px-5 -mt-12 relative z-10">
        <div className="flex items-end gap-4">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-3xl font-bold text-white font-heading border-4 border-[#0B1220]">
            {user?.full_name?.[0] || "E"}
          </div>
          <div className="mb-2">
            <h1 className="text-xl font-bold text-white font-heading">{user?.full_name || "Explorer"}</h1>
            <p className="text-white/40 text-sm">{user?.email || "explorer@email.com"}</p>
          </div>
        </div>

        {/* Travel Level */}
        <div className="glass-card rounded-2xl p-4 mt-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white text-sm font-semibold">Gold Explorer</span>
              <span className="text-white/30 text-xs">Level 12</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "68%" }}
                transition={{ delay: 0.5, duration: 1 }}
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 px-4 mt-5">
        {stats.map((s) => (
          <motion.div
            key={s.label}
            whileHover={{ scale: 1.05 }}
            className="glass-card rounded-2xl p-3 text-center"
          >
            <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-1`} />
            <p className="text-white text-lg font-bold font-heading">{s.value}</p>
            <p className="text-white/30 text-[10px]">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Streak */}
      <div className="mx-4 mt-5 glass-card rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
          <Flame className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <p className="text-white text-sm font-semibold">7-day travel streak 🔥</p>
          <p className="text-white/40 text-xs">Keep exploring to maintain your streak!</p>
        </div>
      </div>

      {/* Bucket List */}
      <div className="mx-4 mt-5 glass-card rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Map className="w-4 h-4 text-teal-400" />
          <span className="text-white text-sm font-semibold">Bucket List</span>
          <span className="ml-auto text-white/30 text-xs">3/10 completed</span>
        </div>
        <div className="flex gap-2">
          {["🗼 Paris", "⛩️ Kyoto", "🏖️ Bali"].map((item) => (
            <span key={item} className="px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-300 text-xs">{item}</span>
          ))}
        </div>
      </div>

      <SettingsMenu />
    </div>
  );
}