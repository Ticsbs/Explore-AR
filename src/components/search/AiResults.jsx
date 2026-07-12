import React from "react";
import { motion } from "framer-motion";
import {
  AlertCircle, Sparkles, MapPin, Search as SearchIcon, Share2,
  Bookmark, Utensils, BedDouble, Camera, Shield, Lightbulb, CloudSun, Navigation
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import PlaceDetailCard from "@/components/search/PlaceDetailCard";
import RecommendationCard from "@/components/search/RecommendationCard";
import BudgetBreakdown from "@/components/common/BudgetBreakdown";
import EmptyIllustration from "@/components/common/ImageCarousel";

export function AiResults({ data, query, placeImages, selectedCategories, currency, currencySymbol, rates, saved, onSave, onShare, onSearchAgain }) {
  const filterByCategory = (items) => {
    if (selectedCategories.length === 0) return items;
    return items?.filter(p => selectedCategories.includes(p.category)) || [];
  };

  // Specific place result
  if (data.result_type === "specific_place" && data.place) {
    const place = data.place;
    const budget = place.budget_estimate || 0;

    return (
      <div className="space-y-6">
        <div className="flex justify-end gap-2">
          <button
            onClick={onSave}
            className={`glass-card rounded-full w-10 h-10 flex items-center justify-center ${saved ? "text-teal-400" : "text-white/40"}`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? "fill-teal-400" : ""}`} />
          </button>
          <button
            onClick={onShare}
            className="glass-card rounded-full w-10 h-10 flex items-center justify-center text-white/40"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <PlaceDetailCard place={place} images={placeImages} />

        {place.weather && (
          <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
            <CloudSun className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-white/40 text-xs">Weather</p>
              <p className="text-white text-sm">{place.weather}</p>
            </div>
          </div>
        )}

        {budget > 0 && (
          <BudgetBreakdown totalBudget={budget} currencySymbol={currencySymbol} rates={rates} currency={currency} />
        )}

        {place.location && (
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Navigation className="w-4 h-4 text-blue-400" />
              <span className="text-white/60 text-sm font-semibold">Location</span>
            </div>
            <MiniMap />
            <p className="text-white/40 text-xs mt-2 text-center">{place.location}</p>
          </div>
        )}

        {data.things_to_do?.length > 0 && (
          <InfoSection icon={Camera} title="Things To Do" color="text-purple-400">
            {data.things_to_do.map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-xl p-3">
                <p className="text-white text-sm font-medium">{item.name}</p>
                <p className="text-white/40 text-xs mt-1">{item.description}</p>
              </div>
            ))}
          </InfoSection>
        )}

        {filterByCategory(data.nearby_attractions)?.length > 0 && (
          <InfoSection icon={MapPin} title="Nearby Attractions" color="text-teal-400">
            <div className="space-y-3">
              {filterByCategory(data.nearby_attractions).map((p, i) => (
                <RecommendationCard key={i} place={p} index={i} />
              ))}
            </div>
          </InfoSection>
        )}

        {data.nearby_restaurants?.length > 0 && (
          <InfoSection icon={Utensils} title="Nearby Restaurants" color="text-orange-400">
            {data.nearby_restaurants.map((r, i) => (
              <div key={i} className="flex items-center justify-between bg-white/[0.03] rounded-xl p-3">
                <div>
                  <p className="text-white text-sm font-medium">{r.name}</p>
                  <p className="text-white/40 text-xs">{r.cuisine}</p>
                </div>
                <span className="text-emerald-400 text-xs font-medium">{r.price_range}</span>
              </div>
            ))}
          </InfoSection>
        )}

        {data.nearby_hotels?.length > 0 && (
          <InfoSection icon={BedDouble} title="Nearby Hotels" color="text-blue-400">
            {data.nearby_hotels.map((h, i) => (
              <div key={i} className="flex items-center justify-between bg-white/[0.03] rounded-xl p-3">
                <p className="text-white text-sm font-medium">{h.name}</p>
                <span className="text-emerald-400 text-xs font-medium">{h.price_range}</span>
              </div>
            ))}
          </InfoSection>
        )}

        {data.travel_tips?.length > 0 && (
          <InfoSection icon={Lightbulb} title="Travel Tips" color="text-yellow-400">
            {data.travel_tips.map((tip, i) => (
              <p key={i} className="text-white/50 text-xs flex items-start gap-2 mb-1.5">
                <span className="text-yellow-400">✦</span> {tip}
              </p>
            ))}
          </InfoSection>
        )}

        {data.safety_tips?.length > 0 && (
          <InfoSection icon={Shield} title="Safety Tips" color="text-red-400">
            {data.safety_tips.map((tip, i) => (
              <p key={i} className="text-white/50 text-xs flex items-start gap-2 mb-1.5">
                <span className="text-red-400">⚠</span> {tip}
              </p>
            ))}
          </InfoSection>
        )}
      </div>
    );
  }

  // Location recommendations
  if (data.result_type === "location_recommendations") {
    const places = filterByCategory(data.top_places) || [];
    return (
      <div>
        {placeImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl overflow-hidden h-40 mb-4"
          >
            <img src={placeImages[0]} alt={query} className="w-full h-full object-cover" loading="lazy" />
          </motion.div>
        )}

        <h3 className="text-white/60 text-sm font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" /> Top places in {query}
          {selectedCategories.length > 0 && <span className="text-white/30 text-xs">· {selectedCategories.join(", ")}</span>}
        </h3>

        {places.length > 0 ? (
          <div className="space-y-3">
            {places.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <RecommendationCard place={p} index={i} />
                {p.estimated_budget && (
                  <p className="text-white/30 text-xs mt-1 ml-1">
                    Estimated budget: {formatCurrency(p.estimated_budget, currency, rates)}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyIllustration
            icon={MapPin}
            label={`No ${selectedCategories.join(", ")} places found for "${query}"`}
            className="w-full h-32 rounded-2xl"
          />
        )}
      </div>
    );
  }

  // No results
  if (data.result_type === "no_results") {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-white/10 mx-auto mb-3" />
        <p className="text-white font-semibold">No exact match found</p>
        <p className="text-white/40 text-sm mt-1">We couldn't find "{query}"</p>
        {data.did_you_mean?.length > 0 && (
          <div className="mt-6">
            <p className="text-white/30 text-xs mb-3">Did you mean...?</p>
            <div className="flex flex-col gap-2 max-w-sm mx-auto">
              {data.did_you_mean.map(s => (
                <button
                  key={s}
                  onClick={() => onSearchAgain(s)}
                  className="glass-card rounded-xl px-4 py-3 text-white/70 text-sm font-medium hover:text-white transition-colors flex items-center gap-2"
                >
                  <SearchIcon className="w-3.5 h-3.5 text-white/30" /> {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

export function InfoSection({ icon: Icon, title, color, children }) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${color}`} />
        <h4 className="text-white/60 text-sm font-semibold">{title}</h4>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export function MiniMap() {
  return (
    <div className="h-32 rounded-xl overflow-hidden bg-navy-200 relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <MapPin className="w-8 h-8 text-blue-400/30" />
      </div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22200%22%20height%3D%22100%22%3E%3Cpath%20d%3D%22M0%2C50%20Q50%2C30%20100%2C50%20T200%2C50%22%20stroke%3D%22%233B82F6%22%20stroke-width%3D%221%22%20fill%3D%22none%22%20opacity%3D%220.3%22%2F%3E%3C/svg%3E')] bg-cover bg-center" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" />
          <div className="absolute inset-0 w-4 h-4 rounded-full bg-blue-500 animate-pulse-ring" />
        </div>
      </div>
    </div>
  );
}