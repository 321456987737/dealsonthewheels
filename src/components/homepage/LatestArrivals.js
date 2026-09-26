
"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

export default function LatestArrivals() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    loop: false,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;

    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;

    emblaApi.scrollNext();
  }, [emblaApi]);

  const updateButtons = useCallback(() => {
    if (!emblaApi) return;

    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  /* ======================================================
      FETCH LATEST ARRIVALS
  ====================================================== */

  useEffect(() => {
    let cancelled = false;

    async function fetchLatestCars() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/cars/latest", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load latest arrivals"
          );
        }

        if (!cancelled) {
          setCars(result.data || []);
        }
      } catch (error) {
        console.error("Latest arrivals fetch error:", error);

        if (!cancelled) {
          setError("Unable to load latest arrivals.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchLatestCars();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ======================================================
      EMBLA BUTTON STATE
  ====================================================== */

  useEffect(() => {
    if (!emblaApi) return;

    const frameId = requestAnimationFrame(updateButtons);

    emblaApi.on("select", updateButtons);
    emblaApi.on("reInit", updateButtons);

    return () => {
      cancelAnimationFrame(frameId);
      emblaApi.off("select", updateButtons);
      emblaApi.off("reInit", updateButtons);
    };
  }, [emblaApi, updateButtons]);

  /* ======================================================
      HELPER
  ====================================================== */

  const formatPrice = (price, currency) => {
    if (typeof price !== "number") return "";

    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
        maximumFractionDigits: 0,
      }).format(price);
    } catch {
      return `${currency || "USD"} ${price.toLocaleString()}`;
    }
  };

  const getImage = (car) => {
    if (!car?.images?.length) {
      return "/images/placeholder-car.jpg";
    }
   console.log(car,"papap")
    return car.images[0]?.url || "/images/placeholder-car.jpg";
  };

  return (
    <section className="relative overflow-hidden bg-[#181818] text-white">
      {/* ======================================================
          SECTION HEADER
      ====================================================== */}

      <div className="mx-auto max-w-[1800px] px-6 pb-10 pt-16 md:px-10 md:pb-12 md:pt-20 lg:px-14 lg:pb-14 lg:pt-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            {/* EYEBROW */}

            <motion.p
              initial={{
                opacity: 0,
                y: 10,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.4,
              }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-3 font-montserrat text-[9px] font-medium uppercase tracking-[0.32em] text-white/35 md:text-[10px]"
            >
              Fresh to the collection
            </motion.p>

            {/* TITLE */}

            <motion.h2
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.4,
              }}
              transition={{
                duration: 0.55,
                delay: 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-bebas text-5xl leading-[0.85] tracking-[-0.03em] sm:text-6xl md:text-7xl lg:text-[clamp(5rem,7vw,7.5rem)]"
            >
              Latest Arrivals
            </motion.h2>
          </div>

          {/* DESKTOP VIEW ALL */}

          <Link
            href="/cars"
            className="group hidden items-center gap-3 border-b border-white/20 pb-2 font-montserrat text-[9px] font-medium uppercase tracking-[0.2em] text-white/70 transition-all duration-300 hover:border-white hover:text-white md:flex"
          >
            View all vehicles

            <ArrowUpRight
              size={15}
              strokeWidth={1.3}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>
      </div>

      {/* ======================================================
          CAROUSEL
      ====================================================== */}

      <div className="mx-auto max-w-[1800px] px-6 md:px-10 lg:px-14">
        {loading ? (
          /* ==================================================
              LOADING
          ================================================== */

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden border border-white/10"
              >
                <div className="aspect-[1.25] bg-white/[0.06]" />

                <div className="space-y-4 p-5">
                  <div className="h-2.5 w-20 bg-white/[0.06]" />
                  <div className="h-8 w-3/4 bg-white/[0.06]" />
                  <div className="h-2.5 w-1/2 bg-white/[0.06]" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* ==================================================
              ERROR
          ================================================== */

          <div className="flex min-h-[280px] items-center justify-center border border-white/10">
            <div className="text-center">
              <p className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-white/40">
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 border border-white/20 px-5 py-3 font-montserrat text-[9px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:border-white"
              >
                Try again
              </button>
            </div>
          </div>
        ) : cars.length === 0 ? (
          /* ==================================================
              EMPTY
          ================================================== */

          <div className="flex min-h-[280px] items-center justify-center border border-white/10">
            <p className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-white/35">
              No new vehicles available
            </p>
          </div>
        ) : (
          <>
            {/* ==================================================
                EMBLA VIEWPORT
            ================================================== */}

            <div ref={emblaRef} className="overflow-hidden">
              <div className="-ml-3 flex md:-ml-4">
                {cars.map((car, index) => (
                  <div
                    key={car._id}
                    className="min-w-0 flex-[0_0_88%] pl-3 sm:flex-[0_0_70%] md:flex-[0_0_48%] md:pl-4 lg:flex-[0_0_31%] xl:flex-[0_0_25%]"
                  >
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 25,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.15,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: Math.min(index * 0.07, 0.3),
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="group h-full"
                    >
                      <Link
                        href={`/cars/${car._id}`}
                        className="block h-full"
                      >
                        {/* IMAGE */}

                        <div className="relative aspect-[1.25] overflow-hidden border border-white/10 bg-white/[0.025]">
                          <Image
                            src={getImage(car)}
                            alt={
                              car.images?.[0]?.alt ||
                              `${car.make} ${car.model}`
                            }
                            fill
                            sizes="(max-width: 640px) 88vw, (max-width: 768px) 70vw, (max-width: 1024px) 48vw, 25vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          />

                          {/* IMAGE OVERLAY */}

                          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />

                          {/* CONDITION */}

                          <div className="absolute left-4 top-4">
                            <span className="border border-white/15 bg-black/40 px-3 py-2 font-montserrat text-[8px] font-medium uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
                              {car.condition}
                            </span>
                          </div>

                          {/* ARROW */}

                          <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-all duration-300   group-hover:text-white ">
                            <ArrowUpRight
                              size={22}
                              strokeWidth={1.3}
                              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                          </div>
                        </div>

                        {/* INFORMATION */}

                        <div className="border-x border-b border-white/10 p-5 md:p-6">
                          {/* MAKE */}

                          <p className="mb-2 font-montserrat text-[8px] font-medium uppercase tracking-[0.28em] text-white/35">
                            {car.make}
                          </p>

                          {/* MODEL */}

                          <h3 className="font-bebas text-3xl leading-[0.9] tracking-[-0.025em] text-white md:text-4xl">
                            {car.model}
                          </h3>

                          {/* DETAILS */}

                          <div className="mt-5 flex items-center gap-3 font-montserrat text-[8px] uppercase tracking-[0.16em] text-white/35">
                            <span>{car.year}</span>

                            <span className="h-[3px] w-[3px] rounded-full bg-white/20" />

                            <span>
                              {car.mileage?.toLocaleString() || 0}{" "}
                              {car.mileageUnit}
                            </span>

                            <span className="h-[3px] w-[3px] rounded-full bg-white/20" />

                            <span>{car.transmission}</span>
                          </div>

                          {/* PRICE */}

                          <div className="mt-6 flex items-end justify-between">
                            <span className="font-montserrat text-[8px] uppercase tracking-[0.2em] text-white/30">
                              Price
                            </span>

                            <span className="font-montserrat text-sm font-medium tracking-[0.03em] text-white">
                              {formatPrice(car.price, car.currency)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            {/* ==================================================
                CONTROLS
            ================================================== */}

            <div className="flex items-center justify-between border-t border-white/10 py-6 md:py-8">
              {/* MOBILE VIEW ALL */}

              <Link
                href="/cars"
                className="group flex items-center gap-2 font-montserrat text-[9px] font-medium uppercase tracking-[0.18em] text-white/55 transition-colors duration-300 hover:text-white md:hidden"
              >
                All vehicles

                <ArrowUpRight
                  size={14}
                  strokeWidth={1.3}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>

              {/* EMPTY SPACE DESKTOP */}

              <div className="hidden md:block" />

              {/* ARROWS */}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={scrollPrev}
                  disabled={!canScrollPrev}
                  aria-label="Previous vehicles"
                  className="group flex h-11 w-11 cursor-pointer items-center justify-center border border-white/15 text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-white/15 disabled:hover:bg-transparent disabled:hover:text-white"
                >
                  <ArrowLeft
                    size={18}
                    strokeWidth={1.2}
                    className="transition-transform duration-300 group-hover:-translate-x-0.5"
                  />
                </button>

                <button
                  type="button"
                  onClick={scrollNext}
                  disabled={!canScrollNext}
                  aria-label="Next vehicles"
                  className="group flex h-11 w-11 cursor-pointer items-center justify-center border border-white/15 text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-white/15 disabled:hover:bg-transparent disabled:hover:text-white"
                >
                  <ArrowRight
                    size={18}
                    strokeWidth={1.2}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ======================================================
          BOTTOM SPACING
      ====================================================== */}

      <div className="h-4 md:h-8" />
    </section>
  );
}