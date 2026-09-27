"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Home, CarFront, Wrench, Info, Phone, Car } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/cars", label: "Cars", icon: Car },
  { href: "/models", label: "Models", icon: CarFront },
  { href: "/services", label: "Services", icon: Wrench },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Phone },
];

const navSpring = {
  type: "spring",
  stiffness: 500,
  damping: 32,
  mass: 0.7,
};

const iconSpring = {
  type: "spring",
  stiffness: 450,
  damping: 25,
};

export default function Header() {
  const pathname = usePathname();

  const { scrollY } = useScroll();

  const isCarDetailsPage =
    pathname.startsWith("/cars/") && pathname !== "/cars";

  const backgroundColor = useTransform(
    scrollY,
    [0, 40],
    isCarDetailsPage
      ? ["#181818", "#181818"]
      : ["rgba(24, 24, 24, 0)", "#181818"],
  );

  const borderColor = useTransform(
    scrollY,
    [0, 40],
    isCarDetailsPage
      ? ["rgba(255,255,255,0.10)", "rgba(255,255,255,0.10)"]
      : ["rgba(255,255,255,0)", "rgba(255,255,255,0.10)"],
  );

  const isActive = (href) => {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  return (
    <>
      {/* =====================================================
          DESKTOP HEADER
      ====================================================== */}

      <motion.header
        style={{
          backgroundColor,
          borderBottomColor: borderColor,
        }}
        className="fixed inset-x-0 top-0 z-50 hidden border-b text-white md:block"
      >
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-8 px-5 md:px-8">
          {/* Logo */}

          <Link
            href="/"
            aria-label="Dealership home"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-[#181818]">
              D
            </div>

            <div>
              <p className="text-sm font-semibold tracking-tight text-white">
                Dealership
              </p>

              <p className="text-xs text-white/50">Quality Cars</p>
            </div>
          </Link>

          {/* Navigation */}

          <nav
            aria-label="Main navigation"
            className="flex items-center gap-8"
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative py-1 font-montserrat text-sm transition ${
                    active
                      ? "font-medium text-white"
                      : "text-white/65 hover:text-white"
                  }`}
                >
                  {link.label}

                  <span
                    className={`absolute bottom-0 left-0 h-px bg-white transition-all duration-300 ease-out ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Actions */}

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/97433774443"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact us on WhatsApp"
              className="hidden rounded-full bg-white px-5 py-3 text-sm font-medium text-[#181818] transition hover:bg-white/90 lg:inline-flex"
            >
              WhatsApp
            </a>

            <a
              href="tel:+97433774443"
              aria-label="Call dealership"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-[#181818]"
            >
              <Phone size={16} strokeWidth={1} />
              Call
            </a>
          </div>
        </div>
      </motion.header>

      {/* =====================================================
          MOBILE TOP HEADER
      ====================================================== */}

      <motion.header
        style={{
          backgroundColor,
          borderBottomColor: borderColor,
        }}
        className="fixed inset-x-0 top-0 z-50 border-b text-white md:hidden"
      >
        <div className="flex h-[10dvh] min-h-[72px] items-center justify-between px-4">
          {/* Logo */}

          <Link
            href="/"
            aria-label="Dealership home"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-[#181818]">
              D
            </div>

            <div>
              <p className="text-sm font-semibold tracking-tight text-white">
                Dealership
              </p>

              <p className="text-[10px] text-white/50">
                Quality Cars
              </p>
            </div>
          </Link>

          {/* Call */}

          <a
            href="tel:+97433774443"
            aria-label="Call dealership"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-xs font-medium text-white transition active:scale-95"
          >
            <Phone size={15} strokeWidth={1} />
            Call
          </a>
        </div>
      </motion.header>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ====================================================== */}

      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-3 left-3 right-3 z-50 h-[82px] rounded-[22px] border border-white/10 bg-[#181818]/95 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl md:hidden"
        style={{
          paddingBottom: "max(6px, env(safe-area-inset-bottom))",
        }}
      >
        <div className="grid h-full grid-cols-6 px-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-label={link.label}
                aria-current={active ? "page" : undefined}
                className="group flex h-full min-w-0 flex-col items-center justify-center"
              >
                {/* Icon */}

                <motion.div
                  animate={{
                    y: active ? -2 : 0,
                  }}
                  transition={navSpring}
                  className="relative flex h-11 w-11 shrink-0 items-center justify-center"
                >
                  {/* Active Circle */}

                  {active && (
                    <motion.div
                      layoutId="mobile-nav-active"
                      transition={navSpring}
                      className="absolute inset-0 rounded-full border-2 border-white bg-[#181818] shadow-[0_8px_22px_rgba(0,0,0,0.4)]"
                    />
                  )}

                  {/* Icon */}

                  <motion.div
                    animate={{
                      scale: active ? 1.08 : 1,
                    }}
                    transition={iconSpring}
                    className="relative z-10 flex items-center justify-center"
                  >
                    <Icon
                      size={active ? 22 : 20}
                      strokeWidth={active ? 2 : 1.7}
                      className={`transition-colors duration-200 ${
                        active
                          ? "text-white"
                          : "text-white/40 group-hover:text-white/70"
                      }`}
                    />
                  </motion.div>
                </motion.div>

                {/* Label */}

                <motion.span
                  animate={{
                    y: active ? -2 : 0,
                  }}
                  transition={navSpring}
                  className={`mt-1.5 max-w-[58px] truncate text-center font-montserrat text-[9px] font-medium leading-none transition-colors duration-200 ${
                    active
                      ? "text-white"
                      : "text-white/40 group-hover:text-white/70"
                  }`}
                >
                  {link.label}
                </motion.span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { motion, useScroll, useTransform } from "framer-motion";
// import { Home, CarFront, Wrench, Info, Phone, Car } from "lucide-react";

// const navLinks = [
//   { href: "/", label: "Home", icon: Home },
//   { href: "/cars", label: "Cars", icon: Car },
//   { href: "/models", label: "Models", icon: CarFront },
//   { href: "/services", label: "Services", icon: Wrench },
//   { href: "/about", label: "About", icon: Info },
//   { href: "/contact", label: "Contact", icon: Phone },
// ];

// const navSpring = {
//   type: "spring",
//   stiffness: 500,
//   damping: 32,
//   mass: 0.7,
// };

// const iconSpring = {
//   type: "spring",
//   stiffness: 450,
//   damping: 25,
// };

// export default function Header() {
//   const pathname = usePathname();

//   const { scrollY } = useScroll();

//   const isCarDetailsPage =
//     pathname.startsWith("/cars/") && pathname !== "/cars";

//   const backgroundColor = useTransform(
//     scrollY,
//     [0, 40],
//     isCarDetailsPage
//       ? ["#181818", "#181818"]
//       : ["rgba(24, 24, 24, 0)", "#181818"],
//   );

//   const borderColor = useTransform(
//     scrollY,
//     [0, 40],
//     isCarDetailsPage
//       ? ["rgba(255,255,255,0.10)", "rgba(255,255,255,0.10)"]
//       : ["rgba(255,255,255,0)", "rgba(255,255,255,0.10)"],
//   );

//   const isActive = (href) => {
//     return href === "/" ? pathname === "/" : pathname.startsWith(href);
//   };

//   return (
//     <>
//       {/* =====================================================
//           DESKTOP HEADER
//       ====================================================== */}

//       <motion.header
//         style={{
//           backgroundColor,
//           borderBottomColor: borderColor,
//         }}
//         className="fixed inset-x-0 top-0 z-50 hidden border-b text-white md:block"
//       >
//         <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-8 px-5 md:px-8">
//           {/* Logo */}

//           <Link
//             href="/"
//             aria-label="Dealership home"
//             className="flex items-center gap-3"
//           >
//             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-[#181818]">
//               D
//             </div>

//             <div>
//               <p className="text-sm font-semibold tracking-tight text-white">
//                 Dealership
//               </p>

//               <p className="text-xs text-white/50">Quality Cars</p>
//             </div>
//           </Link>

//           {/* Navigation */}

//           <nav aria-label="Main navigation" className="flex items-center gap-8">
//             {navLinks.map((link) => {
//               const active = isActive(link.href);

//               return (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   aria-current={active ? "page" : undefined}
//                   className={`group relative py-1 font-montserrat text-sm  transition ${
//                     active
//                       ? "text-white font-medium"
//                       : "text-white/65 hover:text-white  "
//                   }`}
//                 >
//                   {link.label}

//                   <span
//                     className={`absolute bottom-0 left-0 h-px bg-white transition-all duration-300 ease-out ${
//                       active ? "w-full" : "w-0 group-hover:w-full"
//                     }`}
//                   />
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* Actions */}

//           <div className="flex items-center gap-3">
//             <a
//               href="https://wa.me/97433774443"
//               target="_blank"
//               rel="noopener noreferrer"
//               aria-label="Contact us on WhatsApp"
//               className="hidden rounded-full bg-white px-5 py-3 text-sm font-medium text-[#181818] transition hover:bg-white/90 lg:inline-flex"
//             >
//               WhatsApp
//             </a>

//             <a
//               href="tel:+97433774443"
//               aria-label="Call dealership"
//               className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-[#181818]"
//             >
//               <Phone size={16} strokeWidth={1} />
//               Call
//             </a>
//           </div>
//         </div>
//       </motion.header>

//       {/* =====================================================
//           MOBILE TOP HEADER
//       ====================================================== */}

//       <motion.header
//         style={{
//           backgroundColor,
//           borderBottomColor: borderColor,
//         }}
//         className="fixed inset-x-0 top-0 z-50 border-b text-white md:hidden"
//       >
//         <div className="flex h-[10dvh] min-h-[72px] items-center justify-between px-4">
//           {/* Logo */}

//           <Link
//             href="/"
//             aria-label="Dealership home"
//             className="flex items-center gap-2.5"
//           >
//             <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-[#181818]">
//               D
//             </div>

//             <div>
//               <p className="text-sm font-semibold tracking-tight text-white">
//                 Dealership
//               </p>

//               <p className="text-[10px] text-white/50">Quality Cars</p>
//             </div>
//           </Link>

//           {/* Call */}

//           <a
//             href="tel:+97433774443"
//             aria-label="Call dealership"
//             className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-xs font-medium text-white transition active:scale-95"
//           >
//             <Phone size={15} strokeWidth={1} />
//             Call
//           </a>
//         </div>
//       </motion.header>

//       {/* =====================================================
//           MOBILE BOTTOM NAVIGATION
//       ====================================================== */}
//       {/* =====================================================
//     MOBILE BOTTOM NAVIGATION
// ====================================================== */}

//       <nav
//         aria-label="Mobile navigation"
//         className="fixed bottom-3 left-3 right-3 z-50 h-[10dvh] min-h-[72px] rounded-2xl border border-white/10 bg-[#181818]/95 pb-[env(safe-area-inset-bottom)] shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl md:hidden"
//       >
//         <div className="flex h-full items-center  px-4">
//           {navLinks.map((link) => {
//             const Icon = link.icon;
//             const active = isActive(link.href);

//             return (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 aria-label={link.label}
//                 aria-current={active ? "page" : undefined}
//                 className="relative flex h-full flex-1 items-center justify-center"
//               >
//                 <motion.div
//                   animate={{
//                     y: active ? -22 : 0,
//                   }}
//                   transition={navSpring}
//                   className="relative flex h-12 w-12 items-center justify-center"
//                 >
//                   {/* Active background */}

//                   {active && (
//                     <motion.div
//                       layoutId="mobile-nav-active"
//                       transition={navSpring}
//                       className="absolute h-[50px] w-[50px] rounded-full border-2 border-white bg-[#181818] shadow-[0_10px_28px_rgba(0,0,0,0.45)]"
//                     />
//                   )}

//                   {/* Icon */}

//                   <motion.div
//                     animate={{
//                       scale: active ? 1.12 : 1,
//                     }}
//                     transition={iconSpring}
//                     className="relative z-10 flex items-center justify-center"
//                   >
//                     <Icon
//                       size={active ? 23 : 21}
//                       strokeWidth={active ? 2 : 1.7}
//                       className={
//                         active
//                           ? "text-white"
//                           : "text-white/40 transition-colors duration-200 hover:text-white"
//                       }
//                     />
//                   </motion.div>
//                 </motion.div>
//               </Link>
//             );
//           })}
//         </div>
//       </nav>
 
//     </>
//   );
// }

// // "use client";

// // import Link from "next/link";
// // import { usePathname } from "next/navigation";
// // import { motion, useScroll, useTransform } from "framer-motion";
// // import { Home, CarFront, Wrench, Info, Phone, Car } from "lucide-react";

// // const navLinks = [
// //   { href: "/", label: "Home", icon: Home },
// //   { href: "/cars", label: "Cars", icon: Car },
// //   { href: "/models", label: "Models", icon: CarFront },
// //   { href: "/services", label: "Services", icon: Wrench },
// //   { href: "/about", label: "About", icon: Info },
// //   { href: "/contact", label: "Contact", icon: Phone },
// // ];

// // export default function Header() {
// //   const pathname = usePathname();

// //   const { scrollY } = useScroll();
// //   const isCarDetailsPage =
// //     pathname.startsWith("/cars/") && pathname !== "/cars";

// //   const backgroundColor = useTransform(
// //     scrollY,
// //     [0, 40],
// //     isCarDetailsPage
// //       ? ["#181818", "#181818"]
// //       : ["rgba(24, 24, 24, 0)", "#181818"],
// //   );

// //   const borderColor = useTransform(
// //     scrollY,
// //     [0, 40],
// //     isCarDetailsPage
// //       ? ["rgba(255,255,255,0.10)", "rgba(255,255,255,0.10)"]
// //       : ["rgba(255,255,255,0)", "rgba(255,255,255,0.10)"],
// //   );

// //   const isActive = (href) => {
// //     return href === "/" ? pathname === "/" : pathname.startsWith(href);
// //   };

// //   return (
// //     <>
// //       {/* ==================== DESKTOP ==================== */}

// //       <motion.header
// //         style={{
// //           backgroundColor,
// //           borderBottomColor: borderColor,
// //         }}
// //         className="fixed inset-x-0 top-0 z-50 hidden border-b text-white md:block"
// //       >
// //         <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-8 px-5 md:px-8">
// //           {/* Logo */}

// //           <Link href="/" className="flex items-center gap-3">
// //             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-[#181818]">
// //               D
// //             </div>

// //             <div>
// //               <p className="text-sm font-semibold tracking-tight text-white">
// //                 Dealership
// //               </p>

// //               <p className="text-xs text-white/50">
// //                 Quality Cars
// //               </p>
// //             </div>
// //           </Link>

// //           {/* Navigation */}

// //           <nav className="flex items-center gap-8">
// //             {navLinks.map((link) => {
// //               const active = isActive(link.href);

// //               return (
// //                 <Link
// //                   key={link.href}
// //                   href={link.href}
// //                   aria-current={active ? "page" : undefined}
// //                   className={`group relative font-montserrat py-1 text-sm font-medium transition ${
// //                     active
// //                       ? "text-white"
// //                       : "text-white/65 hover:text-white"
// //                   }`}
// //                 >
// //                   {link.label}

// //                   <span
// //                     className={`absolute bottom-0 left-0 h-px bg-white transition-all duration-300 ease-out ${
// //                       active ? "w-full" : "w-0 group-hover:w-full"
// //                     }`}
// //                   />
// //                 </Link>
// //               );
// //             })}
// //           </nav>

// //           {/* Actions */}

// //           <div className="flex items-center gap-3">
// //             <a
// //               href="https://wa.me/97433774443"
// //               target="_blank"
// //               rel="noopener noreferrer"
// //               className="hidden rounded-full bg-white px-5 py-3 text-sm font-medium text-[#181818] transition hover:bg-white/90 lg:inline-flex"
// //             >
// //               WhatsApp
// //             </a>

// //             <a
// //               href="tel:+97433774443"
// //               className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-[#181818]"
// //             >
// //               <Phone size={16} strokeWidth={1} />
// //               Call
// //             </a>
// //           </div>
// //         </div>
// //       </motion.header>

// //       {/* ==================== MOBILE TOP ==================== */}

// //       <motion.header
// //         style={{
// //           backgroundColor,
// //           borderBottomColor: borderColor,
// //         }}
// //         className="fixed inset-x-0 top-0 z-50 border-b text-white md:hidden"
// //       >
// //         <div className="flex h-[10dvh] min-h-[72px] items-center justify-between px-4">
// //           {/* Logo */}

// //           <Link href="/" className="flex items-center gap-2.5">
// //             <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-[#181818]">
// //               D
// //             </div>

// //             <div>
// //               <p className="text-sm font-semibold tracking-tight text-white">
// //                 Dealership
// //               </p>

// //               <p className="text-[10px] text-white/50">
// //                 Quality Cars
// //               </p>
// //             </div>
// //           </Link>

// //           {/* Call */}

// //           <a
// //             href="tel:+974XXXXXXXX"
// //             className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-xs font-medium text-white transition active:scale-95"
// //           >
// //             <Phone size={15} strokeWidth={1} />
// //             Call
// //           </a>
// //         </div>
// //       </motion.header>

// //       {/* ==================== MOBILE BOTTOM ==================== */}

// //       <nav className="fixed bottom-3 left-3 right-3 z-50 h-[10dvh] min-h-[72px] rounded-2xl border border-white/10 bg-[#181818]/95 pb-[env(safe-area-inset-bottom)] shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl md:hidden">
// //         <div className="grid h-full grid-cols-6">
// //           {navLinks.map((link) => {
// //             const Icon = link.icon;
// //             const active = isActive(link.href);

// //             return (
// //               <Link
// //                 key={link.href}
// //                 href={link.href}
// //                 aria-current={active ? "page" : undefined}
// //                 className="relative flex h-full items-center justify-center"
// //               >
// //                 <motion.div
// //                   animate={{
// //                     y: active ? -24 : 0,
// //                   }}
// //                   transition={{
// //                     type: "spring",
// //                     stiffness: 500,
// //                     damping: 32,
// //                     mass: 0.7,
// //                   }}
// //                   className="relative flex h-14 w-14 items-center justify-center"
// //                 >
// //                   {active && (
// //                     <motion.div
// //                       layoutId="mobile-nav-active"
// //                       transition={{
// //                         type: "spring",
// //                         stiffness: 500,
// //                         damping: 32,
// //                         mass: 0.7,
// //                       }}
// //                       className="absolute h-[52px] w-[52px] rounded-full bg-[#181818] border-2 border-white  shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
// //                     />
// //                   )}

// //                   <motion.div
// //                     animate={{
// //                       scale: active ? 1.08 : 1,
// //                     }}
// //                     transition={{
// //                       type: "spring",
// //                       stiffness: 450,
// //                       damping: 25,
// //                     }}
// //                     className="relative z-10 flex items-center justify-center"
// //                   >
// //                     <Icon
// //                       size={active ? 24 : 22}
// //                       strokeWidth={active ? 2: 1.8}
// //                       className={
// //                         active
// //                           ? "text-[#fff]"
// //                           : "text-white/45 transition-colors duration-200 hover:text-white"
// //                       }
// //                     />
// //                   </motion.div>
// //                 </motion.div>
// //               </Link>
// //             );
// //           })}
// //         </div>
// //       </nav>
// //     </>
// //   );
// // }
