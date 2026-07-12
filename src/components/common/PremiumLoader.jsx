import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, Compass, Plane, Sparkles } from "lucide-react";

export function GlobeLoader({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        className="relative w-16 h-16 mb-4"
      >
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500" />
        <Globe className="absolute inset-0 m-auto w-7 h-7 text-blue-400" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-white font-medium text-sm"
      >
        {label}
      </motion.p>
    </div>
  );
}

export function CompassLoader({ label = "Searching..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="w-14 h-14 mb-4"
      >
        <Compass className="w-14 h-14 text-teal-400" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-white font-medium text-sm"
      >
        {label}
      </motion.p>
    </div>
  );
}

export function PlaneLoader({ label = "Searching..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-32 h-10 mb-4">
        <motion.div
          animate={{ x: [0, 80, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="absolute top-0 left-0"
        >
          <Plane className="w-8 h-8 text-blue-400 -rotate-45" />
        </motion.div>
        <motion.div
          animate={{ scaleX: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute bottom-0 left-0 h-0.5 w-20 bg-gradient-to-r from-blue-500 to-teal-500 origin-left"
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-white font-medium text-sm"
      >
        {label}
      </motion.p>
    </div>
  );
}

export function ScanLoader({ label = "Identifying monument..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-24 h-24 mb-4">
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-2xl border-2 border-teal-500/30"
        />
        <motion.div
          animate={{ y: [0, 80, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute left-2 right-2 h-0.5 bg-teal-400"
          style={{ boxShadow: "0 0 10px 2px rgba(20,184,166,0.6)" }}
        />
        <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-teal-400" />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-white font-medium text-sm"
      >
        {label}
      </motion.p>
    </div>
  );
}

// Skeleton card for search results
export function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="w-full h-40 bg-white/[0.04] animate-pulse" />
      <div className="p-4">
        <div className="h-4 w-2/3 bg-white/[0.06] rounded animate-pulse mb-2" />
        <div className="h-3 w-1/2 bg-white/[0.04] rounded animate-pulse mb-3" />
        <div className="h-3 w-full bg-white/[0.04] rounded animate-pulse mb-1.5" />
        <div className="h-3 w-3/4 bg-white/[0.04] rounded animate-pulse" />
      </div>
    </div>
  );
}

export function SkeletonDetailCard() {
  return (
    <div className="space-y-4">
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="w-full h-48 bg-white/[0.04] animate-pulse" />
        <div className="p-5">
          <div className="h-6 w-1/2 bg-white/[0.06] rounded animate-pulse mb-3" />
          <div className="h-3 w-1/3 bg-white/[0.04] rounded animate-pulse mb-4" />
          <div className="h-3 w-full bg-white/[0.04] rounded animate-pulse mb-2" />
          <div className="h-3 w-full bg-white/[0.04] rounded animate-pulse mb-2" />
          <div className="h-3 w-2/3 bg-white/[0.04] rounded animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-card rounded-xl p-3">
            <div className="h-8 w-8 bg-white/[0.06] rounded-lg animate-pulse mb-2" />
            <div className="h-3 w-full bg-white/[0.04] rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

// Rotating loader that cycles through travel icons
export function TravelPathLoader({ label = "Loading..." }) {
  const icons = [Globe, Compass, Plane, Sparkles];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % icons.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const Icon = icons[index];

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        key={index}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="w-14 h-14 mb-4"
      >
        <Icon className="w-14 h-14 text-blue-400" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-white font-medium text-sm"
      >
        {label}
      </motion.p>
    </div>
  );
}