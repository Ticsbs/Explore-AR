import React, { useState, useRef, useEffect } from "react";
import { Search, X, Clock, TrendingUp, MapPin, Sparkles, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SUGGESTIONS, DESTINATIONS } from "@/lib/destinations";
import { getSearchHistory, getTrendingSearches, addToSearchHistory } from "@/lib/searchCache";

const categoryIcons = {
  "Tower": "🗼", "Temple": "⛩️", "Castle": "🏰", "Beach": "🏖️", "Mountain": "⛰️",
  "Museum": "🏛️", "Palace": "🏯", "Park": "🌳", "Cathedral": "⛪", "Mosque": "🕌",
  "Falls": "💦", "Island": "🏝️", "Desert": "🏜️", "City": "🏙️", "Country": "🌍",
};

function getIconForSuggestion(s) {
  const lower = s.toLowerCase();
  for (const [keyword, emoji] of Object.entries(categoryIcons)) {
    if (lower.includes(keyword.toLowerCase())) return emoji;
  }
  // Check if it's a country (matches DESTINATIONS country)
  const isCountry = DESTINATIONS.some(d => d.country.toLowerCase() === lower);
  if (isCountry) return "🌍";
  const isCity = DESTINATIONS.some(d => d.name.toLowerCase() === lower);
  if (isCity) return "🏙️";
  return "📍";
}

function highlightMatch(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-teal-400 font-semibold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function SearchBar({ value, onChange, onSearch, onFocus }) {
  const [focused, setFocused] = useState(false);
  const [listening, setListening] = useState(false);
  const inputRef = useRef(null);

  const suggestions = value.length >= 2
    ? SUGGESTIONS.filter(s => s.toLowerCase().includes(value.toLowerCase())).slice(0, 8)
    : [];

  const history = getSearchHistory();
  const trending = getTrendingSearches();
  const popular = DESTINATIONS.slice(0, 4);

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    setListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      onChange(transcript);
      setListening(false);
      onSearch(transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const handleSelect = (s) => {
    onChange(s);
    addToSearchHistory(s);
    onSearch(s);
    setFocused(false);
  };

  return (
    <div className="relative">
      <div className={`glass-card rounded-2xl flex items-center gap-3 px-4 py-3 transition-all ${focused ? "border-teal-500/30" : ""}`}>
        <Search className="w-4 h-4 text-white/40 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => { setFocused(true); onFocus?.(); }}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value) {
              addToSearchHistory(value);
              onSearch(value);
              setFocused(false);
            }
          }}
          placeholder="Search places, monuments, cities..."
          className="bg-transparent text-white text-sm outline-none w-full placeholder:text-white/30"
        />
        {value ? (
          <button onClick={() => { onChange(""); onSearch(""); }} className="flex-shrink-0">
            <X className="w-4 h-4 text-white/40" />
          </button>
        ) : (
          <button
            onClick={startVoiceSearch}
            className={`flex-shrink-0 ${listening ? "text-red-400 animate-pulse" : "text-white/40 hover:text-teal-400"}`}
          >
            <Mic className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 right-0 glass-strong rounded-2xl py-2 z-50 max-h-[70vh] overflow-y-auto"
          >
            {suggestions.length > 0 ? (
              suggestions.map(s => (
                <button
                  key={s}
                  onMouseDown={() => handleSelect(s)}
                  className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                >
                  <span className="text-base">{getIconForSuggestion(s)}</span>
                  <span className="text-white/70 text-sm flex-1">{highlightMatch(s, value)}</span>
                </button>
              ))
            ) : value.length < 2 ? (
              <>
                {history.length > 0 && (
                  <div className="px-4 py-1">
                    <p className="text-white/30 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Recent
                    </p>
                  </div>
                )}
                {history.slice(0, 4).map(h => (
                  <button
                    key={h.query}
                    onMouseDown={() => handleSelect(h.query)}
                    className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                  >
                    <Clock className="w-3.5 h-3.5 text-white/30" />
                    <span className="text-white/60 text-sm flex-1">{h.query}</span>
                    <X className="w-3 h-3 text-white/20" onClick={(e) => { e.stopPropagation(); }} />
                  </button>
                ))}

                <div className="px-4 py-1 mt-1">
                  <p className="text-white/30 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Trending
                  </p>
                </div>
                <div className="px-4 pb-2 flex flex-wrap gap-2">
                  {trending.map(t => (
                    <button
                      key={t}
                      onMouseDown={() => handleSelect(t)}
                      className="px-3 py-1.5 rounded-full bg-white/5 text-white/60 text-xs hover:bg-white/10"
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="px-4 py-1">
                  <p className="text-white/30 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Popular Destinations
                  </p>
                </div>
                {popular.map(d => (
                  <button
                    key={d.id}
                    onMouseDown={() => handleSelect(d.name)}
                    className="w-full px-4 py-2 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                  >
                    <img src={d.image} alt={d.name} className="w-10 h-10 rounded-lg object-cover" loading="lazy" />
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{d.name}</p>
                      <p className="text-white/30 text-xs">{d.country}</p>
                    </div>
                    <MapPin className="w-3 h-3 text-white/20" />
                  </button>
                ))}
              </>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}