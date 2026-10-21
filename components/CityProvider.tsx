"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { nearestRegion, type Coords } from "@/lib/geo";

const KEY = "fdfs-city";

interface Ctx {
  city: string;
  setCity: (c: string) => void;
  /** Visitor position when known, used to sort theatres by distance. */
  coords: Coords | null;
  /** True when the city was chosen from the visitor's connection rather than by them. */
  detected: boolean;
  locating: boolean;
  /** Ask the browser for precise location (shows the permission prompt). */
  locate: () => void;
  locateError: string;
}

const Context = createContext<Ctx>({ city: "Colombo", setCity: () => {}, coords: null, detected: false, locating: false, locate: () => {}, locateError: "" });
export const useCity = () => useContext(Context);

export default function CityProvider({ children }: { children: React.ReactNode }) {
  const [city, setCityState] = useState("Colombo");
  const [coords, setCoords] = useState<Coords | null>(null);
  const [detected, setDetected] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState("");

  const setCity = useCallback((c: string) => {
    setCityState(c);
    setDetected(false);
    try {
      localStorage.setItem(KEY, c);
    } catch {}
  }, []);

  useEffect(() => {
    // Development only: ?geo=9.66,80.02 pretends the visitor is at that spot (Cloudflare supplies the real one in production).
    const sim = process.env.NODE_ENV !== "production" ? new URLSearchParams(location.search).get("geo") : null;
    const [slat, slng] = sim ? sim.split(",").map(Number) : [NaN, NaN];
    if (Number.isFinite(slat) && Number.isFinite(slng)) {
      const from = { lat: slat, lng: slng };
      const region = nearestRegion(from);
      if (region) {
        setCoords(from);
        setCityState(region);
        setDetected(true);
      }
      return;
    }
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {}
    if (saved !== null) {
      setCityState(saved);
      return;
    }
    // First visit: ask our edge endpoint (Cloudflare geo, no permission prompt) where the visitor is.
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 3000);
    fetch("/api/location", { cache: "no-store", signal: ctl.signal })
      .then((r) => r.json())
      .then((g: { country: string | null; lat: number | null; lng: number | null }) => {
        if (g.country !== "LK" || g.lat === null || g.lng === null) return;
        const from = { lat: g.lat, lng: g.lng };
        const region = nearestRegion(from);
        if (!region) return;
        setCoords(from);
        setCityState(region);
        setDetected(true);
      })
      .catch(() => {})
      .finally(() => clearTimeout(timer));
    return () => ctl.abort();
  }, []);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setLocateError("Your browser can't share location.");
      return;
    }
    setLocating(true);
    setLocateError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const from = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const region = nearestRegion(from);
        setCoords(from);
        setLocating(false);
        if (region) setCity(region);
        else setLocateError("No cinemas we track within 150 km of you.");
      },
      (err) => {
        setLocating(false);
        setLocateError(err.code === err.PERMISSION_DENIED ? "Location permission was denied." : "Couldn't get your location.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  }, [setCity]);

  return <Context.Provider value={{ city, setCity, coords, detected, locating, locate, locateError }}>{children}</Context.Provider>;
}
