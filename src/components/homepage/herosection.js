
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CarFront,
  ShieldCheck,
} from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/images/cars/car1.jpg",
    eyebrow: "YOUR NEXT CAR STARTS HERE",
    title: "FIND YOUR NEXT DRIVE.",
    description:
      "Explore a carefully selected collection of premium cars, exceptional SUVs, and everyday favorites.",
    cta: "Explore Inventory",
    href: "/cars",
    secondaryCta: "Book a Test Drive",
    secondaryHref: "/test-drive",
    category: "DISCOVER OUR COLLECTION",
  },
  {
    id: 2,
    image: "/images/cars/car2.jpg",
    eyebrow: "DRIVE SOMETHING EXCEPTIONAL",
    title: "QUALITY YOU CAN FEEL.",
    description:
      "Discover vehicles selected for their performance, comfort, and character. Your next journey begins here.",
    cta: "View All Vehicles",
    href: "/cars",
    secondaryCta: "Contact Showroom",
    secondaryHref: "/contact",
    category: "QUALITY MEETS CONFIDENCE",
  },
  {
    id: 3,
    image: "/images/cars/car3.jpg",
    eyebrow: "YOUR JOURNEY. YOUR CHOICE.",
    title: "THE RIGHT CAR. RIGHT HERE.",
    description:
      "From refined sedans to versatile SUVs, find a vehicle that fits your lifestyle and your next adventure.",
    cta: "Find Your Car",
    href: "/cars",
    secondaryCta: "Book a Test Drive",
    secondaryHref: "/test-drive",
    category: "EXPLORE THE POSSIBILITIES",
  },
];

export default function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const handleSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    handleSelect();
    emblaApi.on("select", handleSelect);

    return () => {
      emblaApi.off("select", handleSelect);
    };
  }, [emblaApi]);

  const activeSlide = slides[selectedIndex];

  return (
    <section
      aria-label="Discover our vehicle inventory"
      className="relative h-[720px] min-h-[650px] w-full overflow-hidden bg-[#171717] text-white md:h-[88svh] md:min-h-[680px] md:max-h-[1000px]"
    >
      {/* BACKGROUND CAROUSEL */}

      <div ref={emblaRef} className="absolute inset-0 overflow-hidden">
        <div className="flex h-full">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="relative h-full min-w-0 flex-[0_0_100%]"
            >
              <Image
                src={slide.image}
                alt={`${slide.category} — featured vehicle`}
                fill
                priority={slide.id === 1}
                sizes="100vw"
                className="object-cover object-center"
              />

              <div className="absolute inset-0 bg-black/30" />

              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
            </div>
          ))}
        </div>
      </div>

      {/* HERO CONTENT */}

      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="mx-auto flex h-full max-w-[1600px] items-center px-5 pb-20 pt-16 sm:px-8 md:px-12 lg:px-16">
          <div className="pointer-events-auto w-full max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.09 },
                  },
                  exit: {
                    transition: { duration: 0.12 },
                  },
                }}
                className="flex flex-col items-start"
              >
                {/* EYEBROW */}

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -8 },
                  }}
                  transition={{ duration: 0.35 }}
                  className="mb-6 flex items-center gap-3"
                >
                  <span className="h-px w-9 bg-white/80" />

                  <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-white/80 sm:text-xs">
                    {activeSlide.eyebrow}
                  </p>
                </motion.div>

                {/* MAIN HEADLINE */}

                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 25 },
                    visible: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -15 },
                  }}
                  transition={{
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="max-w-4xl text-left font-bebas text-[clamp(3.8rem,9vw,7.8rem)] leading-[0.88] tracking-[-0.025em]"
                >
                  {activeSlide.title}
                </motion.h1>

                {/* DESCRIPTION */}

                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: { opacity: 1, y: 0 },
                    exit: { opacity: 0 },
                  }}
                  transition={{ duration: 0.4 }}
                  className="mt-6 max-w-xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8"
                >
                  {activeSlide.description}
                </motion.p>

                {/* CALLS TO ACTION */}

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0 },
                    exit: { opacity: 0 },
                  }}
                  transition={{ duration: 0.4 }}
                  className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
                >
                  <Link
                    href={activeSlide.href}
                    className="group inline-flex min-h-14 items-center justify-center gap-5 bg-white px-6 text-sm font-semibold text-[#171717] transition-colors duration-300 hover:bg-[#e9e8e4]"
                  >
                    <CarFront size={19} strokeWidth={1.7} />

                    {activeSlide.cta}

                    <ArrowUpRight
                      size={17}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>

                  <Link
                    href={activeSlide.secondaryHref}
                    className="group inline-flex min-h-14 items-center justify-center gap-3 border border-white/40 bg-white/[0.04] px-6 text-sm font-medium text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white/10"
                  >
                    {activeSlide.secondaryCta}

                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </motion.div>

                {/* TRUST INDICATORS */}

                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                    exit: { opacity: 0 },
                  }}
                  transition={{ duration: 0.4 }}
                  className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/20 pt-5"
                >
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <ShieldCheck size={16} strokeWidth={1.5} />
                    A Showroom You Can Trust
                  </div>

                  <span className="hidden h-1 w-1 rounded-full bg-white/50 sm:block" />

                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <CarFront size={16} strokeWidth={1.5} />
                    Explore Available Vehicles
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* BOTTOM CONTROLS */}

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between border-t border-white/15 px-5 py-5 sm:px-8 md:px-12 lg:px-16">
            {/* SLIDE PROGRESS */}

            <div className="flex items-center gap-4">
              <span className="min-w-5 text-xs font-medium tabular-nums text-white">
                {String(selectedIndex + 1).padStart(2, "0")}
              </span>

              <div className="h-px w-16 overflow-hidden bg-white/30 sm:w-28">
                <motion.div
                  className="h-full bg-white"
                  animate={{
                    width: `${((selectedIndex + 1) / slides.length) * 100}%`,
                  }}
                  transition={{ duration: 0.35 }}
                />
              </div>

              <span className="text-xs tabular-nums text-white/45">
                {String(slides.length).padStart(2, "0")}
              </span>

              <span className="ml-2 hidden text-[10px] uppercase tracking-[0.18em] text-white/55 sm:inline">
                {activeSlide.category}
              </span>
            </div>

            {/* PREVIOUS / NEXT */}

            <div className="pointer-events-auto flex items-center gap-2">
              <button
                type="button"
                onClick={scrollPrev}
                aria-label="Previous vehicle slide"
                className="flex h-11 w-11 items-center justify-center border border-white/25 text-white transition-colors hover:bg-white hover:text-[#171717] active:scale-95"
              >
                <ArrowLeft size={18} strokeWidth={1.6} />
              </button>

              <button
                type="button"
                onClick={scrollNext}
                aria-label="Next vehicle slide"
                className="flex h-11 w-11 items-center justify-center border border-white/25 text-white transition-colors hover:bg-white hover:text-[#171717] active:scale-95"
              >
                <ArrowRight size={18} strokeWidth={1.6} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useCallback, useEffect, useState } from "react";
// import useEmblaCarousel from "embla-carousel-react";
// import { AnimatePresence, motion } from "framer-motion";
// import { ArrowLeft, ArrowRight } from "lucide-react";

// const slides = [
//   {
//     id: 1,
//     image: "/images/cars/car1.jpg",
//     eyebrow: "2025 BMW",
//     title: "M4 Competition",
//     cta: "Explore Vehicle",
//     href: "/cars",
//   },
//   {
//     id: 2,
//     image: "/images/cars/car2.jpg",
//     eyebrow: "2024 Porsche",
//     title: "911 Carrera",
//     cta: "Explore Vehicle",
//     href: "/cars",
//   },
//   {
//     id: 3,
//     image: "/images/cars/car3.jpg",
//     eyebrow: "2025 Mercedes-Benz",
//     title: "G63 AMG",
//     cta: "Explore Vehicle",
//     href: "/cars",
//   },
// ];

// export default function HeroSection() {
//   const [emblaRef, emblaApi] = useEmblaCarousel({
//     loop: true,
//     align: "start",
//   });

//   const [selectedIndex, setSelectedIndex] = useState(0);

//   const scrollPrev = useCallback(() => {
//     if (!emblaApi) return;

//     emblaApi.scrollPrev();
//   }, [emblaApi]);

//   const scrollNext = useCallback(() => {
//     if (!emblaApi) return;

//     emblaApi.scrollNext();
//   }, [emblaApi]);

//   useEffect(() => {
//     if (!emblaApi) return;

//     const handleSelect = () => {
//       setSelectedIndex(emblaApi.selectedScrollSnap());
//     };

//     handleSelect();

//     emblaApi.on("select", handleSelect);

//     return () => {
//       emblaApi.off("select", handleSelect);
//     };
//   }, [emblaApi]);

//   const activeSlide = slides[selectedIndex];

//   return (
//     <section className="relative md:h-[100dvh] h-[70vh] md:min-h-[650px] w-full overflow-hidden bg-[#181818] text-white">
//       {/* ==================== SLIDER ==================== */}
//       <div ref={emblaRef} className="h-full overflow-hidden">
//         <div className="flex h-full">
//           {slides.map((slide) => (
//             <div
//               key={slide.id}
//               className="relative h-full min-w-0 flex-[0_0_100%]"
//             >
//               <Image
//                 src={slide.image}
//                 alt={slide.title}
//                 fill
//                 priority={slide.id === 1}
//                 sizes="100vw"
//                 className="object-cover"
//               />

//               {/* Main overlay */}
//               <div className="absolute inset-0 bg-black/25" />

//               {/* Bottom gradient */}
//               <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

//               {/* Top subtle gradient */}
//               <div className="absolute inset-x-0 top-0 h-[25%] bg-gradient-to-b from-black/25 to-transparent" />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ==================== CONTENT ==================== */}
//       <div className="pointer-events-none absolute inset-0 z-10">
//         {/* ==================== LEFT + VERTICAL CENTER ==================== */}
//         <div className="absolute inset-0">
//           <div className="mx-auto flex h-full max-w-7xl items-center px-5 md:px-8">
//             <div className="pointer-events-auto w-full max-w-4xl">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={activeSlide.id}
//                   initial="hidden"
//                   animate="visible"
//                   exit="exit"
//                   className="flex flex-col items-start"
//                 >
//                   {/* ==================== EYEBROW ==================== */}
//                   <motion.p
//                     className="mb-4 overflow-hidden text-xs font-medium uppercase tracking-[0.28em] text-white/65 md:text-sm"
//                     aria-label={activeSlide.eyebrow}
//                   >
//                     {Array.from(activeSlide.eyebrow).map(
//                       (character, index) => (
//                         <motion.span
//                           key={`${activeSlide.id}-eyebrow-${index}`}
//                           initial={{
//                             opacity: 0,
//                             y: 8,
//                           }}
//                           animate={{
//                             opacity: 1,
//                             y: 0,
//                           }}
//                           exit={{
//                             opacity: 0,
//                             y: -8,
//                           }}
//                           transition={{
//                             duration: 0.16,
//                             delay: index * 0.018,
//                             ease: "easeOut",
//                           }}
//                           className="inline-block"
//                         >
//                           {character === " " ? "\u00A0" : character}
//                         </motion.span>
//                       )
//                     )}
//                   </motion.p>

//                   {/* ==================== MAIN TITLE ==================== */}
//                   <motion.h1
//                     initial={{
//                       opacity: 0,
//                       x: -70,
//                     }}
//                     animate={{
//                       opacity: 1,
//                       x: 0,
//                     }}
//                     exit={{
//                       opacity: 0,
//                       x: -30,
//                     }}
//                     transition={{
//                       duration: 0.32,
//                       delay: 0.2,
//                       ease: [0.22, 1, 0.36, 1],
//                     }}
//                     className="max-w-4xl text-left text-5xl  font-bebas leading-[0.9] tracking-[-0.055em] sm:text-6xl md:text-8xl lg:text-[clamp(5rem,8vw,8rem)]"
//                   >
//                     {activeSlide.title}
//                   </motion.h1>

//                   {/* ==================== CTA ==================== */}
//                   <motion.div
//                     initial={{
//                       opacity: 0,
//                       scale: 0.82,
//                     }}
//                     animate={{
//                       opacity: 1,
//                       scale: 1,
//                     }}
//                     exit={{
//                       opacity: 0,
//                       scale: 0.92,
//                     }}
//                     transition={{
//                       duration: 0.28,
//                       delay: 0.32,
//                       ease: [0.22, 1, 0.36, 1],
//                     }}
//                     className="mt-7"
//                   >
//                     <Link
//                       href={activeSlide.href}
//                       className="group inline-flex font-montserrat items-center  gap-3  bg-white px-6 py-3.5 text-md font-medium  text-[#181818] transition-all duration-300 hover:gap-4 hover:bg-white/80 active:scale-95"
//                     >
//                       {activeSlide.cta}

//                       <ArrowRight
//                         size={16}
//                         strokeWidth={2}
//                         className="transition-transform duration-300 group-hover:translate-x-1"
//                       />
//                     </Link>
//                   </motion.div>
//                 </motion.div>
//               </AnimatePresence>
//             </div>
//           </div>
//         </div>

//         {/* ==================== PERMANENT PROGRESS ==================== */}
//         <div className="absolute bottom-[20px] left-5 md:bottom-24 md:left-8">
//           <div className="flex items-center gap-3">
//             <motion.span
//               key={selectedIndex}
//               initial={{ opacity: 0.5 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.2 }}
//               className="text-xs font-medium text-white"
//             >
//               {String(selectedIndex + 1).padStart(2, "0")}
//             </motion.span>

//             <div className="h-px w-20 overflow-hidden bg-white/25 md:w-28">
//               <motion.div
//                 className="h-full bg-white"
//                 animate={{
//                   width: `${
//                     ((selectedIndex + 1) / slides.length) * 100
//                   }%`,
//                 }}
//                 transition={{
//                   duration: 0.45,
//                   ease: "easeOut",
//                 }}
//               />
//             </div>

//             <span className="text-xs font-medium text-white/40">
//               {String(slides.length).padStart(2, "0")}
//             </span>
//           </div>
//         </div>

//         {/* ==================== ARROWS ==================== */}
//         <div className="pointer-events-auto absolute bottom-[20px] right-5 flex items-center gap-2 md:bottom-24 md:right-8">
//           <button
//             type="button"
//             onClick={scrollPrev}
//             aria-label="Previous slide"
//             className="flex h-11 w-11 items-center justify-center  border border-white/20 text-white transition-all duration-300 hover:bg-white hover:text-[#181818] active:scale-95"
//           >
//             <ArrowLeft size={18} strokeWidth={1.8} />
//           </button>

//           <button
//             type="button"
//             onClick={scrollNext}
//             aria-label="Next slide"
//             className="flex h-11 w-11 items-center justify-center  border border-white/20 text-white transition-all duration-300 hover:bg-white hover:text-[#181818] active:scale-95"
//           >
//             <ArrowRight size={18} strokeWidth={1.8} />
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }
