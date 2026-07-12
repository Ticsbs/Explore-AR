import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { detectUserCurrency, fetchExchangeRates } from "@/lib/currency";

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState("USD");
  const [rates, setRates] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("explorear_currency");
    const initial = saved || detectUserCurrency();
    setCurrency(initial);
    fetchExchangeRates().then(setRates);
  }, []);

  const changeCurrency = useCallback((code) => {
    setCurrency(code);
    localStorage.setItem("explorear_currency", code);
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, rates, changeCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}