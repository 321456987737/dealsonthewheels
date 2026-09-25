
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/images/cars/car1.jpg",
    eyebrow: "2025 BMW",
    title: "M4 Competition",
    cta: "Explore Vehicle",
    href: "/cars",
  },
  {
    id: 2,
    image: "/images/cars/car2.jpg",
    eyebrow: "2024 Porsche",
    title: "911 Carrera",
    cta: "Explore Vehicle",
    href: "/cars",
  },
  {
    id: 3,
    image: "/images/cars/car3.jpg",
    eyebrow: "2025 Mercedes-Benz",
    title: "G63 AMG",
    cta: "Explore Vehicle",
    href: "/cars",
  },
];

export default function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
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
    <section className="relative h-[100dvh] min-h-[650px] w-full overflow-hidden bg-[#181818] text-white">
      {/* ==================== SLIDER ==================== */}
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="relative h-full min-w-0 flex-[0_0_100%]"
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={slide.id === 1}
                sizes="100vw"
                className="object-cover"
              />

              {/* Main overlay */}
              <div className="absolute inset-0 bg-black/25" />

              {/* Bottom gradient */}
              <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

              {/* Top subtle gradient */}
              <div className="absolute inset-x-0 top-0 h-[25%] bg-gradient-to-b from-black/25 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* ==================== CONTENT ==================== */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {/* ==================== LEFT + VERTICAL CENTER ==================== */}
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-7xl items-center px-5 md:px-8">
            <div className="pointer-events-auto w-full max-w-4xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col items-start"
                >
                  {/* ==================== EYEBROW ==================== */}
                  <motion.p
                    className="mb-4 overflow-hidden text-xs font-medium uppercase tracking-[0.28em] text-white/65 md:text-sm"
                    aria-label={activeSlide.eyebrow}
                  >
                    {Array.from(activeSlide.eyebrow).map(
                      (character, index) => (
                        <motion.span
                          key={`${activeSlide.id}-eyebrow-${index}`}
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
                            duration: 0.16,
                            delay: index * 0.018,
                            ease: "easeOut",
                          }}
                          className="inline-block"
                        >
                          {character === " " ? "\u00A0" : character}
                        </motion.span>
                      )
                    )}
                  </motion.p>

                  {/* ==================== MAIN TITLE ==================== */}
                  <motion.h1
                    initial={{
                      opacity: 0,
                      x: -70,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: -30,
                    }}
                    transition={{
                      duration: 0.32,
                      delay: 0.2,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="max-w-4xl text-left text-5xl  font-bebas leading-[0.9] tracking-[-0.055em] sm:text-6xl md:text-8xl lg:text-[clamp(5rem,8vw,8rem)]"
                  >
                    {activeSlide.title}
                  </motion.h1>

                  {/* ==================== CTA ==================== */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.82,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.92,
                    }}
                    transition={{
                      duration: 0.28,
                      delay: 0.32,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mt-7"
                  >
                    <Link
                      href={activeSlide.href}
                      className="group inline-flex font-montserrat items-center  gap-3  bg-white px-6 py-3.5 text-md font-medium  text-[#181818] transition-all duration-300 hover:gap-4 hover:bg-white/80 active:scale-95"
                    >
                      {activeSlide.cta}

                      <ArrowRight
                        size={16}
                        strokeWidth={2}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </Link>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ==================== PERMANENT PROGRESS ==================== */}
        <div className="absolute bottom-[120px] left-5 md:bottom-24 md:left-8">
          <div className="flex items-center gap-3">
            <motion.span
              key={selectedIndex}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-xs font-medium text-white"
            >
              {String(selectedIndex + 1).padStart(2, "0")}
            </motion.span>

            <div className="h-px w-20 overflow-hidden bg-white/25 md:w-28">
              <motion.div
                className="h-full bg-white"
                animate={{
                  width: `${
                    ((selectedIndex + 1) / slides.length) * 100
                  }%`,
                }}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                }}
              />
            </div>

            <span className="text-xs font-medium text-white/40">
              {String(slides.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* ==================== ARROWS ==================== */}
        <div className="pointer-events-auto absolute bottom-[120px] right-5 flex items-center gap-2 md:bottom-24 md:right-8">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous slide"
            className="flex h-11 w-11 items-center justify-center  border border-white/20 text-white transition-all duration-300 hover:bg-white hover:text-[#181818] active:scale-95"
          >
            <ArrowLeft size={18} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next slide"
            className="flex h-11 w-11 items-center justify-center  border border-white/20 text-white transition-all duration-300 hover:bg-white hover:text-[#181818] active:scale-95"
          >
            <ArrowRight size={18} strokeWidth={1.8} />
          </button>
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
//     <section className="relative h-[100dvh] min-h-[650px] w-full overflow-hidden bg-[#181818] text-white">
//       {/* ==================== SLIDER ==================== */}
//       <div ref={emblaRef} className="h-full overflow-hidden">
//         <div className="flex h-full">
//           {slides.map((slide) => (
//             <div
//               key={slide.id}
//               className="relative min-w-0 flex-[0_0_100%] h-full"
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

//       {/* ==================== CONTENT ==================== */}
//       <div className="pointer-events-none absolute inset-0 z-10">
//         <div className="mx-auto flex h-full max-w-7xl items-end px-5 pb-[120px] md:px-8 md:pb-24">
//           <div className="flex w-full items-end justify-between gap-8">
//             {/* Left Content */}
//             <div className="pointer-events-auto max-w-4xl">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={activeSlide.id}
//                   initial="hidden"
//                   animate="visible"
//                   exit="exit"
//                 >
//                   {/* Eyebrow */}
//                   <motion.p
//                     className="mb-3 overflow-hidden text-xs font-medium uppercase tracking-[0.28em] text-white/65 md:text-sm"
//                     aria-label={activeSlide.eyebrow}
//                   >
//                     {Array.from(activeSlide.eyebrow).map((character, index) => (
//                       <motion.span
//                         key={`${activeSlide.id}-eyebrow-${index}`}
//                         initial={{
//                           opacity: 0,
//                           y: 8,
//                         }}
//                         animate={{
//                           opacity: 1,
//                           y: 0,
//                         }}
//                         exit={{
//                           opacity: 0,
//                           y: -8,
//                         }}
//                         transition={{
//                           duration: 0.16,
//                           delay: index * 0.018,
//                           ease: "easeOut",
//                         }}
//                         className="inline-block"
//                       >
//                         {character === " " ? "\u00A0" : character}
//                       </motion.span>
//                     ))}
//                   </motion.p>

//                   {/* Large title */}
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
//                     className="max-w-4xl text-5xl font-semibold leading-[0.9] tracking-[-0.055em] sm:text-6xl md:text-8xl lg:text-[clamp(5rem,8vw,8rem)]"
//                   >
//                     {activeSlide.title}
//                   </motion.h1>

//                   {/* CTA */}
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
//                       delay: 0.42,
//                       ease: [0.22, 1, 0.36, 1],
//                     }}
//                     className="mt-7"
//                   >
//                     <Link
//                       href={activeSlide.href}
//                       className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-[#181818] transition-all duration-300 hover:gap-4 hover:bg-white/90 active:scale-95"
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

//               {/* ==================== PERMANENT PROGRESS ==================== */}
//               <div className="mt-7 flex items-center gap-3">
//                 <motion.span
//                   key={selectedIndex}
//                   initial={{ opacity: 0.5 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.2 }}
//                   className="text-xs font-medium text-white"
//                 >
//                   {String(selectedIndex + 1).padStart(2, "0")}
//                 </motion.span>

//                 <div className="h-px w-20 overflow-hidden bg-white/25 md:w-28">
//                   <motion.div
//                     className="h-full bg-white"
//                     animate={{
//                       width: `${((selectedIndex + 1) / slides.length) * 100}%`,
//                     }}
//                     transition={{
//                       duration: 0.45,
//                       ease: "easeOut",
//                     }}
//                   />
//                 </div>

//                 <span className="text-xs font-medium text-white/40">
//                   {String(slides.length).padStart(2, "0")}
//                 </span>
//               </div>
//             </div>

//             {/* ==================== ARROWS ==================== */}
//             <div className="pointer-events-auto mb-0 flex shrink-0 items-center gap-2">
//               <button
//                 type="button"
//                 onClick={scrollPrev}
//                 aria-label="Previous slide"
//                 className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:bg-white hover:text-[#181818] active:scale-95"
//               >
//                 <ArrowLeft size={18} strokeWidth={1.8} />
//               </button>

//               <button
//                 type="button"
//                 onClick={scrollNext}
//                 aria-label="Next slide"
//                 className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:bg-white hover:text-[#181818] active:scale-95"
//               >
//                 <ArrowRight size={18} strokeWidth={1.8} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
