
import Image from "next/image";

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
    width: 58,
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

export default function BrandsStrip() {
  return (
    <section
      aria-label="Featured automotive brands"
      className="border-y border-black/10 bg-white"
    >
      <div className="mx-auto max-w-[1800px] px-6 py-3 sm:px-8 md:px-10 md:py-6 lg:px-14">
        {/* <p className="mb-7 text-center font-montserrat text-[9px] font-medium uppercase tracking-[0.3em] text-black/40 md:mb-9 md:text-[10px]">
          A collection of distinguished marques
        </p> */}

        <ul className="grid grid-cols-2 items-center gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-6 md:gap-5 lg:gap-10">
          {brands.map((brand) => (
            <li
              key={brand.name}
              className="flex min-h-12 items-center justify-center"
            >
              <div className="flex h-12 w-full items-center justify-center opacity-55 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  width={brand.width}
                  height={48}
                  unoptimized
                  className="max-h-14 max-w-full object-contain h-full w-full"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// const brands = [
//   "Porsche",
//   "BMW",
//   "Mercedes-Benz",
//   "Range Rover",
//   "Audi",
//   "Lexus",
// ];

// export default function BrandsStrip() {
//   return (
//     <section
//       aria-label="Featured automotive brands"
//       className="border-b border-black/10 bg-[#f0efeb]"
//     >
//       <div className="mx-auto max-w-[1800px] px-6 py-8 sm:px-8 md:px-10 md:py-10 lg:px-14">
//         <p className="mb-6 text-center font-montserrat text-[9px] font-medium uppercase tracking-[0.3em] text-black/40 md:mb-8 md:text-[10px]">
//           A collection of distinguished marques
//         </p>

//         <ul className="grid grid-cols-2 items-center gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-6 md:gap-5 lg:gap-8">
//           {brands.map((brand, index) => (
//             <li
//               key={brand}
//               className={`flex min-h-8 items-center justify-center text-center text-black/65 transition-colors duration-300 hover:text-black ${
//                 index === 0 || index === 3
//                   ? "font-bebas text-2xl tracking-[0.04em] sm:text-3xl"
//                   : "font-montserrat text-[10px] font-semibold uppercase tracking-[0.07em] sm:text-[11px]"
//               }`}
//             >
//               {brand}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </section>
//   );
// }