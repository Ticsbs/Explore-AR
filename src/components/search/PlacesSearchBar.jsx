import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, Mic, Loader2, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchPlaces, parsePlace } from "@/lib/placeSearch";

export default function PlacesSearchBar({ onSearch, onSelect }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [listening, setListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  // Debounced live autocomplete from Nominatim (1.2s to respect rate limits)
  const fetchSuggestions = useCallback(async (query) => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    if (abortRef.current) abortRef.current.abort();

    try {
      const results = await searchPlaces(query);
      const parsed = results.slice(0, 6).map(parsePlace);
      setSuggestions(parsed);
    } catch {
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  const onChange = (val) => {
    setValue(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 1200);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    setListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setValue(transcript);
      setListening(false);
      onSearch(transcript);
      setFocused(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const handleSelect = (place) => {
    setValue(place.name);
    onSelect?.(place);
    setFocused(false);
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (value.trim()) {
      onSearch(value);
      setFocused(false);
      setSuggestions([]);
    }
  };

  const clearInput = () => {
    setValue("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className={`glass-card rounded-2xl flex items-center gap-3 px-4 py-3 transition-all ${focused ? "border-teal-500/40" : ""}`}>
          <Search className="w-4 h-4 text-white/40 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search places, monuments, cities..."
            className="bg-transparent text-white text-sm outline-none w-full placeholder:text-white/30"
          />
          {loadingSuggestions && <Loader2 className="w-4 h-4 text-teal-400 animate-spin flex-shrink-0" />}
          {value ? (
            <button type="button" onClick={clearInput} className="flex-shrink-0">
              <X className="w-4 h-4 text-white/40" />
            </button>
          ) : (
            <button
              type="button"
              onClick={startVoiceSearch}
              className={`flex-shrink-0 ${listening ? "text-red-400 animate-pulse" : "text-white/40 hover:text-teal-400"}`}
            >
              <Mic className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {focused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 right-0 glass-strong rounded-2xl py-2 z-50 max-h-[50vh] overflow-y-auto"
          >
            {suggestions.map((s) => (
              <button
                key={s.id}
                onMouseDown={() => handleSelect(s)}
                className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
              >
                <span className="text-base flex-shrink-0">{s.categoryIcon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-sm font-medium truncate">{s.name}</p>
                  <p className="text-white/40 text-xs truncate">{s.location}</p>
                </div>
                <MapPin className="w-3 h-3 text-white/20 flex-shrink-0" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}