"use client";
import { useEffect, useState } from "react";
import { nowParts } from "@/lib/format";

/** Colombo date/time, null until mounted so server and client markup match. */
export function useNow() {
  const [now, setNow] = useState<{ date: string; time: string } | null>(null);
  useEffect(() => {
    setNow(nowParts());
    const id = setInterval(() => setNow(nowParts()), 60_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/** Dates to offer: published dates, minus any already behind us. */
export function useDates(all: string[], now: { date: string } | null) {
  const dates = now ? all.filter((d) => d >= now.date) : all;
  return dates;
}
