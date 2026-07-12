import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin, Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import "leaflet/dist/leaflet.css";

const pinIcon = L.divIcon({
  className: "custom-pin",
  html: `<div style="width:18px;height:18px;border-radius:50%;background:#3B82F6;border:2px solid white;box-shadow:0 0 12px #3B82F6;"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export default function MapView() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const data = await base44.entities.SavedPlace.list("-created_date", 50);
      setPlaces(data);
    } catch (err) {
      console.error("Failed to fetch saved places:", err);
    } finally {
      setLoading(false);
    }
  };

  const mappablePlaces = places.filter(
    (p) => typeof p.lat === "number" && typeof p.lng === "number"
  );

  if (!mounted) return null;

  return (
    <div className="relative rounded-3xl overflow-hidden h-[320px] glass-card">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        style={{ height: "100%", width: "100%", background: "#0D1A2D" }}
        scrollWheelZoom={false}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />
        {mappablePlaces.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={pinIcon}
            eventHandlers={{ click: () => setSelected(p) }}
          >
            <Popup>
              <div className="text-xs">
                <p className="font-bold">{p.name}</p>
                {p.country && <p className="text-gray-500">{p.country}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Add destination button */}
      <button
        onClick={() => navigate("/search")}
        className="absolute top-3 right-3 z-[400] w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-lg"
        title="Add a destination"
      >
        <Plus className="w-5 h-5 text-white" />
      </button>

      {/* Empty state overlay */}
      {!loading && mappablePlaces.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0D1A2D]/80 backdrop-blur-sm z-[300]">
          <div className="text-center px-6">
            <MapPin className="w-10 h-10 text-white/20 mx-auto mb-2" />
            <p className="text-white/60 text-sm font-medium">No saved destinations yet</p>
            <p className="text-white/30 text-xs mt-1">Search and add places to see them on your map</p>
            <button
              onClick={() => navigate("/search")}
              className="mt-3 px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 text-xs font-medium flex items-center gap-2 mx-auto"
            >
              <Plus className="w-3 h-3" /> Add a destination
            </button>
          </div>
        </div>
      )}

      {/* Selected destination card */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="absolute bottom-3 left-3 right-3 glass-strong rounded-2xl p-3 flex items-center gap-3 z-[400]"
          >
            {selected.image_url && (
              <img src={selected.image_url} alt={selected.name} className="w-16 h-16 rounded-xl object-cover" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{selected.name}</p>
              {selected.country && (
                <p className="text-white/40 text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {selected.country}
                </p>
              )}
              {selected.description && (
                <p className="text-white/30 text-xs mt-0.5 truncate">{selected.description}</p>
              )}
            </div>
            <button onClick={() => setSelected(null)} className="text-white/30 text-xs">
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}