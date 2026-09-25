"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const vehicleCategories = [
  {
    id: 1,
    name: "Sports Cars",
    slug: "sports",
    brand: "Porsche",
    category: "Sports",
    image: "/images/categories/sports.png",
    description:
      "Engineered for exhilarating performance, sharp handling and an unmistakable presence.",
  },
  {
    id: 2,
    name: "SUVs",
    slug: "suv",
    brand: "Porsche",
    category: "SUV",
    image: "/images/categories/suv.png",
    description:
      "Commanding design, refined comfort and versatile performance for every journey.",
  },
  {
    id: 3,
    name: "Sedans",
    slug: "sedan",
    brand: "Porsche",
    category: "Sedan",
    image: "/images/categories/sedan.png",
    description:
      "A sophisticated balance of luxury, comfort and effortless performance.",
  },
  {
    id: 4,
    name: "Coupes",
    slug: "coupe",
    brand: "Porsche",
    category: "Coupe",
    image: "/images/categories/coupes.png",
    description:
      "Distinctive proportions and dynamic performance crafted for the enthusiast.",
  },
  {
    id: 5,
    name: "Convertibles",
    slug: "convertible",
    brand: "Porsche",
    category: "Convertible",
    image: "/images/categories/convertible.png",
    description:
      "Open-air driving paired with elegant design and exhilarating performance.",
  },
];
export default function ModelsSection() {
  const [activeModel, setActiveModel] = useState(0);

  const model = vehicleCategories[activeModel];

  return (
    <section className="relative overflow-hidden bg-[#181818] text-white">
      {/* ======================================================
          01 — MODEL NAVIGATION
      ====================================================== */}

      <div className="border-b border-white/60">
        <div className="mx-auto flex max-w-[1800px] justify-center overflow-x-auto px-6 py-7 md:px-10 md:py-9 lg:px-14 lg:py-10">
          <div className="flex min-w-max items-center justify-center gap-7 md:gap-10 lg:gap-14">
            {vehicleCategories.map((item, index) => {
              const isActive = index === activeModel;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveModel(index)}
                  className="group relative cursor-pointer whitespace-nowrap font-montserrat text-[9px] font-medium uppercase tracking-[0.16em] text-white/45 transition-colors duration-300 hover:text-white/80 md:text-[10px]"
                >
                  {item.name}

                  <motion.span
                    initial={false}
                    animate={{
                      scaleX: isActive ? 1 : 0,
                      opacity: isActive ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute -bottom-3 left-0 h-px w-full origin-left bg-white md:-bottom-4"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ======================================================
          02 — MODEL SHOWCASE
      ====================================================== */}

      <div className="mx-auto max-w-[1800px] px-6 md:px-10 lg:px-14">
        <div className="grid min-h-[72vh] grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">
          {/* ==================================================
              LEFT CONTENT
          ================================================== */}

          <div className="flex flex-col justify-center py-16 md:py-20 lg:pr-14 xl:pr-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={model.id}
                initial={{
                  opacity: 0,
                  x: -35,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -20,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* CATEGORY */}

                <p className="mb-5 font-montserrat text-[9px] font-medium uppercase tracking-[0.32em] text-white/35 md:mb-6 md:text-[10px]">
                  {model.category}
                </p>

                {/* BRAND */}

                <p className="mb-2 font-montserrat text-[10px] font-medium uppercase tracking-[0.28em] text-white/45 md:text-[11px]">
                  {model.brand}
                </p>

                {/* MODEL NAME */}

                <h2 className="font-bebas text-[clamp(4.5rem,8vw,8rem)] leading-[0.8] tracking-[-0.045em] text-white">
                  {model.name}
                </h2>

                {/* CTA AREA */}

                <div className="mt-9 flex flex-wrap items-center gap-3 md:mt-11 md:gap-4">
                  <Link
                    href={`/models/${model.id}`}
                    className="group inline-flex items-center gap-3 border border-white bg-white px-6 py-3.5 font-montserrat text-[9px] font-medium uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-transparent hover:text-white md:px-7 md:py-4"
                  >
                    Explore models

                    <ArrowUpRight
                      size={14}
                      strokeWidth={1.3}
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </Link>

                  <Link
                    href={`/contact?model=${model.id}`}
                    className="group inline-flex items-center gap-3 border border-white/20 px-6 py-3.5 font-montserrat text-[9px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-white md:px-7 md:py-4"
                  >
                    Enquire

                    <ArrowUpRight
                      size={14}
                      strokeWidth={1.3}
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ==================================================
              RIGHT IMAGE
          ================================================== */}

          <div className="relative flex min-h-[10vh]  items-center justify-center overflow-hidden lg:min-h-0 max-h-[70vh]">
            <AnimatePresence mode="wait">
              <motion.div
                key={model.id}
                initial={{
                  opacity: 0,
                  x: 45,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  x: -25,
                  scale: 0.98,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative flex h-full w-full items-center justify-center "
              >
                {/* SUBTLE FLOOR SHADOW */}

                <div className="pointer-events-none absolute bottom-[12%] left-1/2 h-[2px] w-[62%] -translate-x-1/2 bg-white/10 blur-md" />

                <Image
                  src={model.image}
                  alt={model.name}
                  width={1800}
                  height={1100}
                  priority={activeModel === 0}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="relative z-10 md:h-auto h-[20vh]  w-[92%] object-contain md:w-[85%] lg:w-[100%] "
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ======================================================
          03 — MODEL DESCRIPTION
      ====================================================== */}

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1800px] px-6 md:px-10 lg:px-14">
          <div className="flex justify-center py-10 md:py-12 lg:py-14">
            <AnimatePresence mode="wait">
              <motion.p
                key={model.id}
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                }}
                transition={{
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="max-w-2xl text-center font-montserrat text-[10px] leading-[1.8] tracking-[0.08em] text-white/35 md:text-[11px] md:leading-[1.9]"
              >
                {model.description}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}