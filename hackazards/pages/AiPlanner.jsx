import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, MapPin, Wallet, Calendar, Users, Heart, Accessibility,
  ChevronRight, ChevronLeft, Loader2, Sun, Moon as MoonIcon, Sunset,
  Clock, DollarSign, Utensils, Bus, CloudSun, CheckSquare, Shield, Eye
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useCurrency } from "@/lib/CurrencyContext";
import { formatCurrency, parsePriceToUSD } from "@/lib/currency";
import CurrencySelector from "@/components/common/CurrencySelector";
import BudgetBreakdown from "@/components/common/BudgetBreakdown";

const STEPS = ["Destination", "Details", "Style", "Generate"];

const travelStyles = [
  { id: "solo", label: "Solo", emoji: "🧑" },
  { id: "friends", label: "Friends", emoji: "👫" },
  { id: "family", label: "Family", emoji: "👨‍👩‍👧‍👦" },
  { id: "couple", label: "Couple", emoji: "💑" },
  { id: "business", label: "Business", emoji: "💼" },
];

const interests = [
  { id: "history", label: "History", emoji: "🏛️" },
  { id: "nature", label: "Nature", emoji: "🌿" },
  { id: "adventure", label: "Adventure", emoji: "⛰️" },
  { id: "photography", label: "Photography", emoji: "📸" },
  { id: "food", label: "Food", emoji: "🍜" },
  { id: "shopping", label: "Shopping", emoji: "🛍️" },
  { id: "culture", label: "Culture", emoji: "🎭" },
];

const accessibilityOptions = [
  { id: "wheelchair", label: "Wheelchair", icon: Accessibility },
  { id: "visual", label: "Visually Impaired", icon: Eye },
  { id: "hearing", label: "Hearing Impaired", icon: Eye },
];

export default function AiPlanner() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const { currency, rates, changeCurrency } = useCurrency();
  const [form, setForm] = useState({
    destination: "",
    budget: 1500,
    days: 3,
    style: "",
    interests: [],
    accessibility: [],
  });

  const toggleArrayItem = (key, item) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(item) ? prev[key].filter((i) => i !== item) : [...prev[key], item],
    }));
  };

  const generateItinerary = async () => {
    setLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Create a detailed ${form.days}-day travel itinerary for ${form.destination}. 
Budget: $${form.budget}. Travel style: ${form.style || "flexible"}. 
Interests: ${form.interests.join(", ") || "general"}. 
Accessibility needs: ${form.accessibility.join(", ") || "none"}.

For each day, provide morning, afternoon, and evening activities with:
- Activity name and description
- Estimated cost
- Duration
- A restaurant recommendation for each meal

Also include: packing checklist (5 items), safety tips (3), transport tips, weather advisory.

Return as JSON with this structure:
{
  "days": [{"day": 1, "morning": {"activity": "", "description": "", "cost": "", "duration": ""}, "afternoon": {"activity": "", "description": "", "cost": "", "duration": ""}, "evening": {"activity": "", "description": "", "cost": "", "duration": ""}, "restaurant": {"name": "", "cuisine": "", "price_range": ""}}],
  "packing": ["item1"],
  "safety_tips": ["tip1"],
  "transport": "info",
  "weather": "info",
  "total_estimated_cost": "$X"
}`,
        response_json_schema: {
          type: "object",
          properties: {
            days: { type: "array", items: { type: "object" } },
            packing: { type: "array", items: { type: "string" } },
            safety_tips: { type: "array", items: { type: "string" } },
            transport: { type: "string" },
            weather: { type: "string" },
            total_estimated_cost: { type: "string" },
          },
        },
      });
      setItinerary(res);
      setStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveTrip = async () => {
    await base44.entities.Trip.create({
      destination: form.destination,
      budget: form.budget,
      days: form.days,
      travel_style: form.style,
      interests: form.interests,
      accessibility: form.accessibility,
      itinerary: JSON.stringify(itinerary),
      status: "planned",
      saved: true,
    });
  };

  if (itinerary && step === 3) {
    return (
      <div className="min-h-screen bg-[#08111F] pb-28">
        <div className="px-5 pt-6 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white font-heading">{form.destination}</h1>
            <p className="text-white/40 text-sm">{form.days} days · {form.style} · {formatCurrency(parsePriceToUSD(itinerary.total_estimated_cost), currency, rates)}</p>
          </div>
          <div className="flex items-center gap-2">
            <CurrencySelector selectedCurrency={currency} onCurrencyChange={changeCurrency} rates={rates} />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={saveTrip}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm font-semibold"
            >
              Save
            </motion.button>
          </div>
        </div>

        {/* Budget Breakdown */}
        <div className="px-4 mb-6">
          <BudgetBreakdown
            totalBudget={form.budget}
            currencySymbol={currency === "JPY" ? "¥" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "INR" ? "₹" : "$"}
            rates={rates}
            currency={currency}
          />
        </div>

        {/* Weather & Transport */}
        <div className="grid grid-cols-2 gap-3 px-4 mb-6">
          <div className="glass-card rounded-2xl p-4">
            <CloudSun className="w-5 h-5 text-yellow-400 mb-2" />
            <p className="text-white/40 text-xs">Weather</p>
            <p className="text-white text-sm mt-1">{itinerary.weather}</p>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <Bus className="w-5 h-5 text-blue-400 mb-2" />
            <p className="text-white/40 text-xs">Transport</p>
            <p className="text-white text-sm mt-1">{itinerary.transport}</p>
          </div>
        </div>

        {/* Days */}
        {itinerary.days?.map((day, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="mx-4 mb-4 glass-card rounded-3xl p-5"
          >
            <h3 className="text-lg font-bold text-white font-heading mb-4">Day {day.day || i + 1}</h3>
            
            {[
              { label: "Morning", icon: Sun, data: day.morning, color: "text-yellow-400" },
              { label: "Afternoon", icon: Sunset, data: day.afternoon, color: "text-orange-400" },
              { label: "Evening", icon: MoonIcon, data: day.evening, color: "text-indigo-400" },
            ].map(({ label, icon: Icon, data, color }) => (
              <div key={label} className="mb-4 last:mb-0">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">{label}</span>
                </div>
                <div className="ml-6 bg-white/[0.03] rounded-2xl p-3">
                  <p className="text-white font-medium text-sm">{data?.activity}</p>
                  <p className="text-white/40 text-xs mt-1">{data?.description}</p>
                  <div className="flex gap-3 mt-2 text-xs text-white/30">
                    {data?.cost && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{data.cost}</span>}
                    {data?.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{data.duration}</span>}
                  </div>
                </div>
              </div>
            ))}

            {day.restaurant && (
              <div className="mt-3 ml-6 bg-white/[0.03] rounded-2xl p-3 border border-orange-500/10">
                <div className="flex items-center gap-2 mb-1">
                  <Utensils className="w-3 h-3 text-orange-400" />
                  <span className="text-orange-400 text-xs font-semibold">Restaurant</span>
                </div>
                <p className="text-white text-sm font-medium">{day.restaurant.name}</p>
                <p className="text-white/40 text-xs">{day.restaurant.cuisine} · {day.restaurant.price_range}</p>
              </div>
            )}
          </motion.div>
        ))}

        {/* Packing & Safety */}
        <div className="grid grid-cols-2 gap-3 px-4 mt-2">
          <div className="glass-card rounded-2xl p-4">
            <CheckSquare className="w-5 h-5 text-teal-400 mb-2" />
            <p className="text-white font-semibold text-sm mb-2">Packing List</p>
            {itinerary.packing?.map((item, i) => (
              <p key={i} className="text-white/50 text-xs mb-1">• {item}</p>
            ))}
          </div>
          <div className="glass-card rounded-2xl p-4">
            <Shield className="w-5 h-5 text-red-400 mb-2" />
            <p className="text-white font-semibold text-sm mb-2">Safety Tips</p>
            {itinerary.safety_tips?.map((tip, i) => (
              <p key={i} className="text-white/50 text-xs mb-1">• {tip}</p>
            ))}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { setItinerary(null); setStep(0); }}
          className="mx-4 mt-6 w-[calc(100%-2rem)] py-3 rounded-2xl glass-card text-white/60 text-sm font-medium text-center"
        >
          Plan Another Trip
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08111F] pb-28">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h1 className="text-2xl font-bold text-white font-heading">AI Trip Planner</h1>
        </div>
        <p className="text-white/40 text-sm mt-1">Let AI craft your perfect itinerary</p>
      </div>

      {/* Steps */}
      <div className="flex gap-2 px-5 mb-6">
        {STEPS.slice(0, 3).map((s, i) => (
          <div key={s} className="flex-1 flex flex-col items-center gap-1">
            <div className={`h-1 w-full rounded-full transition-all ${i <= step ? "bg-gradient-to-r from-blue-500 to-teal-500" : "bg-white/10"}`} />
            <span className={`text-xs ${i <= step ? "text-white/70" : "text-white/20"}`}>{s}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Destination */}
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="px-5">
            <div className="glass-card rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Where to?</p>
                  <p className="text-white/40 text-xs">Enter your dream destination</p>
                </div>
              </div>
              <input
                type="text"
                placeholder="e.g., Paris, Kyoto, Bali..."
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                className="w-full bg-white/[0.04] rounded-2xl px-4 py-3.5 text-white text-sm outline-none border border-white/5 focus:border-blue-500/40 transition-colors placeholder:text-white/20"
              />
              <div className="flex flex-wrap gap-2 mt-4">
                {["Paris", "Kyoto", "Bali", "Santorini", "Jaipur"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setForm({ ...form, destination: d })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${form.destination === d ? "bg-blue-500/30 text-blue-300 border border-blue-500/30" : "bg-white/5 text-white/40 hover:text-white/60"}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 1: Budget & Days */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="px-5 space-y-4">
            <div className="glass-card rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Budget</p>
                  <p className="text-white/40 text-xs">How much would you like to spend?</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-white font-heading mb-3">{formatCurrency(form.budget, currency, rates)}</p>
              <input
                type="range" min={200} max={10000} step={100}
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: parseInt(e.target.value) })}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>$200</span><span>$10,000</span>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Duration</p>
                  <p className="text-white/40 text-xs">How many days?</p>
                </div>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 5, 7, 14].map((d) => (
                  <button
                    key={d}
                    onClick={() => setForm({ ...form, days: d })}
                    className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all ${form.days === d ? "bg-gradient-to-r from-orange-500 to-sunset text-white" : "bg-white/5 text-white/40 hover:text-white/60"}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Style & Interests */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="px-5 space-y-4">
            <div className="glass-card rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Travel Style</p>
                  <p className="text-white/40 text-xs">Who are you traveling with?</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {travelStyles.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setForm({ ...form, style: s.id })}
                    className={`py-3 rounded-2xl text-center transition-all ${form.style === s.id ? "bg-gradient-to-r from-blue-500/30 to-teal-500/30 border border-blue-500/30" : "bg-white/5"}`}
                  >
                    <span className="text-2xl">{s.emoji}</span>
                    <p className={`text-xs mt-1 ${form.style === s.id ? "text-white" : "text-white/40"}`}>{s.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Interests</p>
                  <p className="text-white/40 text-xs">What excites you?</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {interests.map((int) => (
                  <button
                    key={int.id}
                    onClick={() => toggleArrayItem("interests", int.id)}
                    className={`px-3 py-2 rounded-2xl text-sm transition-all flex items-center gap-1.5 ${form.interests.includes(int.id) ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/30 text-white" : "bg-white/5 text-white/40"}`}
                  >
                    <span>{int.emoji}</span> {int.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                  <Accessibility className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Accessibility</p>
                  <p className="text-white/40 text-xs">Any special requirements?</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {accessibilityOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => toggleArrayItem("accessibility", opt.id)}
                    className={`px-3 py-2 rounded-2xl text-sm transition-all ${form.accessibility.includes(opt.id) ? "bg-gradient-to-r from-teal-500/30 to-emerald-500/30 border border-teal-500/30 text-white" : "bg-white/5 text-white/40"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      {step < 3 && (
        <div className="flex gap-3 px-5 mt-6">
          {step > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(step - 1)}
              className="px-5 py-3 rounded-2xl glass-card text-white/60 text-sm font-medium flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (step === 2) generateItinerary();
              else setStep(step + 1);
            }}
            disabled={step === 0 && !form.destination}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm font-semibold flex items-center justify-center gap-2 glow-blue disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
            ) : step === 2 ? (
              <><Sparkles className="w-4 h-4" /> Generate Itinerary</>
            ) : (
              <>Continue <ChevronRight className="w-4 h-4" /></>
            )}
          </motion.button>
        </div>
      )}
    </div>
  );
}