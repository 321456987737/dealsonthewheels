"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LocationSection() {
  return (
    <section className="relative min-h-[55dvh] overflow-hidden bg-black text-white md:min-h-[65dvh]">
      {/* ==================================================
          BACKGROUND IMAGE
      ================================================== */}

      <div className="absolute inset-0">
        <img
          src="/images/cars/car5.jpg"
          alt="Our dealership location"
          className="h-full w-full object-cover"
        />
      </div>

      {/* ==================================================
          BLACK TINT
      ================================================== */}

      <div className="absolute inset-0 bg-black/65" />

      {/* ==================================================
          EXTRA GRADIENT
      ================================================== */}

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/75" />

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div className="relative z-10 flex min-h-[55dvh] items-center justify-center px-6 py-20 md:min-h-[65dvh] md:px-10 lg:px-14">
        <div className="mx-auto flex w-full max-w-[1500px] flex-col items-center text-center">
          {/* EYEBROW */}

          <motion.p
            initial={{
              opacity: 0,
              y: 15,
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
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-6 font-montserrat text-[9px] font-medium uppercase tracking-[0.35em] text-white/55 md:mb-8 md:text-[10px]"
          >
            Visit Our Showroom
          </motion.p>

          {/* MAIN TITLE */}

          <motion.h2
            initial={{
              opacity: 0,
              y: 35,
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
              duration: 0.7,
              delay: 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-6xl font-bebas text-[clamp(4rem,10vw,10rem)] leading-[0.82] tracking-[-0.045em]"
          >
            Find Us in the City
          </motion.h2>

          {/* CTA */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.4,
            }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-9 md:mt-11"
          >
            <Link
              href="https://www.google.com/maps/place/Deals+On+Wheels+Pearl/@25.3773521,51.5503474,1705m/data=!3m1!1e3!4m6!3m5!1s0x3e45c3d3e41db8a1:0x819af9489c8653e!8m2!3d25.3684533!4d51.5504525!16s%2Fg%2F11zxhjkg7y!18m1!1e1"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 border border-white/35 bg-white px-6 py-3.5 font-montserrat text-[9px] font-medium uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-transparent hover:text-white md:px-7 md:py-4"
            >
              Open in Google Maps
              <ArrowUpRight
                size={15}
                strokeWidth={1.3}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
            {/* <Link
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 border border-white/35 bg-white px-6 py-3.5 font-montserrat text-[9px] font-medium uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-transparent hover:text-white md:px-7 md:py-4"
            >
              Open in Google Maps

              <ArrowUpRight
                size={15}
                strokeWidth={1.3}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
