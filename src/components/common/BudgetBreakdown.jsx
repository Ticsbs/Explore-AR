import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, TrendingDown, Lightbulb } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#3B82F6", "#14B8A6", "#F97316", "#FBBF24", "#A855F7", "#EC4899"];

export default function BudgetBreakdown({ totalBudget, currencySymbol = "$", rates, currency }) {
  const [expanded, setExpanded] = useState(false);

  // Calculate breakdown percentages
  const breakdown = [
    { name: "Accommodation", percentage: 35, color: COLORS[0] },
    { name: "Transportation", percentage: 20, color: COLORS[1] },
    { name: "Food", percentage: 18, color: COLORS[2] },
    { name: "Entry Tickets", percentage: 12, color: COLORS[3] },
    { name: "Shopping", percentage: 10, color: COLORS[4] },
    { name: "Miscellaneous", percentage: 5, color: COLORS[5] },
  ];

  const formatAmount = (pct) => {
    const amount = (totalBudget * pct / 100);
    return `${currencySymbol}${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const dailyBudget = totalBudget / 7; // assume 7-day trip
  const savingsTips = [
    totalBudget > 2000 ? "Consider off-peak travel to save up to 30%" : "Book accommodations early for better rates",
    "Use public transport instead of taxis to save 40-60%",
    "Visit free attractions on certain days of the week",
  ];

  const chartData = breakdown.map(b => ({ name: b.name, value: b.percentage, color: b.color }));

  return (
    <div className="glass-card rounded-3xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-4 h-4 text-emerald-400" />
        <h3 className="text-white font-semibold text-sm">Budget Breakdown</h3>
      </div>

      {/* Total & Daily */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/[0.03] rounded-xl p-3">
          <p className="text-white/30 text-xs">Total Budget</p>
          <p className="text-white text-lg font-bold font-heading">{currencySymbol}{totalBudget.toLocaleString()}</p>
        </div>
        <div className="bg-white/[0.03] rounded-xl p-3">
          <p className="text-white/30 text-xs">Daily Budget</p>
          <p className="text-white text-lg font-bold font-heading">{currencySymbol}{dailyBudget.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-center gap-4">
        <div className="w-28 h-28 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={50}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-1.5">
          {breakdown.map(b => (
            <div key={b.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: b.color }} />
              <span className="text-white/60 text-xs flex-1">{b.name}</span>
              <span className="text-white/40 text-xs">{formatAmount(b.percentage)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Savings Suggestions */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full mt-4 flex items-center gap-2 text-left"
      >
        <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0" />
        <span className="text-white/70 text-xs font-medium flex-1">Savings Suggestions</span>
        <motion.span animate={{ rotate: expanded ? 180 : 0 }} className="text-white/30 text-xs">
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 pt-3">
              {savingsTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 bg-white/[0.03] rounded-xl p-2.5">
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p className="text-white/50 text-xs">{tip}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}