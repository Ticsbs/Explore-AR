import { useState, useEffect, useCallback, useRef } from "react";

export function useGeolocation() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    location: null,
  });
  const lastUpdate = useRef(0);
  const watchIdRef = useRef(null);

  // BigDataCloud free reverse geocoding — no API key, no rate limit issues,
  // reliably returns countryCode
  const reverseGeocode = useCallback(async (latitude, longitude) => {
    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      if (!res.ok) throw new Error("Geocoding failed");
      const data = await res.json();
      const city =
        data.city || data.locality || data.principalSubdivision || "Current Location";
      const country = data.countryName || "";
      const countryCode = (data.countryCode || "").toUpperCase();
      return { lat: latitude, lng: longitude, city, country, countryCode };
    } catch {
      // Fallback to Nominatim if BigDataCloud fails
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10&accept-language=en`
        );
        if (!res.ok) throw new Error("Geocoding failed");
        const data = await res.json();
        const addr = data.address || {};
        const city =
          addr.city || addr.town || addr.village || addr.municipality || addr.county || "Current Location";
        const country = addr.country || "";
        const countryCode = (addr.country_code || "").toUpperCase();
        return { lat: latitude, lng: longitude, city, country, countryCode };
      } catch {
        return { lat: latitude, lng: longitude, city: "Current Location", country: "", countryCode: "" };
      }
    }
  }, []);

  const processPosition = useCallback(
    async (position) => {
      const now = Date.now();
      if (now - lastUpdate.current < 120000) return;
      lastUpdate.current = now;

      const { latitude, longitude } = position.coords;
      const loc = await reverseGeocode(latitude, longitude);
      setState({ loading: false, error: null, location: loc });
    },
    [reverseGeocode]
  );

  const startWatch = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ loading: false, error: { type: "unsupported" }, location: null });
      return;
    }

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        lastUpdate.current = 0;
        await processPosition(position);
      },
      (err) => {
        setState({
          loading: false,
          error: { type: err.code === 1 ? "denied" : "error", message: err.message },
          location: null,
        });
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 0 }
    );

    watchIdRef.current = navigator.geolocation.watchPosition(
      processPosition,
      () => {},
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 300000 }
    );
  }, [processPosition]);

  useEffect(() => {
    startWatch();
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [startWatch]);

  const refresh = useCallback(() => {
    lastUpdate.current = 0;
    startWatch();
  }, [startWatch]);

  return { ...state, refresh };
}