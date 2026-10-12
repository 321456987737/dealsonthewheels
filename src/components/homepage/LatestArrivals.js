"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

function formatPrice(price, currency) {
  if (typeof price !== "number") {
    return "Price on request";
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currency || "USD"} ${price.toLocaleString("en-US")}`;
  }
}

function getImage(car) {
  return (
    car?.images?.find((image) => image?.url)?.url ||
    "/images/placeholder-car.jpg"
  );
}

function VehicleCard({ car, index }) {
  const title = [car.year, car.make, car.model]
    .filter(Boolean)
    .join(" ");

  const imageAlt =
    car.images?.find((image) => image?.url)?.alt ||
    title ||
    "Vehicle in the showroom";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.05, 0.2),
      }}
      className="group min-w-0"
    >
      <Link
        href={car._id ? `/cars/${car._id}` : "/cars"}
        className="block h-full"
        aria-label={`View ${title}`}
      >
        {/* Vehicle image */}
        <div className="relative aspect-[4/3] overflow-hidden border border-white/10 bg-white/[0.035]">
          <Image
            src={getImage(car)}
            alt={imageAlt}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          />

          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />

          <span className="absolute left-4 top-4 border border-white/20 bg-black/45 px-3 py-2 font-montserrat text-[8px] font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
            {car.condition || "New arrival"}
          </span>

          <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center border border-white/25 bg-black/35 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-white group-hover:text-black">
            <ArrowUpRight size={19} strokeWidth={1.4} />
          </span>
        </div>

        {/* Vehicle details */}
        <div className="border-x border-b border-white/10 p-5 sm:p-6">
          <p className="mb-2 truncate font-montserrat text-[8px] font-medium uppercase tracking-[0.25em] text-white/40 sm:text-[9px]">
            {car.make || "Selected vehicle"}
          </p>

          <h3 className="font-bebas text-3xl leading-[0.95] tracking-[-0.025em] text-white sm:text-4xl">
            {car.model || "Vehicle details"}
          </h3>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-montserrat text-[8px] uppercase tracking-[0.14em] text-white/40">
            {car.year && <span>{car.year}</span>}

            {car.mileage != null && (
              <>
                <span className="h-[3px] w-[3px] rounded-full bg-white/25" />
                <span>
                  {Number(car.mileage).toLocaleString("en-US")}{" "}
                  {car.mileageUnit || "km"}
                </span>
              </>
            )}

            {car.transmission && (
              <>
                <span className="h-[3px] w-[3px] rounded-full bg-white/25" />
                <span>{car.transmission}</span>
              </>
            )}
          </div>

          <div className="mt-6 flex items-end justify-between gap-3 border-t border-white/10 pt-5">
            <span className="font-montserrat text-[8px] uppercase tracking-[0.2em] text-white/35">
              Price
            </span>

            <span className="text-right font-montserrat text-sm font-medium tracking-[0.01em] text-white">
              {formatPrice(car.price, car.currency)}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function VehicleCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden" aria-hidden="true">
      <div className="aspect-[4/3] bg-white/[0.06]" />

      <div className="space-y-4 border-x border-b border-white/10 p-5 sm:p-6">
        <div className="h-2.5 w-24 bg-white/[0.08]" />
        <div className="h-8 w-3/4 bg-white/[0.08]" />
        <div className="h-2.5 w-1/2 bg-white/[0.08]" />
        <div className="h-px w-full bg-white/[0.08]" />

        <div className="flex justify-between gap-4">
          <div className="h-2.5 w-14 bg-white/[0.08]" />
          <div className="h-4 w-24 bg-white/[0.08]" />
        </div>
      </div>
    </div>
  );
}

export default function LatestArrivals() {
  const [cars, setCars] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const fetchLatestCars = useCallback(async (signal, retry = false) => {
    if (retry) {
      setStatus("loading");
      setError("");
    }

    try {
      const response = await fetch("/api/cars/latest", {
        method: "GET",
        cache: "no-store",
        signal,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load latest arrivals."
        );
      }

      const latestCars = Array.isArray(result.data)
        ? result.data
        : [];

      setCars(latestCars);
      setStatus(latestCars.length > 0 ? "ready" : "empty");
    } catch (fetchError) {
      if (fetchError.name === "AbortError") {
        return;
      }

      console.error("Latest arrivals fetch error:", fetchError);

      setError(
        "We couldn't load the latest arrivals. Please try again."
      );

      setStatus("error");
    }
  }, []);


useEffect(() => {
  const controller = new AbortController();

  Promise.resolve().then(() => {
    if (!controller.signal.aborted) {
      fetchLatestCars(controller.signal);
    }
  });

  return () => controller.abort();
}, [fetchLatestCars]);


  const handleRetry = () => {
    fetchLatestCars(undefined, true);
  };

  return (
    <section className="relative overflow-hidden bg-[#181818] text-white">
      <div className="mx-auto max-w-[1800px] px-5 py-16 sm:px-8 md:px-10 md:py-20 lg:px-14 lg:py-24">
        {/* Section heading */}
        <div className="mb-9 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4 }}
              className="mb-3 font-montserrat text-[9px] font-medium uppercase tracking-[0.32em] text-white/40 md:text-[10px]"
            >
              Just added to the collection
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.04 }}
              className="font-bebas text-5xl leading-[0.88] tracking-[-0.035em] sm:text-6xl md:text-7xl lg:text-[clamp(5rem,7vw,7.5rem)]"
            >
              Latest arrivals
            </motion.h2>
          </div>

          <Link
            href="/cars"
            className="group inline-flex w-fit items-center gap-3 border-b border-white/25 pb-2 font-montserrat text-[9px] font-semibold uppercase tracking-[0.18em] text-white/65 transition-colors duration-300 hover:border-white hover:text-white"
          >
            View all vehicles

            <ArrowUpRight
              size={15}
              strokeWidth={1.4}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>

        {/* Loading state */}
        {status === "loading" ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <VehicleCardSkeleton key={index} />
            ))}
          </div>
        ) : status === "error" ? (
          /* Error state */
          <div className="flex min-h-64 flex-col items-center justify-center border border-white/10 px-6 text-center">
            <p
              role="alert"
              className="max-w-md font-montserrat text-[10px] leading-6 tracking-[0.08em] text-white/55"
            >
              {error}
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-5 inline-flex items-center gap-2 border border-white/25 px-5 py-3 font-montserrat text-[9px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 hover:border-white hover:bg-white hover:text-black"
            >
              <RefreshCw size={13} strokeWidth={1.5} />
              Try again
            </button>
          </div>
        ) : status === "empty" ? (
          /* Empty state */
          <div className="flex min-h-64 flex-col items-center justify-center border border-white/10 px-6 text-center">
            <p className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-white/45">
              No new vehicles are available right now.
            </p>

            <Link
              href="/cars"
              className="mt-5 border-b border-white/30 pb-2 font-montserrat text-[9px] font-semibold uppercase tracking-[0.18em] text-white/70 transition-colors hover:border-white hover:text-white"
            >
              Browse all inventory
            </Link>
          </div>
        ) : (
          /* Latest arrivals grid */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {cars.slice(0, 8).map((car, index) => (
              <VehicleCard
                key={
                  car._id ||
                  `${car.make}-${car.model}-${index}`
                }
                car={car}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-9 flex justify-center sm:mt-12">
          <Link
            href="/cars"
            className="group inline-flex min-h-12 items-center justify-center gap-3 border border-white/30 px-6 py-4 font-montserrat text-[9px] font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-black sm:px-8"
          >
            Discover all vehicles

            <ArrowUpRight
              size={15}
              strokeWidth={1.4}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}