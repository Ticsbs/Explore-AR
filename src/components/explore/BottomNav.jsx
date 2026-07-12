import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, ScanLine, Sparkles, Shield, User } from "lucide-react";
import { motion } from "framer-motion";
import { hapticTap } from "@/lib/haptics";
import { useLanguage } from "@/lib/LanguageContext";

const tabs = [
  { path: "/", icon: Home, labelKey: "nav.home" },
  { path: "/search", icon: Search, labelKey: "nav.search" },
  { path: "/scan", icon: ScanLine, labelKey: "nav.scan" },
  { path: "/planner", icon: Sparkles, labelKey: "nav.planner" },
  { path: "/safety", icon: Shield, labelKey: "nav.safety" },
  { path: "/profile", icon: User, labelKey: "nav.profile" },
];

export default function BottomNav() {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-xl">
      <div className="glass-strong rounded-[28px] px-2 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <Link key={tab.path} to={tab.path} onClick={hapticTap} className="relative flex flex-col items-center gap-0.5 px-2 py-1.5">
              {active && (
                <motion.div
                  layoutId="navGlow"
                  className="absolute inset-0 rounded-2xl bg-blue-500/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div whileTap={{ scale: 0.9 }}>
                <Icon
                  className={`w-5 h-5 transition-colors ${active ? "text-blue-400" : "text-white/40"}`}
                  strokeWidth={active ? 2.5 : 1.5}
                />
              </motion.div>
              <span className={`text-[10px] font-medium transition-colors ${active ? "text-blue-400" : "text-white/30"}`}>
                {t(tab.labelKey)}
              </span>
              {active && (
                <motion.div
                  layoutId="navDot"
                  className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-blue-400"
                  style={{ boxShadow: "0 0 8px 2px rgba(59,130,246,0.6)" }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}