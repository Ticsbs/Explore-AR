import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { CURRENCIES, detectUserCurrency, fetchExchangeRates } from "@/lib/currency";

export default function CurrencySelector({ selectedCurrency, onCurrencyChange, rates }) {
  const [open, setOpen] = useState(false);

  const selected = CURRENCIES.find(c => c.code === selectedCurrency) || CURRENCIES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="glass-card rounded-full px-3 py-2 flex items-center gap-2"
      >
        <span className="text-base">{selected.flag}</span>
        <span className="text-white/70 text-xs font-semibold">{selected.code}</span>
        <ChevronDown className={`w-3 h-3 text-white/30 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 right-0 glass-strong rounded-2xl py-2 z-50 min-w-[180px] max-h-[280px] overflow-y-auto"
            >
              {CURRENCIES.map(c => (
                <button
                  key={c.code}
                  onClick={() => { onCurrencyChange(c.code); setOpen(false); }}
                  className={`w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors ${
                    c.code === selectedCurrency ? "bg-white/5" : ""
                  }`}
                >
                  <span className="text-base">{c.flag}</span>
                  <div className="flex-1 text-left">
                    <p className="text-white text-xs font-semibold">{c.code} {c.symbol}</p>
                    <p className="text-white/30 text-[10px]">{c.name}</p>
                  </div>
                  {c.code === selectedCurrency && <Check className="w-3.5 h-3.5 text-teal-400" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}