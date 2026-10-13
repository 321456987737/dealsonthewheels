"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
const stats = [
  {
    id: 1,
    value: "2,500+",
    label: "Vehicles Sold",
    description: "Over 2,500 quality vehicles sold to happy customers across Pakistan.",
  },
  {
    id: 2,
    value: "4.9/5",
    label: "Customer Rating",
    description: "Rated 4.9 out of 5 stars by 1,200+ verified buyers for trusted service.",
  },
  {
    id: 3,
    value: "15+",
    label: "Years Experience",
    description: "More than 15 years of experience in importing and selling quality cars.",
  },
];
const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function StatsSection() {
  return (
    <section className="relative overflow-hidden border-y border-black/10 bg-[#f7f7f5] text-black">
      <div className="mx-auto max-w-[1800px] px-6 py-20 md:px-10 md:py-24 lg:px-14 lg:py-28">
        {/* HEADER */}
        <div className="mb-14 flex flex-col justify-between gap-8 md:mb-16 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <motion.p
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="mb-4 font-montserrat text-[9px] font-medium uppercase tracking-[0.35em] text-black/35 md:text-[10px]"
            >
              Sample statistics · Demo content
            </motion.p>

            <motion.h2
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="font-bebas text-[clamp(4.5rem,9vw,9rem)] leading-[0.8] tracking-[-0.04em] text-black"
            >
              TRUST BUILT.
              <br />
              MILES AHEAD.
            </motion.h2>

            <motion.p
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="mt-6 max-w-md font-montserrat text-[10px] leading-[1.9] tracking-[0.04em] text-black/45 md:text-[11px]"
            >
              Every number represents a relationship, a milestone, and a
              commitment to delivering a better automotive experience.
            </motion.p>
          </div>

          <motion.a
            href="/contact"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group inline-flex w-fit items-center gap-3 border-b border-black/20 pb-2 font-montserrat text-[9px] font-semibold uppercase tracking-[0.16em] transition-colors hover:border-black md:text-[10px]"
          >
            Discover our showroom
            <ArrowUpRight
              size={14}
              strokeWidth={1.4}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </motion.a>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-1 border-l border-t border-black/10 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.article
              key={stat.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group flex min-h-[245px] flex-col justify-between border-b border-r border-black/10 p-6 transition-colors duration-300 hover:bg-white sm:min-h-[290px] md:p-8 lg:min-h-[340px] lg:p-10"
            >
              <div className="flex items-center justify-between">
                <span className="font-montserrat text-[9px] font-medium uppercase tracking-[0.2em] text-black/35">
                  0{stat.id}
                </span>

                <ArrowUpRight
                  size={17}
                  strokeWidth={1.2}
                  className="text-black/25 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black"
                />
              </div>

              <div className="mt-12">
                <p className="font-bebas text-[clamp(3.8rem,6.5vw,6.5rem)] leading-[0.9] tracking-[-0.02em] text-black">
                  {stat.value}
                </p>

                <h3 className="mt-4 font-montserrat text-[10px] font-semibold uppercase tracking-[0.15em] text-black md:text-[11px]">
                  {stat.label}
                </h3>

                <p className="mt-3 max-w-[260px] font-montserrat text-[10px] leading-[1.9] tracking-[0.02em] text-black/45 md:text-[11px]">
                  {stat.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* BOTTOM NOTE */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="font-montserrat text-[9px] leading-[1.8] tracking-[0.04em] text-black/35">
            More than vehicles. A standard of service you can trust.
          </p>

          <span className="font-montserrat text-[9px] uppercase tracking-[0.14em] text-black/40">
            Demo location
          </span>
        </motion.div>
      </div>
    </section>
  );
}