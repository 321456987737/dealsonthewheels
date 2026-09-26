"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

const cars = [
  {
    id: "6ab21be9fa9f355bc3bc5e1b",
    brand: "Mercedes-Benz",
    name: "Mercedes-AMG GT",
    category: "Performance",
    year: "2025",
    price: "$189,900",
    description:
      "A striking grand tourer that blends breathtaking AMG performance with refined luxury, delivering exhilarating power, precise handling, and an unmistakable presence.",
    image: "/images/inventoryimages/Mercedes-AMG GT.webp",
  },

  {
    id:  "1",
    brand: "Porsche",
    name: "Porsche 911 Carrera",
    category: "Sports",
    year: "2025",
    price: "$142,500",
    description:
      "An iconic sports car engineered for pure driving enjoyment, combining timeless Porsche design with responsive performance, everyday usability, and exceptional precision.",
    image: "/images/inventoryimages/Porsche 911 Carrera.avif",
  },

  {
    id:  "2",
    brand: "Range Rover",
    name: "Range Rover Sport",
    category: "Luxury SUV",
    year: "2025",
    price: "$118,900",
    description:
      "A sophisticated luxury SUV offering commanding performance, elegant design, advanced technology, and exceptional comfort both on the road and beyond it.",
    image: "/images/inventoryimages/Range Rover Sport.jpg",
  },

  {
    id:  "3",
    brand: "BMW",
    name: "BMW M4 Competition",
    category: "Performance",
    year: "2025",
    price: "$96,800",
    description:
      "A high-performance coupe built around sharp dynamics and unmistakable M character, combining aggressive styling, thrilling acceleration, and everyday refinement.",
    image: "/images/inventoryimages/BMW M4 Competition.jpg",
  },
];
export default function FeaturedInventory() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;

    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;

    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const activeCar = cars[selectedIndex];

  return (
    <section className="relative min-h-[102dvh] overflow-hidden bg-white text-black">
      {/* ======================================================
          TOP HEADER
      ====================================================== */}

      <div className="relative z-20 mx-auto flex max-w-[1800px] items-center justify-between px-6 pt-10 md:px-10 md:pt-14 lg:px-14 lg:pt-16">
        <div>
          <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.3em] text-black/45">
            Discover
          </p>

          <h2 className="font-montserrat mt-1 text-5xl tracking-[0.04em] md:text-6xl lg:text-7xl">
            Featured Inventory
          </h2>
        </div>

        {/* Desktop Discover All */}
        <Link
          href="/cars"
          className="group mt-2 hidden items-center gap-3 border-b border-black/30 pb-2 font-montserrat text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-300 hover:border-black md:flex"
        >
          Discover all vehicles
          <ArrowUpRight
            size={15}
            strokeWidth={1.4}
            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </Link>

        {/* Mobile Discover All */}
        <Link
          href="/cars"
          className="mt-1 flex items-center gap-2 border-b border-black/30 pb-2 font-montserrat text-[9px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 hover:border-black md:hidden"
        >
          All vehicles
          <ArrowUpRight size={14} strokeWidth={1.4} />
        </Link>
      </div>

      {/* ======================================================
          CAROUSEL
      ====================================================== */}

      <div className="mx-auto mt-10 max-w-[1800px] px-6 md:mt-14 md:px-10 lg:mt-16 lg:px-14">
        <div className="relative">
          {/* ==================================================
              IMAGE AREA
          ================================================== */}

          <div className="relative h-[45dvh] md:h-[67dvh] lg:h-[72dvh]">
            {/* LEFT ARROW */}

            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous vehicle"
              className="group absolute left-0 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center border border-black/20 bg-transparent text-black transition-all duration-300 hover:bg-black hover:text-white md:left-2 md:h-12 md:w-12 lg:left-6"
            >
              <ArrowLeft
                size={22}
                strokeWidth={1.3}
                className="transition-transform duration-300 group-hover:-translate-x-0.5 "
              />
            </button>

            {/* ==================================================
                EMBLA VIEWPORT
            ================================================== */}

            <div ref={emblaRef} className="h-full ">
              <div className="flex h-full">
                {cars.map((car, index) => {
                  const rawDistance = Math.abs(index - selectedIndex);

                  const circularDistance = Math.min(
                    rawDistance,
                    cars.length - rawDistance,
                  );

                  const isActive = circularDistance === 0;
                  const isSide = circularDistance === 1;

                  return (
                    <div key={car.id} className="min-w-0 flex-[0_0_78%]">
                      <motion.div
                        animate={{
                          opacity: isActive ? 1 : isSide ? 0.18 : 0,
                          scale: isActive ? 1 : isSide ? 0.96 : 0.92,
                        }}
                        transition={{
                          duration: 0.55,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="relative flex h-full w-full flex-col items-center justify-center"
                      >
                        {/* ==================================================
                            BRAND + MODEL
                        ================================================== */}

                        <motion.div
                          animate={{
                            opacity: isActive ? 1 : 0,
                            y: isActive ? 0 : 10,
                          }}
                          transition={{
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="relative z-10 mb-4 flex flex-col items-center text-center md:mb-5 lg:mb-6"
                        >
                          {/* BRAND */}

                          <p className="mb-2 font-montserrat text-[9px] font-medium uppercase tracking-[0.32em] text-black/40 md:text-[10px]">
                            {car.brand}
                          </p>

                          {/* MODEL NAME */}

                          <h3 className="font-bebas text-center text-5xl leading-[0.88] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[clamp(4.5rem,7vw,7.5rem)]">
                            {car.name}
                          </h3>
                        </motion.div>

                        {/* ==================================================
                            GROUND SHADOW
                        ================================================== */}

                        <div className="pointer-events-none absolute bottom-[11%] left-1/2 h-[2px] w-[55%] -translate-x-1/2 bg-black/10 blur-md" />

                        {/* ==================================================
                            CAR IMAGE
                        ================================================== */}

                        <div className="relative flex h-[48%] w-full items-center justify-center md:h-[52%] lg:h-[55%]">
                          <Image
                            src={car.image}
                            alt={car.name}
                            width={1800}
                            height={1000}
                            priority={index === 0}
                            sizes="100vw"
                            className="h-auto w-[92%] select-none pointer-events-none object-contain md:w-[94%] lg:w-[95%]"
                          />
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT ARROW */}

            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next vehicle"
              className="group absolute right-0 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center border border-black/20 bg-transparent text-black transition-all duration-300 hover:bg-black hover:text-white md:right-2 md:h-12 md:w-12 lg:right-6"
            >
              <ArrowRight
                size={22}
                strokeWidth={1.3}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </button>
          </div>

          {/* ==================================================
              FIXED CAROUSEL COUNTER
          ================================================== */}

          <div className="flex shrink-0 items-center justify-center py-5 md:py-7">
            <div className="flex items-center gap-3">
              <motion.span
                key={`current-${activeCar.id}`}
                initial={{
                  opacity: 0,
                  y: 5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="font-montserrat text-[10px] tracking-[0.2em] text-black"
              >
                {String(selectedIndex + 1).padStart(2, "0")}
              </motion.span>

              <div className="h-px w-16 bg-black/10 md:w-24 lg:w-28">
                <motion.div
                  className="h-px bg-black"
                  animate={{
                    width: `${((selectedIndex + 1) / cars.length) * 100}%`,
                  }}
                  transition={{
                    duration: 0.45,
                    ease: "easeOut",
                  }}
                />
              </div>

              <span className="font-montserrat text-[10px] tracking-[0.2em] text-black/25">
                {String(cars.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 pb-6 md:gap-4 md:pb-8 z-50">
            {/* TOP ROW — 2 */}

            <div className="flex items-center justify-center gap-3 md:gap-4">
              <Link
                href={`/cars/${activeCar.id}`}
                className="group inline-flex min-w-[130px] items-center justify-center border border-black bg-black px-5 py-3 font-montserrat text-[9px] font-medium uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-white hover:text-black md:min-w-[150px] md:px-6 md:py-3.5"
              >
                {activeCar.name}

                <ArrowUpRight
                  size={13}
                  strokeWidth={1.3}
                  className="ml-2 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>

              <button
                type="button"
                className="group inline-flex min-w-[110px] cursor-pointer items-center justify-center border border-black/20 bg-white px-5 py-3 font-montserrat text-[9px] font-medium uppercase tracking-[0.18em] text-black transition-all duration-300 hover:border-black md:min-w-[130px] md:px-6 md:py-3.5"
              >
                <Link href={`/cars/${activeCar.id}`} className="flex items-center justify-center gap-2">
                {activeCar.category}
                </Link>
              </button>
            </div>

            {/* BOTTOM ROW — 3 */}

            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
              <Link
                href={`/cars/${activeCar.id}`}
                className="group inline-flex items-center justify-center border border-black/20 bg-white px-5 py-3 font-montserrat text-[9px] font-medium uppercase tracking-[0.18em] text-black transition-all duration-300 hover:border-black hover:bg-black hover:text-white md:px-6 md:py-3.5"
              >
                Explore the model
                <ArrowUpRight
                  size={13}
                  strokeWidth={1.3}
                  className="ml-2 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>

              <Link
                href={`/cars/${activeCar.id}`}
                className="group inline-flex items-center justify-center border border-black/20 bg-white px-5 py-3 font-montserrat text-[9px] font-medium uppercase tracking-[0.18em] text-black transition-all duration-300 hover:border-black hover:bg-black hover:text-white md:px-6 md:py-3.5"
              >
                Start configuration
                <ArrowUpRight
                  size={13}
                  strokeWidth={1.3}
                  className="ml-2 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>

              <Link
                    href={`/test-drive?car=${activeCar._id}`}
                className="group inline-flex items-center justify-center border border-black/20 bg-white px-5 py-3 font-montserrat text-[9px] font-medium uppercase tracking-[0.18em] text-black transition-all duration-300 hover:border-black hover:bg-black hover:text-white md:px-6 md:py-3.5"
              >
                Test Drive
                <ArrowUpRight
                  size={13}
                  strokeWidth={1.3}
                  className="ml-2 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </div>
          </div>

          {/* ==================================================
              YEAR + PRICE
          ================================================== */}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCar.id}
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              transition={{
                duration: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-center justify-center gap-4 border-t border-black/10 py-5 font-montserrat text-[9px] uppercase tracking-[0.18em] text-black/40 md:py-6 md:text-[10px]"
            >
              <span>{activeCar.year}</span>

              <span className="h-[3px] w-[3px] rounded-full bg-black/25" />

              <span>{activeCar.price}</span>
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCar.id}
              initial={{
                opacity: 0,
                y: 4,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -4,
              }}
              transition={{
                duration: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-center justify-center gap-4 border-t border-black/10 py-5 font-montserrat text-lg uppercase tracking-[0.18em] text-black/40 md:py-6 md:text-[10px] text-[9px] md:text-start text-center"
            >
              <span>{activeCar.description}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
