import React from "react";

export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between px-4 mb-4">
      <div>
        <h2 className="text-xl font-bold text-white font-heading">{title}</h2>
        {subtitle && <p className="text-white/40 text-sm mt-0.5">{subtitle}</p>}
      </div>
      {action && (
        <button className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
          {action}
        </button>
      )}
    </div>
  );
}