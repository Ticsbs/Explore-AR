import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import { X, Loader2, MapPin, Navigation, Clock, AlertCircle } from "lucide-react";
import { fetchNearbyPlaces, fetchRoute } from "@/lib/nearbySearch";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const categoryConfig = {
  food: { label: "Nearby Food", icon: "🍽️", color: "from-orange-500/20 to-red-500/20", accent: "text-orange-400" },
  medical: { label: "Medical Facilities", icon: "🏥", color: "from-red-500/20 to-pink-500/20", accent: "text-red-400" },
  hotels: { label: "Hotels & Stays", icon: "🏨", color: "from-blue-500/20 to-teal-500/20", accent: "text-blue-400" },
};

const userIcon = L.divIcon({
  html: '<div style="width:16px;height:16px;background:#3B82F6;border:3px solid white;border-radius:50%;box-shadow:0 0 10px rgba(59,130,246,0.6)"></div>',
  className: "",
  iconSize: [16, 16],
});

const destIcon = L.divIcon({
  html: '<div style="width:24px;height:24px;background:#F97316;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>',
  className: "",
  iconSize: [24, 24],
});

function FitBounds({ userLoc, destLoc, routeCoords }) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds([
      [userLoc.lat, userLoc.lng],
      [destLoc.lat, destLoc.lon],
    ]);
    if (routeCoords.length > 0) {
      routeCoords.forEach(([lat, lon]) => bounds.extend([lat, lon]));
    }
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [userLoc, destLoc, routeCoords, map]);
  return null;
}

export default function NearbyResultsSheet({ category, location, onClose }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [route, setRoute] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState(null);

  useEffect(() => {
    if (!location) return;
    setLoading(true);
    setError(null);
    setSelectedPlace(null);
    fetchNearbyPlaces(location.lat, location.lng, category)
      .then((results) => {
        setPlaces(results);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [category, location]);

  useEffect(() => {
    if (!selectedPlace || !location) return;
    setRouteLoading(true);
    setRouteError(null);
    setRoute(null);
    fetchRoute(location.lat, location.lng, selectedPlace.lat, selectedPlace.lon)
      .then((r) => {
        setRoute(r);
        setRouteLoading(false);
      })
      .catch((err) => {
        setRouteError(err.message);
        setRouteLoading(false);
      });
  }, [selectedPlace, location]);

  const config = categoryConfig[category];
  const routeCoords = route?.geometry?.coordinates?.map(([lon, lat]) => [lat, lon]) || [];

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 z-[300] bg-[#0B1220] rounded-t-3xl border-t border-white/10 max-h-[85vh] flex flex-col"
    >
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-10 h-1 rounded-full bg-white/20" />
      </div>

      <div className="px-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <h3 className="text-white font-bold font-heading">{config.label}</h3>
            <p className="text-white/40 text-xs flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {location?.city || "Your location"}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full glass flex items-center justify-center">
          <X className="w-4 h-4 text-white/60" />
        </button>
      </div>

      <div className="overflow-y-auto flex-1 px-4 pb-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-3" />
            <p className="text-white/40 text-sm">Finding nearby places...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-10 h-10 text-red-400/50 mx-auto mb-3" />
            <p className="text-white/60 text-sm font-semibold">Couldn't load results</p>
            <p className="text-white/30 text-xs mt-1">{error}</p>
          </div>
        ) : places.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/40 text-sm">No places found within 3km</p>
            <p className="text-white/20 text-xs mt-1">Try a different category</p>
          </div>
        ) : !selectedPlace ? (
          <div className="space-y-2">
            {places.map((place, i) => (
              <motion.button
                key={place.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedPlace(place)}
                className="w-full glass-card rounded-2xl p-4 flex items-center gap-3 text-left"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-lg">{config.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{place.name}</p>
                  <p className="text-white/40 text-xs">{place.type}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white/60 text-xs font-semibold">{place.distance}</p>
                  <p className={`text-[10px] ${config.accent}`}>away</p>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => { setSelectedPlace(null); setRoute(null); }}
              className="flex items-center gap-2 text-white/60 text-sm"
            >
              <Navigation className="w-4 h-4 rotate-180" /> Back to list
            </button>

            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-xl">{config.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{selectedPlace.name}</p>
                  <p className="text-white/40 text-xs">{selectedPlace.type} · {selectedPlace.distance}</p>
                </div>
              </div>
            </div>

            {routeLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
              </div>
            ) : route ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card rounded-2xl p-4 text-center">
                  <Navigation className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <p className="text-white/30 text-[10px] uppercase tracking-wider">Distance</p>
                  <p className="text-white text-lg font-bold mt-0.5">{route.distance}</p>
                </div>
                <div className="glass-card rounded-2xl p-4 text-center">
                  <Clock className="w-5 h-5 text-teal-400 mx-auto mb-1" />
                  <p className="text-white/30 text-[10px] uppercase tracking-wider">Walk Time</p>
                  <p className="text-white text-lg font-bold mt-0.5">{route.duration}</p>
                </div>
              </div>
            ) : routeError ? (
              <div className="glass-card rounded-2xl p-4 text-center">
                <AlertCircle className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                <p className="text-white/40 text-xs">Couldn't calculate route</p>
              </div>
            ) : null}

            {selectedPlace && (
              <div className="glass-card rounded-2xl overflow-hidden h-64">
                <MapContainer
                  center={[selectedPlace.lat, selectedPlace.lon]}
                  zoom={14}
                  className="w-full h-full"
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; OpenStreetMap & CartoDB'
                  />
                  <FitBounds
                    userLoc={location}
                    destLoc={selectedPlace}
                    routeCoords={routeCoords}
                  />
                  <Marker position={[location.lat, location.lng]} icon={userIcon} />
                  <Marker position={[selectedPlace.lat, selectedPlace.lon]} icon={destIcon} />
                  {routeCoords.length > 0 && (
                    <Polyline positions={routeCoords} pathOptions={{ color: "#3B82F6", weight: 4, opacity: 0.8 }} />
                  )}
                </MapContainer>
              </div>
            )}

            <a
              href={`https://www.openstreetmap.org/directions?from=${location.lat}%2C${location.lng}&to=${selectedPlace.lat}%2C${selectedPlace.lon}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" /> Open in Maps
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}