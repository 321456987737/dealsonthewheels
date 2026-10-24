"use client";

import { useEffect, useState } from "react";
import { Car } from "lucide-react";

export default function CarStartup({
  brand = "Your car logo here",
  duration = 1800,
}) {
  const [started, setStarted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setStarted(true);
    });

    const fadeTimer = setTimeout(() => {
      setLeaving(true);
    }, Math.max(0, duration - 300));

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label={`${brand} loading`}
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-[#0b0b0b] text-white transition-opacity duration-300 ${
        leaving
          ? "pointer-events-none opacity-0"
          : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center">
        {/* Car animation */}
        <div
          className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
            started
              ? "translate-x-0 opacity-100"
              : "-translate-x-36 opacity-0"
          }`}
        >
          <Car
            size={76}
            strokeWidth={1.5}
            className="text-white"
          />
        </div>

        {/* Simple accent line */}
        <div
          className={`mt-5 h-px w-20 origin-center bg-lime-400 transition-all duration-500 delay-200 ${
            started
              ? "scale-x-100 opacity-100"
              : "scale-x-0 opacity-0"
          }`}
        />

        {/* Dealership name */}
        <h1
          className={`mt-5 text-center text-sm font-semibold tracking-[0.25em] transition-opacity duration-500 delay-300 ${
            started ? "opacity-100" : "opacity-0"
          }`}
        >
          {brand}
        </h1>
      </div>
    </div>
  );
}