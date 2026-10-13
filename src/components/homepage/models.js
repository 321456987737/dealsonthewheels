
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const vehicleCategories = [
  {
    id: 1,
    name: "Sports Cars",
    slug: "sports",
    image: "/images/categories/sports.png",
    description: "Performance",
  },
  {
    id: 2,
    name: "SUVs",
    slug: "suv",
    image: "/images/categories/suv.png",
    description: "Versatility",
  },
  {
    id: 3,
    name: "Sedans",
    slug: "sedan",
    image: "/images/categories/sedan.png",
    description: "Refinement",
  },
  {
    id: 4,
    name: "Coupes",
    slug: "coupe",
    image: "/images/categories/coupes.png",
    description: "Character",
  },
  {
    id: 5,
    name: "Convertibles",
    slug: "convertible",
    image: "/images/categories/convertible.png",
    description: "Open-air driving",
  },
];

export default function ModelsSection() {
  // Duplicate the categories for a seamless marquee loop.
  const marqueeItems = [...vehicleCategories, ...vehicleCategories];

  return (
    <section className="overflow-hidden bg-[#181818] py-16 text-white md:py-24 lg:py-28">
      {/* SECTION HEADER */}
      <div className="mx-auto mb-12 max-w-[1800px] px-6 md:mb-16 md:px-10 lg:px-14">
        <div className="flex flex-col justify-between gap-6 border-b border-white/15 pb-8 md:flex-row md:items-end md:pb-10">
          <div>
            <p className="mb-4 font-montserrat text-[9px] uppercase tracking-[0.35em] text-white/40 md:text-[10px]">
              Find your drive
            </p>

            <h2 className="font-bebas text-5xl leading-none tracking-tight md:text-7xl lg:text-8xl">
              EXPLORE BY CATEGORY
            </h2>
          </div>

          <p className="max-w-xs font-montserrat text-[10px] leading-6 tracking-wide text-white/45 md:text-right md:text-[11px]">
            Discover a collection of vehicles designed for every kind of
            driving experience.
          </p>
        </div>
      </div>

      {/* LEFT-TO-RIGHT MARQUEE */}
      <div
        className="group relative overflow-hidden"
        aria-label="Explore vehicle categories"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#181818] to-transparent md:w-32" />

        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#181818] to-transparent md:w-32" />

        <div className="vehicle-marquee flex w-max">
          {marqueeItems.map((item, index) => (
            <Link
              key={`${item.id}-${index}`}
              href={`/models/${item.slug}`}
              aria-hidden={index >= vehicleCategories.length}
              tabIndex={index >= vehicleCategories.length ? -1 : undefined}
              className="group/card relative mx-3 block w-[260px] shrink-0 md:mx-5 md:w-[380px] lg:w-[440px]"
            >
              {/* IMAGE */}
              <div className="relative flex h-[210px] items-center justify-center overflow-hidden border border-white/10 bg-white/[0.025] transition-colors duration-500 group-hover/card:border-white/30 md:h-[290px] lg:h-[340px]">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={900}
                  height={600}
                  sizes="(max-width: 768px) 260px, (max-width: 1024px) 380px, 440px"
                  className="h-full w-full object-contain p-5 transition-transform duration-700 ease-out group-hover/card:scale-105 md:p-8"
                />

                <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/20 transition-colors duration-300 group-hover/card:bg-white group-hover/card:text-black md:right-5 md:top-5">
                  <ArrowUpRight size={15} strokeWidth={1.3} />
                </span>
              </div>

              {/* CATEGORY INFO */}
              <div className="flex items-center justify-between border-b border-white/15 py-5 md:py-6">
                <div>
                  <p className="mb-2 font-montserrat text-[8px] uppercase tracking-[0.25em] text-white/35 md:text-[9px]">
                    0{item.id} / {item.description}
                  </p>

                  <h3 className="font-bebas text-3xl tracking-wide md:text-4xl">
                    {item.name}
                  </h3>
                </div>

                <span className="font-montserrat text-[9px] uppercase tracking-[0.18em] text-white/40 transition-colors duration-300 group-hover/card:text-white">
                  Discover
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* MARQUEE ANIMATION */}
      <style jsx>{`
        .vehicle-marquee {
          animation: marquee-right 45s linear infinite;
          will-change: transform;
        }

        .group:hover .vehicle-marquee {
          animation-play-state: paused;
        }

        @keyframes marquee-right {
          from {
            transform: translateX(-50%);
          }

          to {
            transform: translateX(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vehicle-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { ArrowUpRight } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";
// import { useState } from "react";

// const vehicleCategories = [
//   {
//     id: 1,
//     name: "Sports Cars",
//     slug: "sports",
//     brand: "Porsche",
//     category: "Sports",
//     image: "/images/categories/sports.png",
//     description:
//       "Engineered for exhilarating performance, sharp handling and an unmistakable presence.",
//   },
//   {
//     id: 2,
//     name: "SUVs",
//     slug: "suv",
//     brand: "Porsche",
//     category: "SUV",
//     image: "/images/categories/suv.png",
//     description:
//       "Commanding design, refined comfort and versatile performance for every journey.",
//   },
//   {
//     id: 3,
//     name: "Sedans",
//     slug: "sedan",
//     brand: "Porsche",
//     category: "Sedan",
//     image: "/images/categories/sedan.png",
//     description:
//       "A sophisticated balance of luxury, comfort and effortless performance.",
//   },
//   {
//     id: 4,
//     name: "Coupes",
//     slug: "coupe",
//     brand: "Porsche",
//     category: "Coupe",
//     image: "/images/categories/coupes.png",
//     description:
//       "Distinctive proportions and dynamic performance crafted for the enthusiast.",
//   },
//   {
//     id: 5,
//     name: "Convertibles",
//     slug: "convertible",
//     brand: "Porsche",
//     category: "Convertible",
//     image: "/images/categories/convertible.png",
//     description:
//       "Open-air driving paired with elegant design and exhilarating performance.",
//   },
// ];
// export default function ModelsSection() {
//   const [activeModel, setActiveModel] = useState(0);

//   const model = vehicleCategories[activeModel];

//   return (
//     <section className="relative overflow-hidden bg-[#181818] text-white">
//       {/* ======================================================
//           01 — MODEL NAVIGATION
//       ====================================================== */}

//       <div className="border-b border-white/60">
//         <div className="mx-auto flex max-w-[1800px] justify-center overflow-x-auto px-6 py-7 md:px-10 md:py-9 lg:px-14 lg:py-10">
//           <div className="flex min-w-max items-center justify-center gap-7 md:gap-10 lg:gap-14">
//             {vehicleCategories.map((item, index) => {
//               const isActive = index === activeModel;

//               return (
//                 <button
//                   key={item.id}
//                   type="button"
//                   onClick={() => setActiveModel(index)}
//                   className="group relative cursor-pointer whitespace-nowrap font-montserrat text-[9px] font-medium uppercase tracking-[0.16em] text-white/45 transition-colors duration-300 hover:text-white/80 md:text-[10px]"
//                 >
//                   {item.name}

//                   <motion.span
//                     initial={false}
//                     animate={{
//                       scaleX: isActive ? 1 : 0,
//                       opacity: isActive ? 1 : 0,
//                     }}
//                     transition={{
//                       duration: 0.3,
//                       ease: [0.22, 1, 0.36, 1],
//                     }}
//                     className="absolute -bottom-3 left-0 h-px w-full origin-left bg-white md:-bottom-4"
//                   />
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* ======================================================
//           02 — MODEL SHOWCASE
//       ====================================================== */}

//       <div className="mx-auto max-w-[1800px] px-6 md:px-10 lg:px-14">
//         <div className="grid md:min-h-[72vh] min-h-[65vh] grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">
//           {/* ==================================================
//               LEFT CONTENT
//           ================================================== */}

//           <div className="flex flex-col justify-center py-8 md:py-20 lg:pr-14 xl:pr-20">
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={model.id}
//                 initial={{
//                   opacity: 0,
//                   x: -35,
//                 }}
//                 animate={{
//                   opacity: 1,
//                   x: 0,
//                 }}
//                 exit={{
//                   opacity: 0,
//                   x: -20,
//                 }}
//                 transition={{
//                   duration: 0.45,
//                   ease: [0.22, 1, 0.36, 1],
//                 }}
//               >
//                 {/* CATEGORY */}

//                 <p className="mb-5 font-montserrat text-[9px] font-medium uppercase tracking-[0.32em] text-white/35 md:mb-6 md:text-[10px]">
//                   {model.category}
//                 </p>

//                 {/* BRAND */}

//                 <p className="mb-2 font-montserrat text-[10px] font-medium uppercase tracking-[0.28em] text-white/45 md:text-[11px]">
//                   {model.brand}
//                 </p>

//                 {/* MODEL NAME */}

//                 <h2 className="font-bebas text-[clamp(4.5rem,8vw,8rem)] leading-[0.8] tracking-[-0.045em] text-white">
//                   {model.name}
//                 </h2>

//                 {/* CTA AREA */}

//                 <div className="mt-9 flex flex-wrap items-center gap-3 md:mt-11 md:gap-4">
//                   <Link
//                     href={`/models/${model.id}`}
//                     className="group inline-flex items-center gap-3 border border-white bg-white px-6 py-3.5 font-montserrat text-[9px] font-medium uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-transparent hover:text-white md:px-7 md:py-4"
//                   >
//                     Explore models

//                     <ArrowUpRight
//                       size={14}
//                       strokeWidth={1.3}
//                       className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
//                     />
//                   </Link>

//                   <Link
//                     href={`/contact?model=${model.id}`}
//                     className="group inline-flex items-center gap-3 border border-white/20 px-6 py-3.5 font-montserrat text-[9px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-white md:px-7 md:py-4"
//                   >
//                     Enquire

//                     <ArrowUpRight
//                       size={14}
//                       strokeWidth={1.3}
//                       className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
//                     />
//                   </Link>
//                 </div>
//               </motion.div>
//             </AnimatePresence>
//           </div>

//           {/* ==================================================
//               RIGHT IMAGE
//           ================================================== */}

//           <div className="relative flex min-h-[10vh]  items-center justify-center overflow-hidden lg:min-h-0 max-h-[70vh]">
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={model.id}
//                 initial={{
//                   opacity: 0,
//                   x: 45,
//                   scale: 0.96,
//                 }}
//                 animate={{
//                   opacity: 1,
//                   x: 0,
//                   scale: 1,
//                 }}
//                 exit={{
//                   opacity: 0,
//                   x: -25,
//                   scale: 0.98,
//                 }}
//                 transition={{
//                   duration: 0.6,
//                   ease: [0.22, 1, 0.36, 1],
//                 }}
//                 className="relative flex h-full w-full items-center justify-center "
//               >
//                 {/* SUBTLE FLOOR SHADOW */}

//                 <div className="pointer-events-none absolute bottom-[12%] left-1/2 h-[2px] w-[62%] -translate-x-1/2 bg-white/10 blur-md" />

//                 <Image
//                   src={model.image}
//                   alt={model.name}
//                   width={1800}
//                   height={1100}
//                   priority={activeModel === 0}
//                   sizes="(max-width: 1024px) 100vw, 60vw"
//                   className="relative z-10 md:h-auto h-[20vh]  w-[92%] object-contain md:w-[85%] lg:w-[100%] "
//                 />
//               </motion.div>
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>

//       {/* ======================================================
//           03 — MODEL DESCRIPTION
//       ====================================================== */}

//       <div className="border-t border-white/10">
//         <div className="mx-auto max-w-[1800px] px-6 md:px-10 lg:px-14">
//           <div className="flex justify-center py-10 md:py-12 lg:py-14">
//             <AnimatePresence mode="wait">
//               <motion.p
//                 key={model.id}
//                 initial={{
//                   opacity: 0,
//                   y: 12,
//                 }}
//                 animate={{
//                   opacity: 1,
//                   y: 0,
//                 }}
//                 exit={{
//                   opacity: 0,
//                   y: -10,
//                 }}
//                 transition={{
//                   duration: 0.35,
//                   ease: [0.22, 1, 0.36, 1],
//                 }}
//                 className="max-w-2xl text-center font-montserrat text-[10px] leading-[1.8] tracking-[0.08em] text-white/35 md:text-[11px] md:leading-[1.9]"
//               >
//                 {model.description}
//               </motion.p>
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }