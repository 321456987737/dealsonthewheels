
"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Quote, Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Ahmed M.",
    location: "Doha, Qatar",
    date: "Customer review",
    rating: 5,
    text: "A professional and straightforward experience. The team was helpful, answered my questions clearly, and made the entire process comfortable.",
    vehicle: "Vehicle purchase",
  },
  {
    id: 2,
    name: "Mohammed A.",
    location: "Doha, Qatar",
    date: "Customer review",
    rating: 5,
    text: "The showroom had a great selection of vehicles. I appreciated the attention to detail and the time taken to explain everything.",
    vehicle: "Showroom experience",
  },
  {
    id: 3,
    name: "Khalid R.",
    location: "Qatar",
    date: "Customer review",
    rating: 5,
    text: "A smooth experience from the first conversation to the showroom visit. Communication was clear and the team was easy to deal with.",
    vehicle: "Customer service",
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

export default function ReviewsSection() {
  return (
    <section className="relative overflow-hidden bg-white text-black">
      <div className="mx-auto max-w-[1800px] px-6 py-20 md:px-10 md:py-24 lg:px-14 lg:py-28">
        {/* HEADER */}
        <div className="mb-14 flex flex-col justify-between gap-8 md:mb-16 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <motion.p
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="mb-4 font-montserrat text-[9px] font-medium uppercase tracking-[0.35em] text-black/30 md:text-[10px]"
            >
              The customer experience
            </motion.p>

            <motion.h2
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="font-bebas text-[clamp(4.5rem,9vw,9rem)] leading-[0.8] tracking-[-0.04em] text-black"
            >
              WORDS THAT
              <br />
              SPEAK FOR US.
            </motion.h2>

            <motion.p
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="mt-6 max-w-md font-montserrat text-[10px] leading-[1.9] tracking-[0.04em] text-black/40 md:text-[11px]"
            >
              Buying a car is a personal decision. We believe the experience
              should be just as good as the vehicle you drive home.
            </motion.p>
          </div>

          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group inline-flex w-fit items-center gap-3 border-b border-black/20 pb-2 font-montserrat text-[9px] font-semibold uppercase tracking-[0.16em] transition-colors hover:border-black md:text-[10px]"
          >
            Talk to our team
            <ArrowUpRight
              size={14}
              strokeWidth={1.4}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </motion.a>
        </div>

        {/* REVIEW CARDS */}
        <div className="grid grid-cols-1 border-l border-t border-black/10 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.article
              key={review.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.55,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group flex min-h-[310px] flex-col border-b border-r border-black/10 p-6 transition-colors duration-300 hover:bg-[#f7f7f5] md:min-h-[340px] md:p-8 lg:p-9"
            >
              <div className="mb-8 flex items-center justify-between">
                <Quote
                  size={25}
                  strokeWidth={1}
                  className="text-black/20 transition-colors group-hover:text-black"
                />

                <div
                  className="flex gap-1"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {Array.from({ length: review.rating }, (_, i) => (
                    <Star
                      key={i}
                      size={12}
                      strokeWidth={1.2}
                      className="fill-black text-black"
                    />
                  ))}
                </div>
              </div>

              <p className="flex-1 font-montserrat text-[11px] leading-[2] tracking-[0.02em] text-black/65 md:text-xs">
                “{review.text}”
              </p>

              <div className="mt-9 border-t border-black/10 pt-5">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h3 className="font-montserrat text-[11px] font-semibold uppercase tracking-[0.08em]">
                      {review.name}
                    </h3>
                    <p className="mt-2 font-montserrat text-[9px] tracking-[0.08em] text-black/35">
                      {review.location}
                    </p>
                  </div>

                  <span className="text-right font-montserrat text-[8px] uppercase tracking-[0.1em] text-black/30">
                    {review.vehicle}
                  </span>
                </div>
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
            Every customer interaction is an opportunity to do better.
          </p>

          <a
            href="#contact"
            className="group inline-flex w-fit items-center gap-2 font-montserrat text-[9px] font-semibold uppercase tracking-[0.14em] hover:text-black/55"
          >
            Get in touch
            <ArrowUpRight
              size={13}
              strokeWidth={1.4}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </a>
        </motion.div>
      </div>

      <div className="h-px w-full bg-black/10" />
    </section>
  );
}
