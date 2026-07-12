import React from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Ticket, Calendar, Star, Wallet, Volume2 } from "lucide-react";
import { speak, stopSpeaking } from "@/lib/tts";
import { useState } from "react";
import { ImageCarousel } from "@/components/common/ImageCarousel";

const categoryBadges = {
  History: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  Culture: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  Adventure: "bg-orange-500/10 text-orange-300 border-orange-500/20",
  Nature: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  Food: "bg-pink-500/10 text-pink-300 border-pink-500/20",
  Photography: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  Shopping: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  Nightlife: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
  Wildlife: "bg-green-500/10 text-green-300 border-green-500/20",
  "Eco Tourism": "bg-teal-500/10 text-teal-300 border-teal-500/20",
};

export default function PlaceDetailCard({ place, images = [] }) {
  const badge = categoryBadges[place.category] || categoryBadges.Culture;
  const displayImages = images.length > 0 ? images : (place.image ? [place.image] : []);
  const [speaking, setSpeaking] = useState(false);

  const handleTTS = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
    } else {
      const text = `${place.name}. ${place.description || ""} ${place.history || ""}`;
      speak(text);
      setSpeaking(true);
      setTimeout(() => setSpeaking(false), text.length * 50);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl overflow-hidden"
    >
      {/* Image Carousel */}
      {displayImages.length > 0 ? (
        <div className="h-52">
          <ImageCarousel images={displayImages} alt={place.name} />
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-br from-blue-500/20 via-teal-500/15 to-purple-500/20 flex items-center justify-center">
          <MapPin className="w-16 h-16 text-white/10" />
        </div>
      )}

      <div className="p-5 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {place.category && (
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${badge}`}>
                {place.category}
              </span>
            )}
            {place.rating && (
              <span className="flex items-center gap-1 text-xs text-yellow-400">
                <Star className="w-3 h-3 fill-yellow-400" /> {place.rating}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-heading">{place.name}</h2>
            <button onClick={handleTTS} className={`w-8 h-8 rounded-full glass flex items-center justify-center ${speaking ? "text-teal-400 animate-pulse" : "text-white/40"}`}>
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          {place.location && (
            <p className="text-white/50 text-sm mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {place.location}
            </p>
          )}
        </div>

        {place.description && (
          <p className="text-white/60 text-sm leading-relaxed">{place.description}</p>
        )}

        {place.history && (
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">History</p>
            <p className="text-white/60 text-sm leading-relaxed">{place.history}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          {place.best_time_to_visit && (
            <InfoItem icon={Calendar} label="Best Time" value={place.best_time_to_visit} color="text-teal-400" />
          )}
          {place.entry_fee && (
            <InfoItem icon={Ticket} label="Entry Fee" value={place.entry_fee} color="text-emerald-400" />
          )}
          {place.opening_hours && (
            <InfoItem icon={Clock} label="Hours" value={place.opening_hours} color="text-blue-400" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function InfoItem({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white/[0.03] rounded-xl p-3 text-center">
      <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
      <p className="text-white/30 text-[10px] uppercase tracking-wider">{label}</p>
      <p className="text-white text-xs font-medium mt-0.5">{value}</p>
    </div>
  );
}