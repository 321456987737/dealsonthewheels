"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CarFront,
  MessageSquare,
  CalendarCheck,
  ExternalLink,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Cars",
    href: "/admin/cars",
    icon: CarFront,
  },
  {
    label: "Inquiries",
    href: "/admin/inquiries",
    icon: MessageSquare,
  },
  {
    label: "Test Drives",
    href: "/admin/test-drives",
    icon: CalendarCheck,
  },
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

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  };

  return (
    <>
      {/* =====================================================
          DESKTOP ADMIN SIDEBAR
      ====================================================== */}

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-black/10 bg-white lg:flex lg:flex-col">
        {/* Logo */}

        <div className="flex h-20 shrink-0 items-center border-b border-black/10 px-6">
          <Link
            href="/admin"
            className="flex items-center gap-3"
            aria-label="Admin dashboard"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
              A
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight">
                Admin Panel
              </p>

              <p className="truncate text-xs text-black/40">
                Car Dealership
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}

        <nav
          aria-label="Admin navigation"
          className="flex-1 overflow-y-auto p-4"
        >
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
            Management
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-black text-white"
                      : "text-black/60 hover:bg-black/[0.04] hover:text-black"
                  }`}
                >
                  <Icon
                    size={18}
                    strokeWidth={active ? 2 : 1.7}
                    className="shrink-0"
                  />

                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* View Website */}

        <div className="shrink-0 border-t border-black/10 p-4">
          <Link
            href="/"
            className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-black/50 transition-all duration-200 hover:bg-black/[0.04] hover:text-black"
          >
            <ExternalLink
              size={18}
              strokeWidth={1.7}
              className="shrink-0"
            />

            <span>View Website</span>
          </Link>
        </div>
      </aside>

      {/* =====================================================
          MOBILE BOTTOM ADMIN NAVIGATION
      ====================================================== */}

      <nav
        aria-label="Mobile admin navigation"
        className="fixed bottom-3 left-3 right-3 z-50 h-[78px] rounded-[22px] border border-white/10 bg-[#181818]/95 shadow-[0_12px_35px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:hidden"
        style={{
          paddingBottom: "max(8px, env(safe-area-inset-bottom))",
        }}
      >
        <div className="grid h-full grid-cols-4 px-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className="relative flex min-w-0 flex-col items-center justify-center"
              >
                {/* Icon Area */}

                <div className="relative flex h-11 w-11 items-center justify-center">
                  {active && (
                    <motion.div
                      layoutId="admin-mobile-nav-active"
                      transition={navSpring}
                      className="absolute inset-0 rounded-full border border-white/90 bg-[#181818] shadow-[0_6px_18px_rgba(0,0,0,0.38)]"
                    />
                  )}

                  <motion.div
                    animate={{
                      scale: active ? 1.08 : 1,
                    }}
                    transition={iconSpring}
                    className="relative z-10 flex items-center justify-center"
                  >
                    <Icon
                      size={active ? 22 : 21}
                      strokeWidth={active ? 2 : 1.7}
                      className={
                        active
                          ? "text-white"
                          : "text-white/45 transition-colors duration-200 group-hover:text-white/70"
                      }
                    />
                  </motion.div>
                </div>

                {/* Label */}

                <span
                  className={`mt-1 max-w-[72px] truncate text-center text-[9px] font-medium leading-none transition-colors duration-200 ${
                    active ? "text-white" : "text-white/40"
                  }`}
                >
                  {item.label}
                </span>
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
// import { motion } from "framer-motion";
// import {
//   LayoutDashboard,
//   CarFront,
//   MessageSquare,
//   CalendarCheck,
//   ExternalLink,
// } from "lucide-react";

// const navigation = [
//   {
//     label: "Dashboard",
//     href: "/admin",
//     icon: LayoutDashboard,
//   },
//   {
//     label: "Cars",
//     href: "/admin/cars",
//     icon: CarFront,
//   },
//   {
//     label: "Inquiries",
//     href: "/admin/inquiries",
//     icon: MessageSquare,
//   },
//   {
//     label: "Test Drives",
//     href: "/admin/test-drives",
//     icon: CalendarCheck,
//   },
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

// export default function AdminSidebar() {
//   const pathname = usePathname();

//   const isActive = (href) => {
//     if (href === "/admin") {
//       return pathname === "/admin";
//     }

//     return pathname.startsWith(href);
//   };

//   return (
//     <>
//       {/* =====================================================
//           DESKTOP ADMIN SIDEBAR
//       ====================================================== */}

//       <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-black/10 bg-white md:flex md:flex-col">
//         {/* Logo */}

//         <div className="flex h-20 items-center border-b border-black/10 px-6">
//           <Link
//             href="/admin"
//             className="flex items-center gap-3"
//             aria-label="Admin dashboard"
//           >
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
//               A
//             </div>

//             <div>
//               <p className="text-sm font-semibold tracking-tight">
//                 Admin Panel
//               </p>

//               <p className="text-xs text-black/40">
//                 Car Dealership
//               </p>
//             </div>
//           </Link>
//         </div>

//         {/* Navigation */}

//         <nav
//           aria-label="Admin navigation"
//           className="flex-1 overflow-y-auto p-4"
//         >
//           <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
//             Management
//           </p>

//           <div className="space-y-1">
//             {navigation.map((item) => {
//               const Icon = item.icon;
//               const active = isActive(item.href);

//               return (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   aria-current={active ? "page" : undefined}
//                   className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition ${
//                     active
//                       ? "bg-black text-white"
//                       : "text-black/60 hover:bg-black/[0.04] hover:text-black"
//                   }`}
//                 >
//                   <Icon
//                     size={18}
//                     strokeWidth={active ? 2 : 1.7}
//                   />

//                   {item.label}
//                 </Link>
//               );
//             })}
//           </div>
//         </nav>

//         {/* View Website */}

//         <div className="border-t border-black/10 p-4">
//           <Link
//             href="/"
//             className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-black/50 transition hover:bg-black/[0.04] hover:text-black"
//           >
//             <ExternalLink size={18} strokeWidth={1.7} />

//             View Website
//           </Link>
//         </div>
//       </aside>

//       {/* =====================================================
//           MOBILE BOTTOM ADMIN NAVIGATION
//       ====================================================== */}

//       <nav
//         aria-label="Mobile admin navigation"
//         className="fixed bottom-3 left-3 right-3 z-50 h-[10dvh] min-h-[72px] rounded-2xl border border-black/10 bg-[#181818]/95 pb-[env(safe-area-inset-bottom)] shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl md:hidden"
//       >
//         <div className="flex h-full items-center px-2">
//           {navigation.map((item) => {
//             const Icon = item.icon;
//             const active = isActive(item.href);

//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 aria-label={item.label}
//                 aria-current={active ? "page" : undefined}
//                 className="relative flex h-full flex-1 items-center justify-center"
//               >
//                 <motion.div
//                   animate={{
//                     y: active ? -18 : 0,
//                   }}
//                   transition={navSpring}
//                   className="relative flex h-12 w-12 items-center justify-center"
//                 >
//                   {/* Active circle */}

//                   {active && (
//                     <motion.div
//                       layoutId="admin-mobile-nav-active"
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
//                           : "text-white/40 transition-colors duration-200"
//                       }
//                     />
//                   </motion.div>
//                 </motion.div>

//                 {/* Label */}

//                 <span
//                   className={`absolute bottom-1 text-[9px] font-medium transition-opacity ${
//                     active
//                       ? "text-white opacity-100"
//                       : "text-white/35 opacity-100"
//                   }`}
//                 >
//                   {item.label}
//                 </span>
//               </Link>
//             );
//           })}
//         </div>
//       </nav>
//     </>
//   );
// }

// // import Link from "next/link";

// // const navigation = [
// //   {
// //     label: "Dashboard",
// //     href: "/admin",
// //   },
// //   // {
// //   //   label: "Businesses",
// //   //   href: "/admin/businesses",
// //   // },
// //   // {
// //   //   label: "Users",
// //   //   href: "/admin/users",
// //   // },
// //   {
// //     label: "Cars",
// //     href: "/admin/cars",
// //   },
// //   {
// //     label: "Inquiries",
// //     href: "/admin/inquiries",
// //   },
// //   {
// //     label: "Test Drives",
// //     href: "/admin/test-drives",
// //   },
// // ];

// // export default function AdminSidebar() {
// //   return (
// //     <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-black/10 bg-white lg:flex lg:flex-col">
// //       <div className="flex h-20 items-center border-b border-black/10 px-6">
// //         <Link
// //           href="/admin"
// //           className="flex items-center gap-3"
// //         >
// //           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
// //             A
// //           </div>

// //           <div>
// //             <p className="text-sm font-semibold tracking-tight">
// //               Admin Panel
// //             </p>

// //             <p className="text-xs text-black/40">
// //               Car Dealership
// //             </p>
// //           </div>
// //         </Link>
// //       </div>

// //       <nav className="flex-1 overflow-y-auto p-4">
// //         <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
// //           Management
// //         </p>

// //         <div className="space-y-1">
// //           {navigation.map((item) => (
// //             <Link
// //               key={item.href}
// //               href={item.href}
// //               className="flex h-11 items-center rounded-xl px-3 text-sm font-medium text-black/60 transition hover:bg-black/[0.04] hover:text-black"
// //             >
// //               {item.label}
// //             </Link>
// //           ))}
// //         </div>
// //       </nav>

// //       <div className="border-t border-black/10 p-4">
// //         <Link
// //           href="/"
// //           className="flex h-11 items-center rounded-xl px-3 text-sm font-medium text-black/50 transition hover:bg-black/[0.04] hover:text-black"
// //         >
// //           View Website
// //         </Link>
// //       </div>
// //     </aside>
// //   );
// // }