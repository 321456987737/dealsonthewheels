"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";


const brands = [
  {
    name: "Porsche",
    logo: "/images/brandlogo/porche.png",
    width: 100,
  },
  {
    name: "BMW",
    logo: "/images/brandlogo/bmw.png",
    width: 64,
  },
  {
    name: "Mercedes-Benz",
    logo: "/images/brandlogo/mercedes.png",
    width: 110,
  },
  {
    name: "Range Rover",
    logo: "/images/brandlogo/range.png",
    width: 125,
  },
  {
    name: "Audi",
    logo: "/images/brandlogo/audi.png",
    width: 90,
  },
  {
    name: "Lexus",
    logo: "/images/brandlogo/lexus.png",
    width: 90,
  },
];

export default function BrandsMarquee() {
  return (
    <section
      aria-label="Featured automotive brands"
      className="border-b border-black/10 bg-white py-8"
    >
      <Marquee
        speed={35}
        gradient={false}
        pauseOnHover
        autoFill
      >
        {brands.map((brand) => (
          <div
            key={brand.name}
            className="mx-10 flex h-14 items-center justify-center sm:mx-14"
          >
            <Image
              src={brand.logo}
              alt={brand.name}
              width={brand.width}
              height={50}
              className="h-auto max-h-14 w-auto object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
// "use client";

// import Image from "next/image";
// import useEmblaCarousel from "embla-carousel-react";
// import Autoplay from "embla-carousel-autoplay";

// const brands = [
//   {
//     name: "Porsche",
//     logo: "/images/brandlogo/porche.png",
//     width: 100,
//   },
//   {
//     name: "BMW",
//     logo: "/images/brandlogo/bmw.png",
//     width: 64,
//   },
//   {
//     name: "Mercedes-Benz",
//     logo: "/images/brandlogo/mercedes.png",
//     width: 110,
//   },
//   {
//     name: "Range Rover",
//     logo: "/images/brandlogo/range.png",
//     width: 125,
//   },
//   {
//     name: "Audi",
//     logo: "/images/brandlogo/audi.png",
//     width: 90,
//   },
//   {
//     name: "Lexus",
//     logo: "/images/brandlogo/lexus.png",
//     width: 90,
//   },
// ];

// export default function BrandsStrip() {
//   const [emblaRef] = useEmblaCarousel(
//     {
//       loop: true,
//       align: "start",
//       dragFree: true,
//       containScroll: false,
//     },
//     [
//       Autoplay({
//         delay: 0,
//         playOnInit: true,
//         stopOnInteraction: false,
//         stopOnMouseEnter: true,
//       }),
//     ],
//   );

//   return (
//     <section
//       aria-label="Featured automotive brands"
//       className="overflow-hidden border-y border-black/10 bg-white"
//     >
//       <div className="mx-auto max-w-[1800px] px-6 py-5 sm:px-8 md:px-10 md:py-7 lg:px-14">
//         <div className="overflow-hidden" ref={emblaRef}>
//           <ul className="flex touch-pan-y">
//             {brands.map((brand) => (
//               <li
//                 key={brand.name}
//                 className="flex min-w-0 flex-[0_0_50%] items-center justify-center px-5 sm:flex-[0_0_33.333%] md:flex-[0_0_16.6667%] md:px-4 lg:px-6"
//               >
//                 <div className="flex h-12 w-full items-center justify-center opacity-55 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 md:h-14">
//                   <Image
//                     src={brand.logo}
//                     alt={`${brand.name} logo`}
//                     width={brand.width}
//                     height={56}
//                     unoptimized
//                     className="h-full max-h-14 w-full object-contain"
//                     draggable={false}
//                   />
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </section>
//   );
// }