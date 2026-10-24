
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
    "Featured vehicle";

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
        <div className="relative aspect-[4/3] overflow-hidden bg-[#ebeae6]">
          <Image
            src={getImage(car)}
            alt={imageAlt}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
            className="object-cover  transition-transform duration-700 ease-out group-hover:scale-[1.035] "
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

          <span className="absolute left-1 top-1 border border-white/35 bg-black/35 px-2 py-1 font-montserrat text-[8px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur-sm">
            {car.bodyType || "Featured vehicle"}
          </span>

          <span className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center border border-white/50 bg-white text-black transition-colors duration-300 group-hover:bg-black group-hover:text-white">
            <ArrowUpRight size={18} strokeWidth={1.4} />
          </span>
        </div>

        {/* Vehicle details */}
        <div className="border-b border-black/15 py-5 sm:py-6">
          <div className="mb-2 flex items-center justify-between gap-4">
            <p className="min-w-0 truncate font-montserrat text-[8px] font-medium uppercase tracking-[0.25em] text-black/45 sm:text-[9px]">
              {car.make || "Selected vehicle"}
            </p>

            {car.year && (
              <span className="shrink-0 font-montserrat text-[9px] tracking-[0.12em] text-black/35">
                {car.year}
              </span>
            )}
          </div>

          <h3 className="font-bebas text-3xl leading-[0.95] tracking-[-0.02em] sm:text-4xl">
            {car.model || "Vehicle details"}
          </h3>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-montserrat text-[8px] uppercase tracking-[0.14em] text-black/40">
            {car.transmission && <span>{car.transmission}</span>}

            {car.fuelType && (
              <>
                {car.transmission && (
                  <span className="h-[3px] w-[3px] rounded-full bg-black/25" />
                )}
                <span>{car.fuelType}</span>
              </>
            )}

            {car.mileage != null && (
              <>
                <span className="h-[3px] w-[3px] rounded-full bg-black/25" />
                <span>
                  {Number(car.mileage).toLocaleString("en-US")}{" "}
                  {car.mileageUnit || "km"}
                </span>
              </>
            )}
          </div>

          <div className="mt-6 flex items-end justify-between gap-3 border-t border-black/10 pt-5">
            <span className="font-montserrat text-[8px] uppercase tracking-[0.2em] text-black/40">
              Asking price
            </span>

            <span className="text-right font-montserrat text-sm font-semibold tracking-[0.01em]">
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
      <div className="aspect-[4/3] bg-black/[0.06]" />

      <div className="space-y-4 border-b border-black/10 py-5 sm:py-6">
        <div className="h-2.5 w-24 bg-black/[0.07]" />
        <div className="h-8 w-3/4 bg-black/[0.07]" />
        <div className="h-2.5 w-1/2 bg-black/[0.07]" />
        <div className="h-px w-full bg-black/[0.07]" />

        <div className="flex justify-between gap-4">
          <div className="h-2.5 w-14 bg-black/[0.07]" />
          <div className="h-4 w-24 bg-black/[0.07]" />
        </div>
      </div>
    </div>
  );
}

export default function FeaturedInventory() {
  const [cars, setCars] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const fetchFeaturedCars = useCallback(async (signal, retry = false) => {
    if (retry) {
      setStatus("loading");
      setError("");
    }

    try {
      const response = await fetch("/api/cars/featured", {
        method: "GET",
        cache: "no-store",
        signal,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load featured vehicles."
        );
      }

      const featuredCars = Array.isArray(result.data)
        ? result.data
        : [];

      setCars(featuredCars);
      setStatus(featuredCars.length > 0 ? "ready" : "empty");
    } catch (fetchError) {
      if (fetchError.name === "AbortError") {
        return;
      }

      console.error("Featured inventory fetch error:", fetchError);

      setError(
        "We couldn't load the featured vehicles. Please try again."
      );

      setStatus("error");
    }
  }, []);

 
useEffect(() => {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    fetchFeaturedCars(controller.signal);
  }, 0);

  return () => {
    clearTimeout(timeoutId);
    controller.abort();
  };
}, [fetchFeaturedCars]);


  const handleRetry = () => {
    fetchFeaturedCars(undefined, true);
  };

  return (
    <section className="bg-white text-[#181818]">
      <div className="mx-auto max-w-[1800px] px-5 py-16 sm:px-8 md:px-10 md:py-20 lg:px-14 lg:py-24">
        {/* Section heading */}
        <div className="mb-9 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4 }}
              className="mb-3 font-montserrat text-[9px] font-medium uppercase tracking-[0.32em] text-black/40 md:text-[10px]"
            >
              A carefully selected collection
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.04 }}
              className="font-bebas text-5xl leading-[0.88] tracking-[-0.035em] sm:text-6xl md:text-7xl lg:text-[clamp(5rem,7vw,7.5rem)]"
            >
              Featured inventory
            </motion.h2>
          </div>

          <Link
            href="/cars"
            className="group inline-flex w-fit items-center gap-3 border-b border-black/25 pb-2 font-montserrat text-[9px] font-semibold uppercase tracking-[0.18em] text-black/65 transition-colors duration-300 hover:border-black hover:text-black"
          >
            Explore all vehicles

            <ArrowUpRight
              size={15}
              strokeWidth={1.4}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>

        {/* Loading state */}
        {status === "loading" ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <VehicleCardSkeleton key={index} />
            ))}
          </div>
        ) : status === "error" ? (
          /* Error state */
          <div className="flex min-h-64 flex-col items-center justify-center border border-black/10 px-6 text-center">
            <p
              role="alert"
              className="max-w-md font-montserrat text-[10px] leading-6 tracking-[0.08em] text-black/55"
            >
              {error}
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-5 inline-flex items-center gap-2 border border-black/25 px-5 py-3 font-montserrat text-[9px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 hover:border-black hover:bg-[#181818] hover:text-white"
            >
              <RefreshCw size={13} strokeWidth={1.5} />
              Try again
            </button>
          </div>
        ) : status === "empty" ? (
          /* Empty state */
          <div className="flex min-h-64 flex-col items-center justify-center border border-black/10 px-6 text-center">
            <p className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-black/45">
              No featured vehicles are available right now.
            </p>

            <Link
              href="/cars"
              className="mt-5 border-b border-black/30 pb-2 font-montserrat text-[9px] font-semibold uppercase tracking-[0.18em] text-black/70 transition-colors hover:border-black hover:text-black"
            >
              Browse all inventory
            </Link>
          </div>
        ) : (
          /* Featured vehicles grid */
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {cars.slice(0, 8).map((car, index) => (
              <VehicleCard
                key={car._id || `${car.make}-${car.model}-${index}`}
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
            className="group inline-flex min-h-12 items-center justify-center gap-3 bg-[#181818] px-6 py-4 font-montserrat text-[9px] font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-black/75 sm:px-8"
          >
            View complete inventory

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
