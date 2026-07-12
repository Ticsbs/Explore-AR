import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations, LANGUAGES } from "./translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("explorear_language");
    if (saved && translations[saved]) setLanguage(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("explorear_language", language);
    const root = document.documentElement;
    root.setAttribute("lang", language);
    root.setAttribute("dir", language === "ar" || language === "he" ? "rtl" : "ltr");
  }, [language]);

  const t = useCallback(
    (key) => {
      const lang = translations[language] || translations.en;
      return lang[key] || translations.en[key] || key;
    },
    [language]
  );

  const changeLanguage = useCallback((lang) => {
    if (translations[lang]) setLanguage(lang);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}