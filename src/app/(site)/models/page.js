"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CarFront,
  ChevronRight,
} from "lucide-react";

const categories = [
  {
    id: "03",
    name: "Sedans",
    slug: "sedan",
    bodyType: "Sedan",
    category: "Luxury & Comfort",
    image: "/images/modelsaa/sedan.png",
    description:
      "A sophisticated balance of luxury, comfort and effortless performance, designed for everyday refinement.",
  },
  {
    id: "04",
    name: "Coupes",
    slug: "coupe",
    bodyType: "Coupe",
    category: "Grand Touring",
    image: "/images/modelsaa/coupe.png",
    description:
      "Distinctive proportions, dramatic design and dynamic performance crafted for the enthusiast.",
  },
  {
    id: "01",
    name: "Sports Cars",
    slug: "sports",
    bodyType: "Sports",
    category: "Performance",
    image: "/images/modelsaa/sports.png",
    description:
      "Engineered for exhilarating performance, sharp handling and an unmistakable road presence.",
  },
  {
    id: "02",
    name: "SUVs",
    slug: "suv",
    bodyType: "SUV",
    category: "Utility & Luxury",
    image: "/images/modelsaa/suv.png",
    description:
      "Commanding design, refined comfort and versatile performance for every journey.",
  },
  {
    id: "05",
    name: "Convertibles",
    slug: "convertible",
    bodyType: "Convertible",
    category: "Open-Air Performance",
    image: "/images/modelsaa/coupe.png",
    description:
      "Open-air driving paired with elegant design and exhilarating performance for unforgettable journeys.",
  },
];

export default function ModelsPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-black">
      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative h-[40dvh] min-h-[320px] overflow-hidden bg-[#e8e8e5] md:min-h-[420px]">
        {/* HERO IMAGE */}

        <div className="absolute inset-0">
          <Image
            src="/images/cars/car5.jpg"
            alt="Luxury vehicle collection"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* DARK OVERLAY */}

        <div className="absolute inset-0 bg-black/30" />

        {/* LEFT GRADIENT */}

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        {/* HERO CONTENT */}

        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-[1800px] items-end px-6 pb-10 md:px-10 md:pb-14 lg:px-14 lg:pb-16">
            <div className="max-w-4xl">
              <p className="mb-4 font-montserrat text-[9px] font-medium uppercase tracking-[0.35em] text-white/55 md:text-[10px]">
                Explore our collection
              </p>

              <h1 className="font-bebas text-[clamp(4.5rem,9vw,9rem)] leading-[0.78] tracking-[-0.05em] text-white">
                Models
              </h1>

              <p className="mt-6 max-w-lg font-montserrat text-[10px] leading-[1.8] tracking-[0.04em] text-white/55 md:text-[11px]">
                Discover our collection by vehicle type and find the right
                combination of design, performance and everyday capability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          INTRO
      ====================================================== */}

      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-6 py-16 md:px-10 md:py-20 lg:grid-cols-[1fr_1.5fr] lg:px-16 lg:py-24">
          <div>
            <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.25em] text-black/40">
              01 — Vehicle categories
            </p>
          </div>

          <div>
            <h2 className="max-w-4xl font-bebas text-5xl leading-[0.9] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              BUILT AROUND
              <br />
              <span className="text-black/25">YOUR LIFESTYLE.</span>
            </h2>

            <p className="mt-8 max-w-2xl font-montserrat text-sm leading-7 text-black/60 md:text-[15px]">
              Every driver is different. Explore our range by category and
              discover the style, performance and practicality that fits your
              journey.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          CATEGORIES
      ====================================================== */}

      <section className="bg-[#f7f7f5]">
        {categories.map((category, index) => (
          <motion.article
            key={category.id}
            initial={{
              opacity: 0,
              y: 40,
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
              duration: 0.7,
            }}
            className="border-b border-black/10"
          >
            <div
              className={`mx-auto grid max-w-[1600px] lg:grid-cols-2 ${
                index % 2 !== 0
                  ? "lg:[&>div:first-child]:order-2"
                  : ""
              }`}
            >
              {/* IMAGE */}

              <div className="relative min-h-[420px] overflow-hidden bg-[#e8e8e5] sm:min-h-[520px] lg:min-h-[680px]">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                <div className="absolute left-6 top-6 flex items-center gap-3 md:left-10 md:top-10">
                  <span className="font-montserrat text-[10px] font-medium uppercase tracking-[0.2em] text-white/80">
                    {category.id}
                  </span>

                  <span className="h-px w-8 bg-white/50" />

                  <span className="font-montserrat text-[10px] uppercase tracking-[0.18em] text-white/70">
                    {category.category}
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                  <p className="font-montserrat text-[10px] uppercase tracking-[0.22em] text-white/70">
                    Explore
                  </p>

                  <p className="mt-2 font-bebas text-4xl tracking-wide text-white md:text-5xl">
                    {category.name}
                  </p>
                </div>
              </div>

              {/* CONTENT */}

              <div className="flex min-h-[420px] flex-col justify-between px-6 py-12 sm:min-h-[520px] sm:px-10 sm:py-14 lg:min-h-[680px] lg:px-16 lg:py-20">
                <div className="flex items-start justify-between">
                  <span className="font-montserrat text-[10px] font-medium uppercase tracking-[0.22em] text-black/35">
                    Category
                  </span>

                  <CarFront
                    size={22}
                    strokeWidth={1}
                    className="text-black/30"
                  />
                </div>

                <div>
                  <p className="mb-4 font-montserrat text-[10px] font-medium uppercase tracking-[0.25em] text-black/40">
                    {category.id} / 05
                  </p>

                  <h3 className="font-bebas text-7xl leading-[0.85] tracking-tight sm:text-8xl md:text-9xl">
                    {category.name}
                  </h3>

                  <p className="mt-7 max-w-lg font-montserrat text-sm leading-7 text-black/60 md:text-[15px]">
                    {category.description}
                  </p>

                  {/* IMPORTANT:
                      We now send bodyType instead of category
                  */}

                  <Link
                    href={`/cars?bodyType=${encodeURIComponent(
                      category.bodyType,
                    )}`}
                    className="group mt-10 inline-flex items-center gap-4 border-b border-black pb-3 font-montserrat text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-300 hover:border-black/40 hover:text-black/60"
                  >
                    Explore inventory

                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.4}
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </Link>
                </div>

                <div className="hidden items-center gap-4 lg:flex">
                  <span className="h-px w-16 bg-black/15" />

                  <span className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-black/30">
                    Discover your next vehicle
                  </span>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </section>

      {/* ======================================================
          BOTTOM CTA
      ====================================================== */}

      <section className="bg-[#181818] text-white">
        <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-36">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="mb-5 font-montserrat text-[10px] font-medium uppercase tracking-[0.28em] text-white/40">
                Ready to find yours?
              </p>

              <h2 className="max-w-5xl font-bebas text-7xl leading-[0.82] tracking-tight sm:text-8xl md:text-[10rem]">
                YOUR NEXT
                <br />
                <span className="text-white/20">STARTS HERE.</span>
              </h2>
            </div>

            <Link
              href="/cars"
              className="group inline-flex w-fit items-center gap-5 border border-white/20 px-7 py-5 font-montserrat text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-300 hover:bg-white hover:text-black"
            >
              View all inventory

              <ChevronRight
                size={17}
                strokeWidth={1.3}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}