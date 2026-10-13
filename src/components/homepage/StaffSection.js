"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  MoveUpRight,
} from "lucide-react";

const staff = [
  {
    id: 1,
    name: "Team Member One",
    role: "Showroom Manager",
    image: "/images/people/1.webp",
    description:
      "Helping customers find the right vehicle and enjoy a smooth showroom experience.",
  },
  {
    id: 2,
    name: "Team Member Two",
    role: "Sales Consultant",
    image: "/images/people/2.webp",
    description:
      "Guiding customers through vehicle details, available options, and showroom visits.",
  },
  {
    id: 3,
    name: "Team Member Three",
    role: "Vehicle Specialist",
    image: "/images/people/3.jpg",
    description:
      "Helping customers understand vehicle specifications and choose with confidence.",
  },
  {
    id: 4,
    name: "Team Member Four",
    role: "Sales Consultant",
    image: "/images/people/4.webp",
    description:
      "Helping customers explore the inventory and find a vehicle that suits their needs.",
  },
  {
    id: 5,
    name: "Team Member Five",
    role: "Customer Relations",
    image: "/images/people/5.webp",
    description:
      "Making every customer interaction clear, welcoming, and straightforward.",
  },
  
];

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function StaffSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    containScroll: "trimSnaps",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 1024px)": {
        slidesToScroll: 1,
      },
    },
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [snapCount, setSnapCount] = useState(staff.length);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((api) => {
    setSelectedIndex(api.selectedScrollSnap());
    setSnapCount(api.scrollSnapList().length);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative overflow-hidden bg-[#f7f7f5] text-black">
      <div className="mx-auto max-w-[1800px] px-6 py-20 md:px-10 md:py-24 lg:px-14 lg:py-28">
        {/* HEADER */}
        <div className="mb-12 grid grid-cols-1 gap-8 md:mb-16 lg:grid-cols-[1fr_0.65fr] lg:items-end">
          <div>
            <motion.p
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="mb-4 font-montserrat text-[9px] font-medium uppercase tracking-[0.35em] text-black/30 md:text-[10px]"
            >
              The people behind the experience
            </motion.p>

            <motion.h2
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="font-bebas text-[clamp(4.5rem,9vw,9rem)] leading-[0.8] tracking-[-0.04em]"
            >
              GOOD PEOPLE.
              <br />
              GREAT SERVICE.
            </motion.h2>
          </div>

          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="max-w-md lg:justify-self-end"
          >
            <p className="font-montserrat text-[10px] leading-[1.9] tracking-[0.05em] text-black/45 md:text-[11px]">
              Behind every great showroom experience is a team that cares
              about getting the details right. Meet the people ready to help
              you find your next vehicle.
            </p>

            <a
              href="/contact"
              className="group mt-6 inline-flex items-center gap-3 border-b border-black/20 pb-2 font-montserrat text-[9px] font-semibold uppercase tracking-[0.15em] transition-colors hover:border-black md:text-[10px]"
            >
              Meet us at the showroom
              <ArrowUpRight
                size={14}
                strokeWidth={1.4}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </a>
          </motion.div>
        </div>

        {/* CAROUSEL */}
        <div className="relative">
          {/* LEFT NAVIGATION */}
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!emblaApi?.canScrollPrev()}
            aria-label="Previous team members"
            className="absolute left-0 top-[35%] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-black/15 bg-[#f7f7f5] text-black transition-all duration-300 hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-30 md:h-12 md:w-12"
          >
            <ArrowLeft size={17} strokeWidth={1.3} />
          </button>

          {/* RIGHT NAVIGATION */}
          <button
            type="button"
            onClick={scrollNext}
            disabled={!emblaApi?.canScrollNext()}
            aria-label="Next team members"
            className="absolute right-0 top-[35%] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-black/15 bg-[#f7f7f5] text-black transition-all duration-300 hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-30 md:h-12 md:w-12"
          >
            <ArrowRight size={17} strokeWidth={1.3} />
          </button>

          {/* EMBLA VIEWPORT */}
          <div ref={emblaRef} className="overflow-hidden px-12 md:px-14">
            <div className="-ml-4 flex touch-pan-y">
              {staff.map((person, index) => (
                <div
                  key={person.id}
                  className="min-w-0 shrink-0 grow-0 basis-[100%] pl-4 sm:basis-1/2 lg:basis-1/3"
                >
                  <motion.article
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.5,
                      delay: Math.min(index * 0.06, 0.24),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group min-w-0"
                  >
                    {/* PORTRAIT */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#e8e7e3]">
                      <Image
                        src={person.image}
                        alt={person.name}
                        fill
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

                      <span className="absolute left-4 top-4 border border-white/30 bg-black/20 px-3 py-2 font-montserrat text-[8px] uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                        Team / {String(person.id).padStart(2, "0")}
                      </span>

                      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                        <div>
                          <p className="mb-2 font-montserrat text-[8px] uppercase tracking-[0.22em] text-white/70">
                            {person.role}
                          </p>

                          <h3 className="font-bebas text-3xl leading-none tracking-wide text-white md:text-4xl">
                            {person.name}
                          </h3>
                        </div>

                        <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/40 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-black">
                          <MoveUpRight size={15} strokeWidth={1.3} />
                        </span>
                      </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="flex min-h-[100px] items-start justify-between gap-4 border-b border-black/10 py-5">
                      <p className="max-w-sm font-montserrat text-[10px] leading-[1.9] tracking-[0.03em] text-black/45 md:text-[11px]">
                        {person.description}
                      </p>

                      <span className="pt-1 font-montserrat text-[8px] tracking-[0.15em] text-black/25">
                        {String(person.id).padStart(2, "0")}
                      </span>
                    </div>
                  </motion.article>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CAROUSEL FOOTER */}
        <div className="mt-8 flex items-center justify-between gap-6 border-t border-black/10 pt-6">
          <p className="font-montserrat text-[8px] uppercase tracking-[0.2em] text-black/35 md:text-[9px]">
            Demo Auto · Sample team profiles
          </p>

          <div className="flex items-center gap-5">
            {/* PROGRESS */}
            <div
              className="h-px w-16 overflow-hidden bg-black/10 sm:w-28"
              role="progressbar"
              aria-label="Team carousel progress"
              aria-valuemin={1}
              aria-valuemax={Math.max(snapCount, 1)}
              aria-valuenow={selectedIndex + 1}
            >
              <div
                className="h-full bg-black transition-[width] duration-300"
                style={{
                  width: `${((selectedIndex + 1) / Math.max(snapCount, 1)) * 100}%`,
                }}
              />
            </div>

            {/* COUNTER */}
            <p
              className="min-w-[58px] font-montserrat text-[9px] tabular-nums tracking-[0.12em]"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="text-black">
                {String(selectedIndex + 1).padStart(2, "0")}
              </span>
              <span className="mx-1.5 text-black/25">/</span>
              <span className="text-black/35">
                {String(snapCount).padStart(2, "0")}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-black/10" />
    </section>
  );
}


// "use client";

// import Image from "next/image";
// import { motion } from "framer-motion";
// import { ArrowUpRight, MoveUpRight } from "lucide-react";

// const staff = [
//   {
//     id: 1,
//     name: "Team Member One",
//     role: "Showroom Manager",
//     image: "/images/staff/team-1.jpg",
//     description:
//       "Helping customers find the right vehicle and enjoy a smooth showroom experience.",
//   },
//   {
//     id: 2,
//     name: "Team Member Two",
//     role: "Sales Consultant",
//     image: "/images/staff/team-2.jpg",
//     description:
//       "Guiding customers through vehicle details, available options, and showroom visits.",
//   },
//   {
//     id: 3,
//     name: "Team Member Three",
//     role: "Vehicle Specialist",
//     image: "/images/staff/team-3.jpg",
//     description:
//       "Helping customers understand vehicle specifications and choose with confidence.",
//   },
//   {
//     id: 4,
//     name: "Team Member Three",
//     role: "Vehicle Specialist",
//     image: "/images/staff/team-3.jpg",
//     description:
//       "Helping customers understand vehicle specifications and choose with confidence.",
//   },
//   {
//     id: 5,
//     name: "Team Member Three",
//     role: "Vehicle Specialist",
//     image: "/images/staff/team-3.jpg",
//     description:
//       "Helping customers understand vehicle specifications and choose with confidence.",
//   },
//   {
//     id: 6,
//     name: "Team Member Three",
//     role: "Vehicle Specialist",
//     image: "/images/staff/team-3.jpg",
//     description:
//       "Helping customers understand vehicle specifications and choose with confidence.",
//   },
// ];

// export default function StaffSection() {
//   return (
//     <section className="relative overflow-hidden bg-[#f7f7f5] text-black">
//       <div className="mx-auto max-w-[1800px] px-6 py-20 md:px-10 md:py-24 lg:px-14 lg:py-28">
//         {/* HEADER */}
//         <div className="mb-14 grid grid-cols-1 gap-8 lg:mb-16 lg:grid-cols-[1fr_0.65fr] lg:items-end">
//           <div>
//             <motion.p
//               initial={{ opacity: 0, y: 12 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true, amount: 0.4 }}
//               transition={{ duration: 0.45 }}
//               className="mb-4 font-montserrat text-[9px] font-medium uppercase tracking-[0.35em] text-black/30 md:text-[10px]"
//             >
//               The people behind the experience
//             </motion.p>

//             <motion.h2
//               initial={{ opacity: 0, y: 24 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true, amount: 0.4 }}
//               transition={{
//                 duration: 0.6,
//                 ease: [0.22, 1, 0.36, 1],
//               }}
//               className="font-bebas text-[clamp(4.5rem,9vw,9rem)] leading-[0.8] tracking-[-0.04em] text-black"
//             >
//               GOOD PEOPLE.
//               <br />
//               GREAT SERVICE.
//             </motion.h2>
//           </div>

//           <motion.div
//             initial={{ opacity: 0, y: 16 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, amount: 0.4 }}
//             transition={{ duration: 0.5, delay: 0.1 }}
//             className="max-w-md lg:justify-self-end"
//           >
//             <p className="font-montserrat text-[10px] leading-[1.9] tracking-[0.05em] text-black/45 md:text-[11px]">
//               Behind every great showroom experience is a team that cares
//               about getting the details right. Meet the people ready to help
//               you find your next vehicle.
//             </p>

//             <a
//               href="#contact"
//               className="group mt-6 inline-flex items-center gap-3 border-b border-black/20 pb-2 font-montserrat text-[9px] font-semibold uppercase tracking-[0.15em] transition-colors hover:border-black md:text-[10px]"
//             >
//               Meet us at the showroom
//               <ArrowUpRight
//                 size={14}
//                 strokeWidth={1.4}
//                 className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
//               />
//             </a>
//           </motion.div>
//         </div>

//         {/* STAFF GRID */}
//         <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-7">
//           {staff.map((person, index) => (
//             <motion.article
//               key={person.id}
//               initial={{ opacity: 0, y: 28 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true, amount: 0.15 }}
//               transition={{
//                 duration: 0.55,
//                 delay: index * 0.09,
//                 ease: [0.22, 1, 0.36, 1],
//               }}
//               className="group min-w-0"
//             >
//               {/* PORTRAIT */}
//               <div className="relative aspect-[4/5] overflow-hidden bg-[#e8e7e3]">
//                 <Image
//                   src={person.image}
//                   alt={person.name}
//                   fill
//                   sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
//                   className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
//                 />

//                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

//                 <span className="absolute left-4 top-4 border border-white/35 bg-black/20 px-3 py-2 font-montserrat text-[8px] uppercase tracking-[0.2em] text-white backdrop-blur-sm">
//                   Team / {String(person.id).padStart(2, "0")}
//                 </span>

//                 <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
//                   <div>
//                     <p className="mb-2 font-montserrat text-[8px] uppercase tracking-[0.22em] text-white/65">
//                       {person.role}
//                     </p>
//                     <h3 className="font-bebas text-3xl leading-none tracking-wide text-white md:text-4xl">
//                       {person.name}
//                     </h3>
//                   </div>

//                   <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/40 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-black">
//                     <MoveUpRight size={15} strokeWidth={1.3} />
//                   </span>
//                 </div>
//               </div>

//               {/* DESCRIPTION */}
//               <div className="flex items-start justify-between gap-5 border-b border-black/10 py-5">
//                 <p className="max-w-sm font-montserrat text-[10px] leading-[1.9] tracking-[0.03em] text-black/45 md:text-[11px]">
//                   {person.description}
//                 </p>

//                 <span className="pt-1 font-montserrat text-[8px] tracking-[0.15em] text-black/25">
//                   {String(person.id).padStart(2, "0")}
//                 </span>
//               </div>
//             </motion.article>
//           ))}
//         </div>

//         {/* BOTTOM ACCENT */}
//         <div className="mt-12 flex items-center justify-between border-t border-black/10 pt-6">
//           <p className="font-montserrat text-[8px] uppercase tracking-[0.2em] text-black/30 md:text-[9px]">
//             Demo Auto · Sample team profiles
//           </p>

//           <a
//             href="#contact"
//             aria-label="Contact the dealership"
//             className="flex h-10 w-10 items-center justify-center border border-black/15 transition-colors hover:bg-black hover:text-white"
//           >
//             <ArrowUpRight size={15} strokeWidth={1.3} />
//           </a>
//         </div>
//       </div>

//       <div className="h-px w-full bg-black/10" />
//     </section>
//   );
// }