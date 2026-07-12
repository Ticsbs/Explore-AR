import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { X, Bookmark, Share2, Loader2, MapPin, FileText } from "lucide-react";
import { fetchPlaceMedia } from "@/lib/placeSearch";
import { base44 } from "@/api/base44Client";

// Fix default marker icon for Leaflet
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

export default function PlaceDetailSheet({ place, onClose }) {
  const [media, setMedia] = useState({ image: null, description: null });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!place) return;
    setLoading(true);
    setSaved(false);
    fetchPlaceMedia(place.raw || place).then((m) => {
      setMedia(m);
      setLoading(false);
    });
  }, [place]);

  if (!place) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.SavedPlace.create({
        name: place.name,
        image_url: media.image || "",
        category: place.category,
        country: place.country || "",
        description: media.description || place.location || "",
        lat: place.lat,
        lng: place.lon,
      });
      setSaved(true);
    } catch (err) {
      console.error("Failed to save place:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: place.name,
          text: media.description || place.location,
          url: `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=14/${place.lat}/${place.lon}`,
        });
      } catch {}
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
      >
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-strong rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        >
          {/* Header Image */}
          <div className="relative h-48 overflow-hidden rounded-t-3xl">
            {loading ? (
              <div className="w-full h-full bg-white/5 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white/30 animate-spin" />
              </div>
            ) : media.image ? (
              <img src={media.image} alt={place.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500/20 via-teal-500/15 to-purple-500/20 flex items-center justify-center">
                <span className="text-5xl opacity-50">{place.categoryIcon}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* Title & Category */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-full bg-white/5 text-white/70 text-xs font-medium border border-white/10">
                  {place.categoryIcon} {place.category}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white font-heading">{place.name}</h2>
              {place.location && (
                <p className="text-white/50 text-sm mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {place.location}
                </p>
              )}
            </div>

            {/* Description */}
            {loading ? (
              <div className="space-y-2">
                <div className="h-3 w-full bg-white/5 rounded animate-pulse" />
                <div className="h-3 w-4/5 bg-white/5 rounded animate-pulse" />
                <div className="h-3 w-3/5 bg-white/5 rounded animate-pulse" />
              </div>
            ) : media.description ? (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-teal-400" />
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">About</p>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{media.description}</p>
              </div>
            ) : null}

            {/* Mini Map */}
            <div>
              <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Location</p>
              <div className="h-44 rounded-2xl overflow-hidden">
                <MapContainer
                  center={[place.lat, place.lon]}
                  zoom={13}
                  className="h-full w-full"
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; OpenStreetMap &copy; CARTO'
                  />
                  <Marker position={[place.lat, place.lon]}>
                    <Popup>{place.name}</Popup>
                  </Marker>
                </MapContainer>
              </div>
              <p className="text-white/30 text-xs mt-1 text-center">
                {place.lat.toFixed(4)}°, {place.lon.toFixed(4)}°
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving || saved}
                className={`flex-1 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  saved
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                }`}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : saved ? (
                  <>
                    <Bookmark className="w-4 h-4 fill-emerald-400" /> Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" /> Add to Travel Map
                  </>
                )}
              </button>
              <button
                onClick={handleShare}
                className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center"
              >
                <Share2 className="w-4 h-4 text-white/60" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}