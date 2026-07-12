import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Globe } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function SettingsLanguage() {
  const { t, language, changeLanguage, languages } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B1220] pb-28">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/profile")} className="w-10 h-10 rounded-full glass flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white font-heading">{t("page.language")}</h1>
          <p className="text-white/40 text-sm">{t("lang.select")}</p>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-2">
        {languages.map((lang, i) => (
          <motion.button
            key={lang.code}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => changeLanguage(lang.code)}
            className={`w-full glass-card rounded-2xl p-4 flex items-center gap-4 transition-all ${
              language === lang.code ? "border-teal-500/40" : ""
            }`}
          >
            <span className="text-3xl">{lang.flag}</span>
            <div className="flex-1 text-left">
              <p className="text-white text-sm font-semibold">{lang.nativeName}</p>
              <p className="text-white/40 text-xs">{lang.name}</p>
            </div>
            {language === lang.code && (
              <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-teal-400" />
              </div>
            )}
          </motion.button>
        ))}
      </div>

      <div className="px-4 mt-6">
        <div className="glass-card rounded-2xl p-4 flex items-start gap-3">
          <Globe className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-white/40 text-xs leading-relaxed">{t("lang.note")}</p>
        </div>
      </div>
    </div>
  );
}