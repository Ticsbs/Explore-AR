import React, { createContext, useContext } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const geo = useGeolocation();
  return (
    <LocationContext.Provider value={geo}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within LocationProvider");
  return ctx;
}