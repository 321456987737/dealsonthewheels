"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  CarFront,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

export default function ContactPage() {
  const searchParams = useSearchParams();

  const carId = searchParams.get("car");

  const [car, setCar] = useState(null);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        if (carId) {
          const carResponse = await fetch(`/api/cars/${carId}`, {
            cache: "no-store",
          });

          if (carResponse.ok) {
            const carResult = await carResponse.json();

            if (carResult.success) {
              const selectedCar = carResult.data.car;

              setCar(selectedCar);

              setForm((current) => ({
                ...current,
                message:
                  current.message ||
                  `Hello, I'm interested in the ${selectedCar.year} ${selectedCar.make} ${selectedCar.model}. Please send me more information about this vehicle.`,
              }));
            }
          }
        }
      } catch (loadError) {
        console.error("Contact page load error:", loadError);
      }
    }

    loadData();
  }, [carId]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          carId: carId || null,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to send inquiry"
        );
      }

      setSuccess(
        "Your demo inquiry has been submitted successfully."
      );

      setForm({
        customerName: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (submitError) {
      setError(
        submitError.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    
    <main className="min-h-screen bg-[#f7f7f5] text-black">
      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative h-[40dvh] min-h-[320px] overflow-hidden bg-[#e8e8e5] md:min-h-[440px]">
        <Image
          src={"/images/cars/car1.jpg"}
          alt="Demo vehicle contact page"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/25" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1800px] items-end px-6 pb-10 md:px-10 md:pb-14 lg:px-14">
          <div className="max-w-5xl">
            <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.3em] text-white/65 md:text-xs">
              Get in touch
            </p>

            <h1 className="mt-3 font-bebas text-6xl leading-[0.9] tracking-wide text-white md:text-8xl lg:text-9xl">
              Let us talk
              <br />
              about your next car.
            </h1>
          </div>
        </div>
      </section>

      {/* =========================================================
          INTRO
      ========================================================= */}

      <section className="border-b border-black/10 bg-[#f7f7f5]">
        <div className="mx-auto max-w-[1800px] px-6 py-20 md:px-10 md:py-28 lg:px-14">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
            <div>
              <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.3em] text-black/35 md:text-xs">
                Contact us
              </p>

              <h2 className="mt-5 max-w-4xl font-bebas text-5xl leading-[0.95] tracking-wide md:text-7xl lg:text-8xl">
                Questions?
                <br />
                We are here.
              </h2>
            </div>

            <div className="flex items-end">
              <p className="max-w-xl font-montserrat text-sm leading-7 text-black/55 md:text-base md:leading-8">
                Have a question about a vehicle, want to arrange a visit,
                schedule a test drive or simply need more information? Send us
                a message and our team will get back to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT + FORM
      ========================================================= */}

      <section className="bg-white">
        <div className="mx-auto max-w-[1800px] px-6 py-16 md:px-10 md:py-24 lg:px-14">
          <div className="grid gap-0 border border-black/10 lg:grid-cols-[0.75fr_1.25fr]">
            {/* =====================================================
                LEFT INFORMATION
            ===================================================== */}

            <div className="bg-[#f3f3f1] p-7 md:p-10 lg:p-12">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.3em] text-black/35">
                    Contact details
                  </p>

                  <h3 className="mt-3 font-bebas text-4xl tracking-wide md:text-5xl">
                    Reach us
                  </h3>
                </div>

                <span className="font-bebas text-7xl leading-none text-black/[0.06]">
                  01
                </span>
              </div>

              <div className="mt-10 space-y-0">
                <ContactInfo
                  icon={Phone}
                  label="Phone"
                  value="00000000"
                />

                <ContactInfo
                  icon={Mail}
                  label="Email"
                  value="hello@example.com"
                  href="mailto:hello@example.com"
                />

                <ContactInfo
                  icon={MapPin}
                  label="Address"
                  value={
                    "Demo showroom address"
                  }
                />
              </div>

            </div>

            {/* =====================================================
                FORM
            ===================================================== */}

            <div className="bg-white p-7 md:p-10 lg:p-14">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.3em] text-black/35">
                    Send an inquiry
                  </p>

                  <h3 className="mt-3 font-bebas text-4xl tracking-wide md:text-5xl">
                    Tell us what you need.
                  </h3>
                </div>

                <span className="hidden font-bebas text-7xl leading-none text-black/[0.05] sm:block">
                  02
                </span>
              </div>

              {/* VEHICLE INQUIRY */}
              {car && (
                <div className="mt-10 overflow-hidden border border-black/10 bg-[#f3f3f1]">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative h-52 w-full shrink-0 sm:h-36 sm:w-52">
                      {car.images?.[0]?.url ? (
                        <Image
                          src={car.images[0].url}
                          alt={`${car.make} ${car.model}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 208px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-black/[0.04]">
                          <CarFront
                            size={32}
                            strokeWidth={1}
                            className="text-black/20"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-center p-5">
                      <p className="font-montserrat text-[9px] font-medium uppercase tracking-[0.2em] text-black/35">
                        Vehicle inquiry
                      </p>

                      <h4 className="mt-2 font-bebas text-3xl tracking-wide">
                        {car.make} {car.model}
                      </h4>

                      <p className="mt-1 font-montserrat text-xs text-black/45">
                        {car.year} · {car.currency}{" "}
                        {new Intl.NumberFormat("en-US").format(
                          car.price
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="mt-8 border border-green-200 bg-green-50 px-5 py-4">
                  <p className="font-montserrat text-sm leading-6 text-green-700">
                    {success}
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-8 border border-red-200 bg-red-50 px-5 py-4">
                  <p className="font-montserrat text-sm leading-6 text-red-700">
                    {error}
                  </p>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-10 space-y-7"
              >
                {/* NAME */}
                <div>
                  <label
                    htmlFor="customerName"
                    className="mb-2 block font-montserrat text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50"
                  >
                    Full name
                  </label>

                  <input
                    id="customerName"
                    name="customerName"
                    value={form.customerName}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    placeholder="John Smith"
                    className="h-14 w-full border-b border-black/15 bg-transparent px-1 font-montserrat text-sm outline-none placeholder:text-black/25 transition-colors focus:border-black"
                  />
                </div>

                {/* PHONE + EMAIL */}
                <div className="grid gap-7 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block font-montserrat text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50"
                    >
                      Phone
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      maxLength={30}
                      placeholder="00000000"
                      className="h-14 w-full border-b border-black/15 bg-transparent px-1 font-montserrat text-sm outline-none placeholder:text-black/25 transition-colors focus:border-black"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block font-montserrat text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50"
                    >
                      Email
                      <span className="ml-1 font-normal text-black/30">
                        (optional)
                      </span>
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      maxLength={150}
                      placeholder="john@example.com"
                      className="h-14 w-full border-b border-black/15 bg-transparent px-1 font-montserrat text-sm outline-none placeholder:text-black/25 transition-colors focus:border-black"
                    />
                  </div>
                </div>

                {/* MESSAGE */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block font-montserrat text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    maxLength={2000}
                    rows={6}
                    placeholder="How can we help?"
                    className="w-full resize-none border-b border-black/15 bg-transparent px-1 py-3 font-montserrat text-sm leading-7 outline-none placeholder:text-black/25 transition-colors focus:border-black"
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex w-full items-center justify-between bg-black px-6 py-5 font-montserrat text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>
                    {submitting ? "Sending..." : "Send message"}
                  </span>

                  <Send
                    size={17}
                    strokeWidth={1.4}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>


   
      {/* =========================================================
          LOCATION
      ========================================================= */}

      <section className="bg-[#f7f7f5] px-6 py-16 md:px-10 md:py-24 lg:px-14">
        <div className="mx-auto grid max-w-[1800px] overflow-hidden border border-black/10 bg-white lg:grid-cols-[0.7fr_1.3fr]">
          <div className="flex flex-col justify-center bg-[#181818] p-7 text-white md:p-10 lg:p-14">
            <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.3em] text-white/35">
              Demo location
            </p>

            <h2 className="mt-5 max-w-lg font-bebas text-5xl leading-[0.92] tracking-wide md:text-7xl">
              Showroom details
              <br />
              go here.
            </h2>

            <p className="mt-6 max-w-sm font-montserrat text-sm leading-7 text-white/60">
              This area is placeholder content for the demo website. Add a verified showroom address and map before launch.
            </p>
          </div>

          <div className="flex min-h-[320px] items-center justify-center bg-[#e8e8e5] p-8 text-center md:min-h-[420px]">
            <div>
              <MapPin size={28} strokeWidth={1.2} className="mx-auto text-black/35" />
              <p className="mt-4 font-montserrat text-[10px] font-semibold uppercase tracking-[0.2em] text-black/45">
                Demo map placeholder
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}

      <section className="bg-black px-6 py-5 text-white md:px-10 lg:px-14">
        <div className="mx-auto max-w-[1800px]">
          <div className="relative overflow-hidden px-7 py-16 md:px-12 md:py-24 lg:px-16">
            {/* DECORATIVE NUMBER */}
            <span className="absolute -bottom-16 -right-4 font-bebas text-[18rem] leading-none tracking-[-0.08em] text-white/[0.035] md:text-[24rem]">
              03
            </span>

            <div className="relative z-10 max-w-3xl">
              <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.3em] text-white/35 md:text-xs">
                Your next vehicle
              </p>

              <h2 className="mt-5 font-bebas text-6xl leading-[0.9] tracking-wide md:text-8xl">
                Still looking?
                <br />
                Explore our inventory.
              </h2>

              <p className="mt-6 max-w-xl font-montserrat text-sm leading-7 text-white/45 md:text-base">
                Take a look at our current vehicles and find something that
                catches your eye.
              </p>

              <Link
                href="/cars"
                className="group mt-9 inline-flex items-center gap-5 bg-white px-6 py-4 font-montserrat text-[10px] font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-white/90"
              >
                Browse inventory

                <ArrowUpRight
                  size={17}
                  strokeWidth={1.4}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="border-t border-white/10 bg-black px-6 pb-8 text-white md:px-10 lg:px-14">
        <div className="mx-auto flex max-w-[1800px] flex-col justify-between gap-4 pt-8 sm:flex-row">
          <p className="font-montserrat text-[10px] uppercase tracking-[0.15em] text-white/25">
            © {new Date().getFullYear()} Demo Auto · Demo website
          </p>

          <p className="font-montserrat text-[10px] uppercase tracking-[0.15em] text-white/25">
            All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
/* =========================================================
   CONTACT INFO
========================================================= */

function ContactInfo({
  icon: Icon,
  label,
  value,
  href,
}) {
  const content = (
    <div className="group flex gap-4 border-b border-black/10 py-5 first:pt-0 last:border-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-black/10 bg-white transition-all duration-300 group-hover:border-black/25">
        <Icon
          size={17}
          strokeWidth={1.3}
          className="text-black/55"
        />
      </div>

      <div className="min-w-0">
        <p className="font-montserrat text-[9px] font-medium uppercase tracking-[0.2em] text-black/35">
          {label}
        </p>

        <p className="mt-2 break-words font-montserrat text-sm font-medium">
          {value || "Not provided"}
        </p>
      </div>

      {href && (
        <ArrowUpRight
          size={16}
          strokeWidth={1.3}
          className="ml-auto shrink-0 text-black/25 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      )}
    </div>
  );

  if (!value || !href) {
    return content;
  }

  return (
    <a
      href={href}
      target={
        href.startsWith("https://")
          ? "_blank"
          : undefined
      }
      rel={
        href.startsWith("https://")
          ? "noopener noreferrer"
          : undefined
      }
      className="block"
    >
      {content}
    </a>
  );
}












// "use client";

// import Image from "next/image";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import {
//   ArrowUpRight,
//   CarFront,
//   Mail,
//   MapPin,
//   Phone,
//   Send,
// } from "lucide-react";

// export default function ContactPage() {
//   const searchParams = useSearchParams();

//   const carId = searchParams.get("car");

//   const [car, setCar] = useState(null);

//   const [form, setForm] = useState({
//     customerName: "",
//     phone: "",
//     email: "",
//     message: "",
//   });

//   const [submitting, setSubmitting] = useState(false);
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function loadData() {
//       try {
//         if (carId) {
//           const carResponse = await fetch(`/api/cars/${carId}`, {
//             cache: "no-store",
//           });

//           if (carResponse.ok) {
//             const carResult = await carResponse.json();

//             if (carResult.success) {
//               const selectedCar = carResult.data.car;

//               setCar(selectedCar);

//               setForm((current) => ({
//                 ...current,
//                 message:
//                   current.message ||
//                   `Hello, I'm interested in the ${selectedCar.year} ${selectedCar.make} ${selectedCar.model}. Please send me more information about this vehicle.`,
//               }));
//             }
//           }
//         }
//       } catch (loadError) {
//         console.error("Contact page load error:", loadError);
//       }
//     }

//     loadData();
//   }, [carId]);

//   function handleChange(event) {
//     const { name, value } = event.target;

//     setForm((current) => ({
//       ...current,
//       [name]: value,
//     }));
//   }

//   async function handleSubmit(event) {
//     event.preventDefault();

//     setSubmitting(true);
//     setSuccess("");
//     setError("");

//     try {
//       const response = await fetch("/api/inquiries", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...form,
//           carId: carId || null,
//         }),
//       });

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message || "Failed to send inquiry"
//         );
//       }

//       setSuccess(
//         "Your demo inquiry has been submitted successfully."
//       );

//       setForm({
//         customerName: "",
//         phone: "",
//         email: "",
//         message: "",
//       });
//     } catch (submitError) {
//       setError(
//         submitError.message ||
//           "Something went wrong. Please try again."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
    
//     <main className="min-h-screen bg-[#f7f7f5] text-black">
//       {/* =========================================================
//           HERO
//       ========================================================= */}

//       <section className="relative h-[40dvh] min-h-[320px] overflow-hidden bg-[#e8e8e5] md:min-h-[440px]">
//         <Image
//           src={business?.heroImage || "/images/cars/car1.jpg"}
//           alt="Demo vehicle contact page"
//           fill
//           priority
//           sizes="100vw"
//           className="object-cover"
//         />

//         <div className="absolute inset-0 bg-black/25" />

//         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

//         <div className="relative z-10 mx-auto flex h-full max-w-[1800px] items-end px-6 pb-10 md:px-10 md:pb-14 lg:px-14">
//           <div className="max-w-5xl">
//             <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.3em] text-white/65 md:text-xs">
//               Get in touch
//             </p>

//             <h1 className="mt-3 font-bebas text-6xl leading-[0.9] tracking-wide text-white md:text-8xl lg:text-9xl">
//               Let us talk
//               <br />
//               about your next car.
//             </h1>
//           </div>
//         </div>
//       </section>

//       {/* =========================================================
//           INTRO
//       ========================================================= */}

//       <section className="border-b border-black/10 bg-[#f7f7f5]">
//         <div className="mx-auto max-w-[1800px] px-6 py-20 md:px-10 md:py-28 lg:px-14">
//           <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
//             <div>
//               <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.3em] text-black/35 md:text-xs">
//                 Contact us
//               </p>

//               <h2 className="mt-5 max-w-4xl font-bebas text-5xl leading-[0.95] tracking-wide md:text-7xl lg:text-8xl">
//                 Questions?
//                 <br />
//                 We are here.
//               </h2>
//             </div>

//             <div className="flex items-end">
//               <p className="max-w-xl font-montserrat text-sm leading-7 text-black/55 md:text-base md:leading-8">
//                 Have a question about a vehicle, want to arrange a visit,
//                 schedule a test drive or simply need more information? Send us
//                 a message and our team will get back to you.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* =========================================================
//           CONTACT + FORM
//       ========================================================= */}

//       <section className="bg-white">
//         <div className="mx-auto max-w-[1800px] px-6 py-16 md:px-10 md:py-24 lg:px-14">
//           <div className="grid gap-0 border border-black/10 lg:grid-cols-[0.75fr_1.25fr]">
//             {/* =====================================================
//                 LEFT INFORMATION
//             ===================================================== */}

//             <div className="bg-[#f3f3f1] p-7 md:p-10 lg:p-12">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.3em] text-black/35">
//                     Contact details
//                   </p>

//                   <h3 className="mt-3 font-bebas text-4xl tracking-wide md:text-5xl">
//                     Reach us
//                   </h3>
//                 </div>

//                 <span className="font-bebas text-7xl leading-none text-black/[0.06]">
//                   01
//                 </span>
//               </div>

//               <div className="mt-10 space-y-0">
//                 <ContactInfo
//                   icon={Phone}
//                   label="Phone"
//                   value="00000000"
//                 />

//                 <ContactInfo
//                   icon={Mail}
//                   label="Email"
//                   value="hello@example.com"
//                   href="mailto:hello@example.com"
//                 />

//                 <ContactInfo
//                   icon={MapPin}
//                   label="Address"
//                   value={
//                     "Demo showroom address"
//                   }
//                 />
//               </div>

//             </div>

//             {/* =====================================================
//                 FORM
//             ===================================================== */}

//             <div className="bg-white p-7 md:p-10 lg:p-14">
//               <div className="flex items-start justify-between gap-6">
//                 <div>
//                   <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.3em] text-black/35">
//                     Send an inquiry
//                   </p>

//                   <h3 className="mt-3 font-bebas text-4xl tracking-wide md:text-5xl">
//                     Tell us what you need.
//                   </h3>
//                 </div>

//                 <span className="hidden font-bebas text-7xl leading-none text-black/[0.05] sm:block">
//                   02
//                 </span>
//               </div>

//               {/* VEHICLE INQUIRY */}
//               {car && (
//                 <div className="mt-10 overflow-hidden border border-black/10 bg-[#f3f3f1]">
//                   <div className="flex flex-col sm:flex-row">
//                     <div className="relative h-52 w-full shrink-0 sm:h-36 sm:w-52">
//                       {car.images?.[0]?.url ? (
//                         <Image
//                           src={car.images[0].url}
//                           alt={`${car.make} ${car.model}`}
//                           fill
//                           sizes="(max-width: 640px) 100vw, 208px"
//                           className="object-cover"
//                         />
//                       ) : (
//                         <div className="flex h-full w-full items-center justify-center bg-black/[0.04]">
//                           <CarFront
//                             size={32}
//                             strokeWidth={1}
//                             className="text-black/20"
//                           />
//                         </div>
//                       )}
//                     </div>

//                     <div className="flex flex-1 flex-col justify-center p-5">
//                       <p className="font-montserrat text-[9px] font-medium uppercase tracking-[0.2em] text-black/35">
//                         Vehicle inquiry
//                       </p>

//                       <h4 className="mt-2 font-bebas text-3xl tracking-wide">
//                         {car.make} {car.model}
//                       </h4>

//                       <p className="mt-1 font-montserrat text-xs text-black/45">
//                         {car.year} · {car.currency}{" "}
//                         {new Intl.NumberFormat("en-US").format(
//                           car.price
//                         )}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {success && (
//                 <div className="mt-8 border border-green-200 bg-green-50 px-5 py-4">
//                   <p className="font-montserrat text-sm leading-6 text-green-700">
//                     {success}
//                   </p>
//                 </div>
//               )}

//               {error && (
//                 <div className="mt-8 border border-red-200 bg-red-50 px-5 py-4">
//                   <p className="font-montserrat text-sm leading-6 text-red-700">
//                     {error}
//                   </p>
//                 </div>
//               )}

//               <form
//                 onSubmit={handleSubmit}
//                 className="mt-10 space-y-7"
//               >
//                 {/* NAME */}
//                 <div>
//                   <label
//                     htmlFor="customerName"
//                     className="mb-2 block font-montserrat text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50"
//                   >
//                     Full name
//                   </label>

//                   <input
//                     id="customerName"
//                     name="customerName"
//                     value={form.customerName}
//                     onChange={handleChange}
//                     required
//                     maxLength={100}
//                     placeholder="John Smith"
//                     className="h-14 w-full border-b border-black/15 bg-transparent px-1 font-montserrat text-sm outline-none placeholder:text-black/25 transition-colors focus:border-black"
//                   />
//                 </div>

//                 {/* PHONE + EMAIL */}
//                 <div className="grid gap-7 sm:grid-cols-2">
//                   <div>
//                     <label
//                       htmlFor="phone"
//                       className="mb-2 block font-montserrat text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50"
//                     >
//                       Phone
//                     </label>

//                     <input
//                       id="phone"
//                       name="phone"
//                       type="tel"
//                       value={form.phone}
//                       onChange={handleChange}
//                       required
//                       maxLength={30}
//                       placeholder="00000000"
//                       className="h-14 w-full border-b border-black/15 bg-transparent px-1 font-montserrat text-sm outline-none placeholder:text-black/25 transition-colors focus:border-black"
//                     />
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="email"
//                       className="mb-2 block font-montserrat text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50"
//                     >
//                       Email
//                       <span className="ml-1 font-normal text-black/30">
//                         (optional)
//                       </span>
//                     </label>

//                     <input
//                       id="email"
//                       name="email"
//                       type="email"
//                       value={form.email}
//                       onChange={handleChange}
//                       maxLength={150}
//                       placeholder="john@example.com"
//                       className="h-14 w-full border-b border-black/15 bg-transparent px-1 font-montserrat text-sm outline-none placeholder:text-black/25 transition-colors focus:border-black"
//                     />
//                   </div>
//                 </div>

//                 {/* MESSAGE */}
//                 <div>
//                   <label
//                     htmlFor="message"
//                     className="mb-2 block font-montserrat text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50"
//                   >
//                     Message
//                   </label>

//                   <textarea
//                     id="message"
//                     name="message"
//                     value={form.message}
//                     onChange={handleChange}
//                     required
//                     maxLength={2000}
//                     rows={6}
//                     placeholder="How can we help?"
//                     className="w-full resize-none border-b border-black/15 bg-transparent px-1 py-3 font-montserrat text-sm leading-7 outline-none placeholder:text-black/25 transition-colors focus:border-black"
//                   />
//                 </div>

//                 {/* SUBMIT */}
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="group inline-flex w-full items-center justify-between bg-black px-6 py-5 font-montserrat text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   <span>
//                     {submitting ? "Sending..." : "Send message"}
//                   </span>

//                   <Send
//                     size={17}
//                     strokeWidth={1.4}
//                     className="transition-transform duration-300 group-hover:translate-x-1"
//                   />
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </section>


   
//       {/* =========================================================
//           LOCATION
//       ========================================================= */}

//       <section className="bg-[#f7f7f5] px-6 py-16 md:px-10 md:py-24 lg:px-14">
//         <div className="mx-auto grid max-w-[1800px] overflow-hidden border border-black/10 bg-white lg:grid-cols-[0.7fr_1.3fr]">
//           <div className="flex flex-col justify-center bg-[#181818] p-7 text-white md:p-10 lg:p-14">
//             <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.3em] text-white/35">
//               Demo location
//             </p>

//             <h2 className="mt-5 max-w-lg font-bebas text-5xl leading-[0.92] tracking-wide md:text-7xl">
//               Showroom details
//               <br />
//               go here.
//             </h2>

//             <p className="mt-6 max-w-sm font-montserrat text-sm leading-7 text-white/60">
//               This area is placeholder content for the demo website. Add a verified showroom address and map before launch.
//             </p>
//           </div>

//           <div className="flex min-h-[320px] items-center justify-center bg-[#e8e8e5] p-8 text-center md:min-h-[420px]">
//             <div>
//               <MapPin size={28} strokeWidth={1.2} className="mx-auto text-black/35" />
//               <p className="mt-4 font-montserrat text-[10px] font-semibold uppercase tracking-[0.2em] text-black/45">
//                 Demo map placeholder
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* =========================================================
//           FINAL CTA
//       ========================================================= */}

//       <section className="bg-black px-6 py-5 text-white md:px-10 lg:px-14">
//         <div className="mx-auto max-w-[1800px]">
//           <div className="relative overflow-hidden px-7 py-16 md:px-12 md:py-24 lg:px-16">
//             {/* DECORATIVE NUMBER */}
//             <span className="absolute -bottom-16 -right-4 font-bebas text-[18rem] leading-none tracking-[-0.08em] text-white/[0.035] md:text-[24rem]">
//               03
//             </span>

//             <div className="relative z-10 max-w-3xl">
//               <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.3em] text-white/35 md:text-xs">
//                 Your next vehicle
//               </p>

//               <h2 className="mt-5 font-bebas text-6xl leading-[0.9] tracking-wide md:text-8xl">
//                 Still looking?
//                 <br />
//                 Explore our inventory.
//               </h2>

//               <p className="mt-6 max-w-xl font-montserrat text-sm leading-7 text-white/45 md:text-base">
//                 Take a look at our current vehicles and find something that
//                 catches your eye.
//               </p>

//               <Link
//                 href="/cars"
//                 className="group mt-9 inline-flex items-center gap-5 bg-white px-6 py-4 font-montserrat text-[10px] font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-white/90"
//               >
//                 Browse inventory

//                 <ArrowUpRight
//                   size={17}
//                   strokeWidth={1.4}
//                   className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
//                 />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* =========================================================
//           FOOTER
//       ========================================================= */}

//       <footer className="border-t border-white/10 bg-black px-6 pb-8 text-white md:px-10 lg:px-14">
//         <div className="mx-auto flex max-w-[1800px] flex-col justify-between gap-4 pt-8 sm:flex-row">
//           <p className="font-montserrat text-[10px] uppercase tracking-[0.15em] text-white/25">
//             © {new Date().getFullYear()} Demo Auto · Demo website
//           </p>

//           <p className="font-montserrat text-[10px] uppercase tracking-[0.15em] text-white/25">
//             All rights reserved.
//           </p>
//         </div>
//       </footer>
//     </main>
//   );
// }

// /* =========================================================
//    CONTACT INFO
// ========================================================= */

// function ContactInfo({
//   icon: Icon,
//   label,
//   value,
//   href,
// }) {
//   const content = (
//     <div className="group flex gap-4 border-b border-black/10 py-5 first:pt-0 last:border-0">
//       <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-black/10 bg-white transition-all duration-300 group-hover:border-black/25">
//         <Icon
//           size={17}
//           strokeWidth={1.3}
//           className="text-black/55"
//         />
//       </div>

//       <div className="min-w-0">
//         <p className="font-montserrat text-[9px] font-medium uppercase tracking-[0.2em] text-black/35">
//           {label}
//         </p>

//         <p className="mt-2 break-words font-montserrat text-sm font-medium">
//           {value || "Not provided"}
//         </p>
//       </div>

//       {href && (
//         <ArrowUpRight
//           size={16}
//           strokeWidth={1.3}
//           className="ml-auto shrink-0 text-black/25 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
//         />
//       )}
//     </div>
//   );

//   if (!value || !href) {
//     return content;
//   }

//   return (
//     <a
//       href={href}
//       target={
//         href.startsWith("https://")
//           ? "_blank"
//           : undefined
//       }
//       rel={
//         href.startsWith("https://")
//           ? "noopener noreferrer"
//           : undefined
//       }
//       className="block"
//     >
//       {content}
//     </a>
//   );
// }

