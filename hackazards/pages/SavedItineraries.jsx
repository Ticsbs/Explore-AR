import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Wallet, Users, MapPin, Loader2, Plane } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";

export default function SavedItineraries() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Trip.list("-created_date", 50)
      .then(setTrips)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const styleColors = {
    solo: "bg-blue-500/10 text-blue-300",
    friends: "bg-purple-500/10 text-purple-300",
    family: "bg-teal-500/10 text-teal-300",
    couple: "bg-pink-500/10 text-pink-300",
    business: "bg-orange-500/10 text-orange-300",
  };

  return (
    <div className="min-h-screen bg-[#0B1220] pb-28">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/profile")} className="w-10 h-10 rounded-full glass flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white font-heading">{t("page.saved_itineraries")}</h1>
          <p className="text-white/40 text-sm">{trips.length} {trips.length === 1 ? "trip" : "trips"}</p>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Plane className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-white/40 text-sm">{t("common.empty")}</p>
            <button
              onClick={() => navigate("/planner")}
              className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm font-semibold"
            >
              {t("nav.planner")}
            </button>
          </div>
        ) : (
          trips.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card rounded-2xl p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                {trip.image_url ? (
                  <img src={trip.image_url} alt={trip.destination} className="w-14 h-14 rounded-xl object-cover" loading="lazy" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-teal-500/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-400" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{trip.destination}</p>
                  {trip.travel_style && (
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${styleColors[trip.travel_style] || styleColors.solo}`}>
                      {trip.travel_style}
                    </span>
                  )}
                </div>
                {trip.status === "planned" && (
                  <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 text-xs">Planned</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-white/40 text-xs">
                {trip.days && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {trip.days} days
                  </span>
                )}
                {trip.budget && (
                  <span className="flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5" /> ${trip.budget}
                  </span>
                )}
                {trip.interests?.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {trip.interests.length} interests
                  </span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}