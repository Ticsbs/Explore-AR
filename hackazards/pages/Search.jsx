import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { useCurrency } from "@/lib/CurrencyContext";
import { CURRENCIES } from "@/lib/currency";
import PlacesSearchBar from "@/components/search/PlacesSearchBar";
import PlaceResultCard from "@/components/search/PlaceResultCard";
import PlaceDetailSheet from "@/components/search/PlaceDetailSheet";
import { searchPlaces, parsePlace, fetchPlacesMedia } from "@/lib/placeSearch";

export default function SearchPage() {
  const { currency, rates, changeCurrency } = useCurrency();
  const [results, setResults] = useState([]);
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const currentCurrency = CURRENCIES.find((c) => c.code === currency);

  const handleSearch = useCallback(async (query) => {
    if (!query?.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLastQuery(query);
    setHasSearched(true);
    setLoading(true);
    setError(null);
    setImages({});

    try {
      const rawResults = await searchPlaces(query);
      const parsed = rawResults.map(parsePlace);
      setResults(parsed);

      // Fetch images for the first 8 results from Wikipedia
      fetchPlacesMedia(parsed).then((mediaResults) => {
        const imgMap = {};
        mediaResults.forEach((m) => {
          if (m.image) imgMap[m.place.id] = m.image;
        });
        setImages(imgMap);
      });
    } catch (err) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectPlace = useCallback((place) => {
    setSelectedPlace(place);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1220] pb-28">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-white font-heading">Search</h1>
        <p className="text-white/40 text-sm mt-1">Find any place in the world</p>
      </div>

      {/* Search Bar */}
      <div className="px-4">
        <PlacesSearchBar onSearch={handleSearch} onSelect={handleSelectPlace} />
      </div>

      {/* Currency / Region Selector */}
      <div className="px-4 mt-3 relative">
        <button
          onClick={() => setCurrencyOpen(!currencyOpen)}
          className="glass-card rounded-xl px-3 py-2 flex items-center gap-2 text-sm"
        >
          <span className="text-lg">{currentCurrency?.flag || "🌍"}</span>
          <span className="text-white/80 font-medium">{currency}</span>
          <span className="text-white/30 text-xs">{currentCurrency?.name}</span>
        </button>

        <AnimatePresence>
          {currencyOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setCurrencyOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-1 left-4 glass-strong rounded-2xl py-2 z-50 max-h-64 overflow-y-auto w-48"
              >
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      changeCurrency(c.code);
                      setCurrencyOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors text-left ${
                      c.code === currency ? "bg-white/5" : ""
                    }`}
                  >
                    <span className="text-lg">{c.flag}</span>
                    <div className="flex-1">
                      <p className="text-white/80 text-sm font-medium">{c.code}</p>
                      <p className="text-white/30 text-xs">{c.name}</p>
                    </div>
                    {c.code === currency && <span className="text-teal-400 text-xs">✓</span>}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      <div className="px-4 mt-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="glass-card rounded-2xl overflow-hidden">
                    <div className="h-32 bg-white/5 animate-pulse" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 w-3/4 bg-white/5 rounded animate-pulse" />
                      <div className="h-2 w-1/2 bg-white/5 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-400/50 mx-auto mb-3" />
                <p className="text-white font-semibold">Search failed</p>
                <p className="text-white/40 text-sm mt-1">{error}</p>
                <button
                  onClick={() => handleSearch(lastQuery)}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm font-semibold"
                >
                  Retry
                </button>
              </div>
            </motion.div>
          ) : hasSearched && results.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center py-12">
                <SearchIcon className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-white font-semibold">No results found</p>
                <p className="text-white/40 text-sm mt-1">Try a different search term</p>
              </div>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-white/60 text-sm font-semibold mb-3">
                {results.length} {results.length === 1 ? "result" : "results"} found
              </p>
              <div className="grid grid-cols-2 gap-4">
                {results.map((place, i) => (
                  <PlaceResultCard
                    key={place.id}
                    place={place}
                    image={images[place.id]}
                    index={i}
                    onClick={() => handleSelectPlace(place)}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="initial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-blue-400/50" />
                </div>
                <p className="text-white/60 font-semibold">Search any place worldwide</p>
                <p className="text-white/30 text-sm mt-1">Cities, monuments, landmarks, restaurants & more</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail Sheet */}
      <PlaceDetailSheet place={selectedPlace} onClose={() => setSelectedPlace(null)} />
    </div>
  );
}