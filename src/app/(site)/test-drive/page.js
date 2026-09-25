"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  Clock3,
  Mail,
  MessageSquare,
  Phone,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

/* =========================================================
   TIME SLOTS
========================================================= */

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

/* =========================================================
   DATE HELPERS
========================================================= */

function getDateOptions() {
  const dates = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date();

    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + i);

    const value = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    dates.push({
      value,
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      number: date.getDate(),
      month: date.toLocaleDateString("en-US", {
        month: "short",
      }),
      full: date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    });
  }

  return dates;
}

/* =========================================================
   IMAGE SKELETON
========================================================= */

function ImageSkeleton({ className = "" }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-[#e9e9e7] ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

/* =========================================================
   LOADING PAGE SKELETON
========================================================= */

function TestDriveSkeleton() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* NAVBAR PLACEHOLDER */}
      <div className="h-20 w-full bg-[#181818]" />

      {/* HERO SKELETON */}
      <section className="relative min-h-[72vh] overflow-hidden bg-[#e9e9e7]">
        <ImageSkeleton />

        <div className="absolute inset-0 bg-black/5" />

        <div className="relative z-10 mx-auto flex min-h-[72vh] w-full max-w-[1400px] items-end px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <div className="w-full">
            <div className="mb-10 flex items-center justify-between border-b border-black/10 pb-5">
              <div className="h-3 w-32 animate-pulse bg-black/10" />
              <div className="h-3 w-12 animate-pulse bg-black/10" />
            </div>

            <div className="max-w-5xl">
              <div className="mb-5 h-3 w-24 animate-pulse bg-black/10" />

              <div className="h-20 w-[75%] animate-pulse bg-black/10 sm:h-28 lg:h-40" />

              <div className="mt-7 h-3 w-24 animate-pulse bg-black/10" />
            </div>
          </div>
        </div>
      </section>

      {/* STEPS SKELETON */}
      <section className="border-b border-black/10">
        <div className="mx-auto grid max-w-[1400px] grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="border-r border-black/10 px-4 py-5 last:border-r-0 sm:px-8"
            >
              <div className="h-2 w-5 animate-pulse bg-black/10" />

              <div className="mt-3 h-3 w-20 animate-pulse bg-black/10" />
            </div>
          ))}
        </div>
      </section>

      {/* CONTENT SKELETON */}
      <section className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.35fr_1fr] lg:gap-24">
          <div>
            <div className="h-3 w-28 animate-pulse bg-black/10" />

            <div className="mt-7 space-y-3">
              <div className="h-12 w-full animate-pulse bg-black/10 sm:h-16" />
              <div className="h-12 w-[85%] animate-pulse bg-black/10 sm:h-16" />
              <div className="h-12 w-[60%] animate-pulse bg-black/10 sm:h-16" />
            </div>

            <div className="mt-8 h-3 w-full animate-pulse bg-black/10" />
            <div className="mt-3 h-3 w-[80%] animate-pulse bg-black/10" />
          </div>

          <div>
            <div className="grid gap-10 md:grid-cols-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={item === 3 ? "md:col-span-2" : ""}
                >
                  <div className="mb-4 h-2 w-24 animate-pulse bg-black/10" />
                  <div className="h-12 w-full animate-pulse border-b border-black/10 bg-black/[0.02]" />
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-end">
              <div className="h-14 w-32 animate-pulse bg-black/10" />
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </main>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function TestDrivePage() {
  const searchParams = useSearchParams();

  const carId = searchParams.get("car");

  const [car, setCar] = useState(null);
  const [loadingCar, setLoadingCar] = useState(true);

  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [bottomImageLoaded, setBottomImageLoaded] = useState(false);

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const dateOptions = useMemo(() => getDateOptions(), []);

  /* =========================================================
     FETCH CAR
  ========================================================= */

  useEffect(() => {
    async function fetchCar() {
      if (!carId) {
        setLoadingCar(false);
        return;
      }

      try {
        setLoadingCar(true);

        const response = await fetch(`/api/cars/${carId}`);

        const result = await response.json();

        if (result.success) {
          setCar(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch car:", error);
      } finally {
        setLoadingCar(false);
      }
    }

    fetchCar();
  }, [carId]);

  /* =========================================================
     FORM HELPERS
  ========================================================= */

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function goToStepTwo() {
    if (!form.customerName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    setError("");
    setStep(2);
    scrollToTop();
  }

  function goToStepThree() {
    if (!form.date) {
      setError("Please select a date.");
      return;
    }

    if (!form.time) {
      setError("Please select a time.");
      return;
    }

    setError("");
    setStep(3);
    scrollToTop();
  }

  function goBack() {
    setError("");

    setStep((previous) => Math.max(1, previous - 1));

    scrollToTop();
  }

  /* =========================================================
     SUBMIT
  ========================================================= */

  async function handleSubmit(event) {
    event.preventDefault();

    if (!carId) {
      setError("No vehicle has been selected.");
      return;
    }

    if (!form.customerName.trim()) {
      setError("Please enter your name.");
      setStep(1);
      return;
    }

    if (!form.phone.trim()) {
      setError("Please enter your phone number.");
      setStep(1);
      return;
    }

    if (!form.date) {
      setError("Please select a date.");
      setStep(2);
      return;
    }

    if (!form.time) {
      setError("Please select a time.");
      setStep(2);
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch("/api/test-drives", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          carId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Something went wrong. Please try again."
        );
      }

      setSuccess(true);

      scrollToTop();
    } catch (error) {
      setError(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (loadingCar) {
    return <TestDriveSkeleton />;
  }

  /* =========================================================
     NO VEHICLE
  ========================================================= */

  if (!carId || !car) {
    return (
      <main className="min-h-screen bg-white text-black">
        <div className="h-20 w-full bg-[#181818]" />

        <section className="flex min-h-[75vh] items-center justify-center px-6">
          <div className="max-w-xl text-center">
            <p className="mb-5 font-montserrat text-[11px] uppercase tracking-[0.3em] text-black/45">
              Test Drive
            </p>

            <h1 className="font-bebas text-[64px] leading-[0.85] tracking-wide sm:text-[90px]">
              VEHICLE NOT
              <br />
              SELECTED
            </h1>

            <p className="mx-auto mt-7 max-w-md font-montserrat text-[13px] leading-6 text-black/55">
              Please select a vehicle from our inventory before requesting a
              test drive.
            </p>

            <Link
              href="/cars"
              className="group mt-9 inline-flex items-center gap-3 bg-black px-7 py-4 font-montserrat text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-black/80"
            >
              Browse inventory

              <ArrowUpRight
                size={15}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  /* =========================================================
     CAR DATA
  ========================================================= */

  const carImage =
    car.car.images?.[0].url ||
    car.car.image ||
    "/images/placeholder-car.jpg";

  const carName = [car.car.make, car.car.model]
    .filter(Boolean)
    .join(" ");

  const formattedPrice =
    car.price !== undefined && car.price !== null
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: car.currency || "USD",
          maximumFractionDigits: 0,
        }).format(car.price)
      : null;

  const selectedDate = dateOptions.find(
    (item) => item.value === form.date
  );

  /* =========================================================
     SUCCESS
  ========================================================= */

  if (success) {
    return (
      <main className="min-h-screen bg-white text-black">
        {/* <div className="h-20 w-full bg-[#181818]" /> */}

        <section className="relative flex min-h-[calc(100vh-80px)] items-center overflow-hidden bg-[#e9e9e7]">
          {!heroImageLoaded && <ImageSkeleton />}

          <Image
            src={carImage}
            alt={carName}
            fill
            priority
            onLoad={() => setHeroImageLoaded(true)}
            className={`object-cover transition-opacity duration-700 ${
              heroImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            sizes="100vw"
          />

          <div className="absolute inset-0 bg-black/65" />

          <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-24 sm:px-10 lg:px-16">
            <div className="max-w-3xl">
              <div className="mb-8 flex h-12 w-12 items-center justify-center border border-white/30">
                <Check
                  size={22}
                  strokeWidth={1.5}
                  className="text-white"
                />
              </div>

              <p className="mb-5 font-montserrat text-[11px] uppercase tracking-[0.3em] text-white/55">
                Request received
              </p>

              <h1 className="font-bebas text-[78px] leading-[0.82] tracking-wide text-white sm:text-[110px] lg:text-[145px]">
                SEE YOU
                <br />
                BEHIND THE
                <br />
                WHEEL.
              </h1>

              <p className="mt-9 max-w-xl font-montserrat text-[14px] leading-7 text-white/70">
                Your test drive request for the{" "}
                <span className="text-white">{carName}</span> has been
                received. Our team will get in touch with you to confirm the
                appointment.
              </p>

              <div className="mt-12 grid max-w-2xl grid-cols-2 border-t border-white/20">
                <div className="border-r border-white/20 py-6 pr-6">
                  <p className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-white/40">
                    Date
                  </p>

                  <p className="mt-2 font-montserrat text-[13px] text-white">
                    {selectedDate?.full || form.date}
                  </p>
                </div>

                <div className="py-6 pl-6">
                  <p className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-white/40">
                    Time
                  </p>

                  <p className="mt-2 font-montserrat text-[13px] text-white">
                    {form.time}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={`/cars/${car.car._id}`}
                  className="group inline-flex items-center gap-3 bg-white px-7 py-4 font-montserrat text-[10px] font-medium uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-white/90"
                >
                  View vehicle

                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.5}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>

                <Link
                  href="/cars"
                  className="inline-flex items-center gap-3 border border-white/30 px-7 py-4 font-montserrat text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-white"
                >
                  Browse inventory
                </Link>
              </div>
            </div>
          </div>
        </section>

        <style jsx global>{`
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </main>
    );
  }

  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <main className="min-h-screen bg-white text-black">
      {/* =====================================================
          NAVBAR SPACE
      ===================================================== */}

      {/* <div className="h-20 w-full bg-[#181818]" /> */}

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative min-h-[72vh] overflow-hidden bg-[#e9e9e7]">
        {/* IMAGE SKELETON */}
        <AnimatePresence>
          {!heroImageLoaded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0 z-10"
            >
              <ImageSkeleton />
            </motion.div>
          )}
        </AnimatePresence>

        {/* IMAGE */}
        <Image
          src={carImage}
          alt={carName}
          fill
          priority
          onLoad={() => setHeroImageLoaded(true)}
          className={`object-cover transition-opacity duration-700 ${
            heroImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          sizes="100vw"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20" />

        {/* HERO CONTENT */}
        <div className="relative z-20 mx-auto flex min-h-[72vh] w-full max-w-[1400px] items-end px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <div className="w-full">
            <div className="mb-10 flex items-center justify-between border-b border-white/20 pb-5">
              <p className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-white/55">
                Test Drive Experience
              </p>

              <p className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-white/40">
                {String(step).padStart(2, "0")} / 03
              </p>
            </div>

            <div className="max-w-5xl">
              <p className="mb-4 font-montserrat text-[11px] uppercase tracking-[0.25em] text-white/55">
                {car.year} · {car.bodyType || "Vehicle"}
              </p>

              <h1 className="font-bebas text-[76px] leading-[0.82] tracking-wide text-white sm:text-[110px] lg:text-[150px]">
                {carName}
              </h1>

              {formattedPrice && (
                <p className="mt-7 font-montserrat text-[14px] tracking-wide text-white/65">
                  {formattedPrice}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STEP NAVIGATION
      ===================================================== */}

      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto grid max-w-[1400px] grid-cols-3">
          <button
            type="button"
            onClick={() => {
              setStep(1);
              setError("");
            }}
            className={`border-r border-black/10 px-4 py-5 text-left transition-colors duration-300 sm:px-8 ${
              step === 1
                ? "bg-black text-white"
                : "hover:bg-black/[0.03]"
            }`}
          >
            <span className="font-montserrat text-[9px] tracking-[0.2em] opacity-45">
              01
            </span>

            <span className="ml-3 font-montserrat text-[10px] uppercase tracking-[0.18em]">
              You
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (form.customerName && form.phone) {
                setStep(2);
                setError("");
              }
            }}
            className={`border-r border-black/10 px-4 py-5 text-left transition-colors duration-300 sm:px-8 ${
              step === 2
                ? "bg-black text-white"
                : "hover:bg-black/[0.03]"
            }`}
          >
            <span className="font-montserrat text-[9px] tracking-[0.2em] opacity-45">
              02
            </span>

            <span className="ml-3 font-montserrat text-[10px] uppercase tracking-[0.18em]">
              Date & Time
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (
                form.customerName &&
                form.phone &&
                form.date &&
                form.time
              ) {
                setStep(3);
                setError("");
              }
            }}
            className={`px-4 py-5 text-left transition-colors duration-300 sm:px-8 ${
              step === 3
                ? "bg-black text-white"
                : "hover:bg-black/[0.03]"
            }`}
          >
            <span className="font-montserrat text-[9px] tracking-[0.2em] opacity-45">
              03
            </span>

            <span className="ml-3 font-montserrat text-[10px] uppercase tracking-[0.18em]">
              Final details
            </span>
          </button>
        </div>
      </section>

      {/* =====================================================
          MAIN FORM EXPERIENCE
      ===================================================== */}

      <section className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <AnimatePresence mode="wait">
          {/* =================================================
              STEP 1
          ================================================= */}

          {step === 1 && (
            <motion.div
              key="step-one"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
            >
              <div className="grid gap-14 lg:grid-cols-[0.35fr_1fr] lg:gap-24">
                <div>
                  <p className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-black/40">
                    01 — Your details
                  </p>

                  <h2 className="mt-6 max-w-xs font-bebas text-[64px] leading-[0.85] tracking-wide sm:text-[82px]">
                    LET&apos;S GET TO KNOW YOU.
                  </h2>

                  <p className="mt-7 max-w-sm font-montserrat text-[12px] leading-6 text-black/50">
                    Tell us a little about yourself so our team can prepare
                    everything for your visit.
                  </p>
                </div>

                <div>
                  <div className="grid gap-x-10 gap-y-10 md:grid-cols-2">
                    {/* NAME */}
                    <label className="group block">
                      <span className="mb-3 flex items-center gap-2 font-montserrat text-[9px] uppercase tracking-[0.25em] text-black/45">
                        <User size={13} strokeWidth={1.4} />
                        Full name
                      </span>

                      <input
                        type="text"
                        value={form.customerName}
                        onChange={(event) =>
                          updateField(
                            "customerName",
                            event.target.value
                          )
                        }
                        placeholder="Your name"
                        className="w-full border-b border-black/15 bg-transparent px-0 py-4 font-montserrat text-[15px] outline-none transition-colors placeholder:text-black/25 focus:border-black"
                      />
                    </label>

                    {/* PHONE */}
                    <label className="group block">
                      <span className="mb-3 flex items-center gap-2 font-montserrat text-[9px] uppercase tracking-[0.25em] text-black/45">
                        <Phone size={13} strokeWidth={1.4} />
                        Phone number
                      </span>

                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(event) =>
                          updateField(
                            "phone",
                            event.target.value
                          )
                        }
                        placeholder="Your phone number"
                        className="w-full border-b border-black/15 bg-transparent px-0 py-4 font-montserrat text-[15px] outline-none transition-colors placeholder:text-black/25 focus:border-black"
                      />
                    </label>

                    {/* EMAIL */}
                    <label className="group block md:col-span-2">
                      <span className="mb-3 flex items-center gap-2 font-montserrat text-[9px] uppercase tracking-[0.25em] text-black/45">
                        <Mail size={13} strokeWidth={1.4} />
                        Email address
                        <span className="text-black/25">
                          (optional)
                        </span>
                      </span>

                      <input
                        type="email"
                        value={form.email}
                        onChange={(event) =>
                          updateField(
                            "email",
                            event.target.value
                          )
                        }
                        placeholder="you@example.com"
                        className="w-full border-b border-black/15 bg-transparent px-0 py-4 font-montserrat text-[15px] outline-none transition-colors placeholder:text-black/25 focus:border-black"
                      />
                    </label>
                  </div>

                  {/* ERROR */}
                  {error && (
                    <p className="mt-8 border-l-2 border-black px-4 py-2 font-montserrat text-[11px] leading-5 text-black/60">
                      {error}
                    </p>
                  )}

                  {/* CONTINUE */}
                  <div className="mt-12 flex justify-end">
                    <button
                      type="button"
                      onClick={goToStepTwo}
                      className="group inline-flex items-center gap-4 bg-black px-8 py-5 font-montserrat text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-black/80"
                    >
                      Continue

                      <ArrowRight
                        size={16}
                        strokeWidth={1.4}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* =================================================
              STEP 2
          ================================================= */}

          {step === 2 && (
            <motion.div
              key="step-two"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
            >
              <div className="grid gap-14 lg:grid-cols-[0.35fr_1fr] lg:gap-24">
                <div>
                  <p className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-black/40">
                    02 — Your appointment
                  </p>

                  <h2 className="mt-6 max-w-xs font-bebas text-[64px] leading-[0.85] tracking-wide sm:text-[82px]">
                    WHEN WOULD YOU LIKE TO EXPERIENCE IT?
                  </h2>

                  <p className="mt-7 max-w-sm font-montserrat text-[12px] leading-6 text-black/50">
                    Choose a day and time that works for you. We&apos;ll take
                    care of the rest.
                  </p>
                </div>

                <div>
                  {/* DATE */}
                  <div>
                    <div className="mb-6 flex items-center gap-3">
                      <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-black/40">
                        Select a date
                      </span>

                      <div className="h-px flex-1 bg-black/10" />
                    </div>

                    <div className="grid grid-cols-3 border-l border-t border-black/10 sm:grid-cols-4 lg:grid-cols-7">
                      {dateOptions.map((date) => {
                        const selected =
                          form.date === date.value;

                        return (
                          <button
                            key={date.value}
                            type="button"
                            onClick={() =>
                              updateField(
                                "date",
                                date.value
                              )
                            }
                            className={`group border-b border-r border-black/10 px-3 py-5 text-center transition-all duration-300 sm:px-4 ${
                              selected
                                ? "bg-black text-white"
                                : "hover:bg-black/[0.04]"
                            }`}
                          >
                            <span
                              className={`block font-montserrat text-[9px] uppercase tracking-[0.18em] ${
                                selected
                                  ? "text-white/55"
                                  : "text-black/40"
                              }`}
                            >
                              {date.day}
                            </span>

                            <span className="mt-2 block font-bebas text-[30px] leading-none">
                              {date.number}
                            </span>

                            <span
                              className={`mt-1 block font-montserrat text-[9px] uppercase tracking-[0.15em] ${
                                selected
                                  ? "text-white/55"
                                  : "text-black/35"
                              }`}
                            >
                              {date.month}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* TIME */}
                  <div className="mt-14">
                    <div className="mb-6 flex items-center gap-3">
                      <span className="flex items-center gap-2 font-montserrat text-[9px] uppercase tracking-[0.25em] text-black/40">
                        <Clock3
                          size={13}
                          strokeWidth={1.4}
                        />
                        Select a time
                      </span>

                      <div className="h-px flex-1 bg-black/10" />
                    </div>

                    <div className="grid grid-cols-3 border-l border-t border-black/10 sm:grid-cols-4 lg:grid-cols-6">
                      {TIME_SLOTS.map((time) => {
                        const selected =
                          form.time === time;

                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() =>
                              updateField(
                                "time",
                                time
                              )
                            }
                            className={`border-b border-r border-black/10 px-3 py-4 font-montserrat text-[11px] tracking-[0.08em] transition-all duration-300 ${
                              selected
                                ? "bg-black text-white"
                                : "hover:bg-black/[0.04]"
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ERROR */}
                  {error && (
                    <p className="mt-8 border-l-2 border-black px-4 py-2 font-montserrat text-[11px] leading-5 text-black/60">
                      {error}
                    </p>
                  )}

                  {/* BUTTONS */}
                  <div className="mt-12 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={goBack}
                      className="group inline-flex items-center gap-3 border-b border-black/15 pb-2 font-montserrat text-[10px] uppercase tracking-[0.2em] text-black/55 transition-colors hover:border-black hover:text-black"
                    >
                      <ChevronLeft
                        size={15}
                        strokeWidth={1.4}
                        className="transition-transform duration-300 group-hover:-translate-x-1"
                      />

                      Back
                    </button>

                    <button
                      type="button"
                      onClick={goToStepThree}
                      className="group inline-flex items-center gap-4 bg-black px-8 py-5 font-montserrat text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-black/80"
                    >
                      Continue

                      <ArrowRight
                        size={16}
                        strokeWidth={1.4}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* =================================================
              STEP 3
          ================================================= */}

          {step === 3 && (
            <motion.div
              key="step-three"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
            >
              <div className="grid gap-14 lg:grid-cols-[0.35fr_1fr] lg:gap-24">
                <div>
                  <p className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-black/40">
                    03 — Final details
                  </p>

                  <h2 className="mt-6 max-w-xs font-bebas text-[64px] leading-[0.85] tracking-wide sm:text-[82px]">
                    ANYTHING WE SHOULD KNOW?
                  </h2>

                  <p className="mt-7 max-w-sm font-montserrat text-[12px] leading-6 text-black/50">
                    Let us know if there is anything specific you&apos;d like
                    to discuss or experience during your visit.
                  </p>
                </div>

                <div>
                  <form onSubmit={handleSubmit}>
                    {/* MESSAGE */}
                    <label className="block">
                      <span className="mb-4 flex items-center gap-2 font-montserrat text-[9px] uppercase tracking-[0.25em] text-black/45">
                        <MessageSquare
                          size={13}
                          strokeWidth={1.4}
                        />

                        Message

                        <span className="text-black/25">
                          (optional)
                        </span>
                      </span>

                      <textarea
                        value={form.message}
                        onChange={(event) =>
                          updateField(
                            "message",
                            event.target.value
                          )
                        }
                        placeholder="Tell us anything you'd like us to know..."
                        rows={8}
                        className="w-full resize-none border border-black/10 bg-[#fafafa] px-5 py-5 font-montserrat text-[13px] leading-6 outline-none transition-colors placeholder:text-black/25 focus:border-black/30"
                      />
                    </label>

                    {/* SUMMARY */}
                    <div className="mt-12 border-t border-black/10">
                      <div className="grid grid-cols-1 border-b border-black/10 sm:grid-cols-3">
                        <div className="border-b border-black/10 px-0 py-6 sm:border-b-0 sm:border-r sm:px-6">
                          <p className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-black/40">
                            Vehicle
                          </p>

                          <p className="mt-2 font-montserrat text-[13px]">
                            {carName}
                          </p>
                        </div>

                        <div className="border-b border-black/10 px-0 py-6 sm:border-b-0 sm:border-r sm:px-6">
                          <p className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-black/40">
                            Date
                          </p>

                          <p className="mt-2 font-montserrat text-[13px]">
                            {selectedDate?.full ||
                              form.date}
                          </p>
                        </div>

                        <div className="px-0 py-6 sm:px-6">
                          <p className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-black/40">
                            Time
                          </p>

                          <p className="mt-2 font-montserrat text-[13px]">
                            {form.time}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ERROR */}
                    {error && (
                      <p className="mt-8 border-l-2 border-black px-4 py-2 font-montserrat text-[11px] leading-5 text-black/60">
                        {error}
                      </p>
                    )}

                    {/* ACTIONS */}
                    <div className="mt-12 flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        onClick={goBack}
                        className="group inline-flex w-fit items-center gap-3 border-b border-black/15 pb-2 font-montserrat text-[10px] uppercase tracking-[0.2em] text-black/55 transition-colors hover:border-black hover:text-black"
                      >
                        <ChevronLeft
                          size={15}
                          strokeWidth={1.4}
                          className="transition-transform duration-300 group-hover:-translate-x-1"
                        />

                        Back
                      </button>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="group inline-flex items-center justify-center gap-4 bg-black px-9 py-5 font-montserrat text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {submitting
                          ? "Sending request..."
                          : "Request test drive"}

                        {!submitting && (
                          <ArrowUpRight
                            size={16}
                            strokeWidth={1.4}
                            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                          />
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* =====================================================
          VEHICLE STRIP
      ===================================================== */}

      <section className="border-t border-black/10 bg-[#f7f7f5]">
        <div className="mx-auto grid max-w-[1400px] md:grid-cols-[280px_1fr]">
          <div className="relative min-h-[230px] overflow-hidden bg-[#e9e9e7] md:min-h-full">
            {/* BOTTOM IMAGE SKELETON */}
            <AnimatePresence>
              {!bottomImageLoaded && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 z-10"
                >
                  <ImageSkeleton />
                </motion.div>
              )}
            </AnimatePresence>

            <Image
              src={carImage}
              alt={carName}
              fill
              onLoad={() => setBottomImageLoaded(true)}
              className={`object-cover transition-opacity duration-700 ${
                bottomImageLoaded
                  ? "opacity-100"
                  : "opacity-0"
              }`}
              sizes="280px"
            />

            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
            <p className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-black/40">
              Your selected vehicle
            </p>

            <div className="mt-5 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
              <div>
                <p className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-black/40">
                  {car.year}
                </p>

                <h3 className="mt-2 font-bebas text-[52px] leading-none tracking-wide">
                  {carName}
                </h3>
              </div>

              <Link
                href={`/cars/${car.car._id}`}
                className="group inline-flex w-fit items-center gap-3 border-b border-black/20 pb-2 font-montserrat text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-black"
              >
                View vehicle

                <ArrowUpRight
                  size={14}
                  strokeWidth={1.4}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}

      <section className="bg-[#181818] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-12 lg:flex-row lg:items-end">
          <div>
            <p className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-white/40">
              Still deciding?
            </p>

            <h2 className="mt-5 max-w-3xl font-bebas text-[64px] leading-[0.85] tracking-wide sm:text-[90px]">
              TAKE YOUR TIME.
              <br />
              FIND YOUR CAR.
            </h2>
          </div>

          <Link
            href="/cars"
            className="group inline-flex w-fit items-center gap-4 border-b border-white/25 pb-3 font-montserrat text-[10px] uppercase tracking-[0.2em] text-white/70 transition-colors hover:border-white hover:text-white"
          >
            Explore inventory

            <ArrowUpRight
              size={16}
              strokeWidth={1.4}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>
      </section>

      {/* =====================================================
          GLOBAL SKELETON ANIMATION
      ===================================================== */}

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </main>
  );
}

// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { AnimatePresence, motion } from "framer-motion";
// import {
//   ArrowLeft,
//   ArrowRight,
//   ArrowUpRight,
//   Check,
//   ChevronLeft,
//   ChevronRight,
//   Clock3,
//   Mail,
//   MessageSquare,
//   Phone,
//   User,
// } from "lucide-react";
// import { useEffect, useMemo, useState } from "react";

// const TIME_SLOTS = [
//   "09:00",
//   "09:30",
//   "10:00",
//   "10:30",
//   "11:00",
//   "11:30",
//   "12:00",
//   "12:30",
//   "13:00",
//   "13:30",
//   "14:00",
//   "14:30",
//   "15:00",
//   "15:30",
//   "16:00",
//   "16:30",
//   "17:00",
//   "17:30",
// ];

// function getTodayDate() {
//   const today = new Date();

//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, "0");
//   const day = String(today.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// }

// function getDateOptions() {
//   const dates = [];

//   for (let i = 0; i < 7; i++) {
//     const date = new Date();

//     date.setHours(12, 0, 0, 0);
//     date.setDate(date.getDate() + i);

//     const value = [
//       date.getFullYear(),
//       String(date.getMonth() + 1).padStart(2, "0"),
//       String(date.getDate()).padStart(2, "0"),
//     ].join("-");

//     dates.push({
//       value,
//       day: date.toLocaleDateString("en-US", {
//         weekday: "short",
//       }),
//       number: date.getDate(),
//       month: date.toLocaleDateString("en-US", {
//         month: "short",
//       }),
//       full: date.toLocaleDateString("en-US", {
//         weekday: "long",
//         month: "long",
//         day: "numeric",
//         year: "numeric",
//       }),
//     });
//   }

//   return dates;
// }

// export default function TestDrivePage() {
//   const searchParams = useSearchParams();

//   const carId = searchParams.get("car");

//   const [car, setCar] = useState(null);
//   const [loadingCar, setLoadingCar] = useState(true);

//   const [step, setStep] = useState(1);

//   const [form, setForm] = useState({
//     customerName: "",
//     phone: "",
//     email: "",
//     date: "",
//     time: "",
//     message: "",
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   const dateOptions = useMemo(() => getDateOptions(), []);

//   useEffect(() => {
//     async function fetchCar() {
//       if (!carId) {
//         setLoadingCar(false);
//         return;
//       }

//       try {
//         const response = await fetch(`/api/cars/${carId}`);

//         const result = await response.json();

//         if (result.success) {
//           setCar(result.data);
//         }
//       } catch (error) {
//         console.error("Failed to fetch car:", error);
//       } finally {
//         setLoadingCar(false);
//       }
//     }

//     fetchCar();
//   }, [carId]);

//   function updateField(field, value) {
//     setForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }));

//     setError("");
//   }

//   function goToStepTwo() {
//     if (!form.customerName.trim()) {
//       setError("Please enter your name.");
//       return;
//     }

//     if (!form.phone.trim()) {
//       setError("Please enter your phone number.");
//       return;
//     }

//     setError("");
//     setStep(2);
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   }

//   function goToStepThree() {
//     if (!form.date) {
//       setError("Please select a date.");
//       return;
//     }

//     if (!form.time) {
//       setError("Please select a time.");
//       return;
//     }

//     setError("");
//     setStep(3);

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   }

//   function goBack() {
//     setError("");
//     setStep((prev) => Math.max(1, prev - 1));

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   }

//   async function handleSubmit(event) {
//     event.preventDefault();

//     if (!carId) {
//       setError("No vehicle has been selected.");
//       return;
//     }

//     if (!form.customerName.trim()) {
//       setError("Please enter your name.");
//       setStep(1);
//       return;
//     }

//     if (!form.phone.trim()) {
//       setError("Please enter your phone number.");
//       setStep(1);
//       return;
//     }

//     if (!form.date) {
//       setError("Please select a date.");
//       setStep(2);
//       return;
//     }

//     if (!form.time) {
//       setError("Please select a time.");
//       setStep(2);
//       return;
//     }

//     try {
//       setSubmitting(true);
//       setError("");

//       const response = await fetch("/api/test-drives", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...form,
//           carId,
//         }),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message || "Something went wrong. Please try again."
//         );
//       }

//       setSuccess(true);

//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });
//     } catch (error) {
//       setError(error.message || "Something went wrong. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (loadingCar) {
//     return (
//       <main className="min-h-screen bg-white text-black">
//         <div className="h-20 w-full bg-[#181818]" />

//         <section className="flex min-h-[70vh] items-center justify-center">
//           <div className="text-center">
//             <div className="mx-auto mb-5 h-8 w-8 animate-spin rounded-full border border-black/15 border-t-black" />

//             <p className="font-montserrat text-[11px] uppercase tracking-[0.25em] text-black/45">
//               Loading vehicle
//             </p>
//           </div>
//         </section>
//       </main>
//     );
//   }

//   if (!carId || !car) {
//     return (
//       <main className="min-h-screen bg-white text-black">
//         <div className="h-20 w-full bg-[#181818]" />

//         <section className="flex min-h-[75vh] items-center justify-center px-6">
//           <div className="max-w-xl text-center">
//             <p className="mb-5 font-montserrat text-[11px] uppercase tracking-[0.3em] text-black/45">
//               Test Drive
//             </p>

//             <h1 className="font-bebas text-[64px] leading-[0.85] tracking-wide sm:text-[90px]">
//               VEHICLE NOT
//               <br />
//               SELECTED
//             </h1>

//             <p className="mx-auto mt-7 max-w-md font-montserrat text-[13px] leading-6 text-black/55">
//               Please select a vehicle from our inventory before requesting a
//               test drive.
//             </p>

//             <Link
//               href="/cars"
//               className="group mt-9 inline-flex items-center gap-3 bg-black px-7 py-4 font-montserrat text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-black/80"
//             >
//               Browse inventory

//               <ArrowUpRight
//                 size={15}
//                 strokeWidth={1.5}
//                 className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
//               />
//             </Link>
//           </div>
//         </section>
//       </main>
//     );
//   }
//   console.log("car", car.car.images?.[0].url);
//   const carImage =
//     car.car.images?.[0].url ||
//     car.image ||
//     "/images/placeholder-car.jpg";

//   const carName = [car.make, car.model].filter(Boolean).join(" ");

//   const formattedPrice =
//     car.price !== undefined && car.price !== null
//       ? new Intl.NumberFormat("en-US", {
//           style: "currency",
//           currency: car.currency || "USD",
//           maximumFractionDigits: 0,
//         }).format(car.price)
//       : null;

//   if (success) {
//     return (
//       <main className="min-h-screen bg-white text-black">
//         {/* <div className="h-20 w-full bg-[#181818]" /> */}

//         <section className="relative flex min-h-[calc(100vh-80px)] items-center overflow-hidden">
//           <div className="absolute inset-0">
//             <Image
//               src={carImage}
//               alt={carName}
//               fill
//               priority
//               className="object-cover"
//               sizes="100vw"
//             />

//             <div className="absolute inset-0 bg-black/65" />
//           </div>

//           <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-24 sm:px-10 lg:px-16">
//             <div className="max-w-3xl">
//               <div className="mb-8 flex h-12 w-12 items-center justify-center border border-white/30">
//                 <Check
//                   size={22}
//                   strokeWidth={1.5}
//                   className="text-white"
//                 />
//               </div>

//               <p className="mb-5 font-montserrat text-[11px] uppercase tracking-[0.3em] text-white/55">
//                 Request received
//               </p>

//               <h1 className="font-bebas text-[78px] leading-[0.82] tracking-wide text-white sm:text-[110px] lg:text-[145px]">
//                 SEE YOU
//                 <br />
//                 BEHIND THE
//                 <br />
//                 WHEEL.
//               </h1>

//               <p className="mt-9 max-w-xl font-montserrat text-[14px] leading-7 text-white/70">
//                 Your test drive request for the{" "}
//                 <span className="text-white">{carName}</span> has been
//                 received. Our team will get in touch with you to confirm the
//                 appointment.
//               </p>

//               <div className="mt-12 grid max-w-2xl grid-cols-2 border-t border-white/20">
//                 <div className="border-r border-white/20 py-6 pr-6">
//                   <p className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-white/40">
//                     Date
//                   </p>

//                   <p className="mt-2 font-montserrat text-[13px] text-white">
//                     {dateOptions.find(
//                       (item) => item.value === form.date
//                     )?.full || form.date}
//                   </p>
//                 </div>

//                 <div className="py-6 pl-6">
//                   <p className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-white/40">
//                     Time
//                   </p>

//                   <p className="mt-2 font-montserrat text-[13px] text-white">
//                     {form.time}
//                   </p>
//                 </div>
//               </div>

//               <div className="mt-8 flex flex-wrap gap-4">
//                 <Link
//                   href={`/cars/${car._id}`}
//                   className="group inline-flex items-center gap-3 bg-white px-7 py-4 font-montserrat text-[10px] font-medium uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-white/90"
//                 >
//                   View vehicle

//                   <ArrowUpRight
//                     size={15}
//                     strokeWidth={1.5}
//                     className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
//                   />
//                 </Link>

//                 <Link
//                   href="/cars"
//                   className="inline-flex items-center gap-3 border border-white/30 px-7 py-4 font-montserrat text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-white"
//                 >
//                   Browse inventory
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-white text-black">
//       {/* DARK NAVBAR SPACE */}
//       {/* <div className="h-20 w-full bg-[#181818]" /> */}

//       {/* HERO */}
//       <section className="relative min-h-[72vh] overflow-hidden bg-[#181818]">
//         <Image
//           src={carImage}
//           alt={carName}
//           fill
//           priority
//           className="object-cover"
//           sizes="100vw"
//         />

//         <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20" />

//         <div className="relative z-10 mx-auto flex min-h-[72vh] w-full max-w-[1400px] items-end px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
//           <div className="w-full">
//             <div className="mb-10 flex items-center justify-between border-b border-white/20 pb-5">
//               <p className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-white/55">
//                 Test Drive Experience
//               </p>

//               <p className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-white/40">
//                 {String(step).padStart(2, "0")} / 03
//               </p>
//             </div>

//             <div className="max-w-5xl">
//               <p className="mb-4 font-montserrat text-[11px] uppercase tracking-[0.25em] text-white/55">
//                 {car.year} · {car.bodyType || "Vehicle"}
//               </p>

//               <h1 className="font-bebas text-[76px] leading-[0.82] tracking-wide text-white sm:text-[110px] lg:text-[150px]">
//                 {carName}
//               </h1>

//               {formattedPrice && (
//                 <p className="mt-7 font-montserrat text-[14px] tracking-wide text-white/65">
//                   {formattedPrice}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* STEP NAVIGATION */}
//       <section className="border-b border-black/10 bg-white">
//         <div className="mx-auto grid max-w-[1400px] grid-cols-3">
//           <button
//             type="button"
//             onClick={() => {
//               setStep(1);
//               setError("");
//             }}
//             className={`border-r border-black/10 px-4 py-5 text-left transition-colors duration-300 sm:px-8 ${
//               step === 1 ? "bg-black text-white" : "hover:bg-black/[0.03]"
//             }`}
//           >
//             <span className="font-montserrat text-[9px] tracking-[0.2em] opacity-45">
//               01
//             </span>

//             <span className="ml-3 font-montserrat text-[10px] uppercase tracking-[0.18em]">
//               You
//             </span>
//           </button>

//           <button
//             type="button"
//             onClick={() => {
//               if (form.customerName && form.phone) {
//                 setStep(2);
//                 setError("");
//               }
//             }}
//             className={`border-r border-black/10 px-4 py-5 text-left transition-colors duration-300 sm:px-8 ${
//               step === 2 ? "bg-black text-white" : "hover:bg-black/[0.03]"
//             }`}
//           >
//             <span className="font-montserrat text-[9px] tracking-[0.2em] opacity-45">
//               02
//             </span>

//             <span className="ml-3 font-montserrat text-[10px] uppercase tracking-[0.18em]">
//               Date & Time
//             </span>
//           </button>

//           <button
//             type="button"
//             onClick={() => {
//               if (form.customerName && form.phone && form.date && form.time) {
//                 setStep(3);
//                 setError("");
//               }
//             }}
//             className={`px-4 py-5 text-left transition-colors duration-300 sm:px-8 ${
//               step === 3 ? "bg-black text-white" : "hover:bg-black/[0.03]"
//             }`}
//           >
//             <span className="font-montserrat text-[9px] tracking-[0.2em] opacity-45">
//               03
//             </span>

//             <span className="ml-3 font-montserrat text-[10px] uppercase tracking-[0.18em]">
//               Final details
//             </span>
//           </button>
//         </div>
//       </section>

//       {/* MAIN EXPERIENCE */}
//       <section className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
//         <AnimatePresence mode="wait">
//           {/* STEP 1 */}
//           {step === 1 && (
//             <motion.div
//               key="step-one"
//               initial={{ opacity: 0, y: 25 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.45 }}
//             >
//               <div className="grid gap-14 lg:grid-cols-[0.35fr_1fr] lg:gap-24">
//                 <div>
//                   <p className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-black/40">
//                     01 — Your details
//                   </p>

//                   <h2 className="mt-6 max-w-xs font-bebas text-[64px] leading-[0.85] tracking-wide sm:text-[82px]">
//                     LET&apos;S GET TO KNOW YOU.
//                   </h2>

//                   <p className="mt-7 max-w-sm font-montserrat text-[12px] leading-6 text-black/50">
//                     Tell us a little about yourself so our team can prepare
//                     everything for your visit.
//                   </p>
//                 </div>

//                 <div>
//                   <div className="grid gap-x-10 gap-y-10 md:grid-cols-2">
//                     <label className="group block">
//                       <span className="mb-3 flex items-center gap-2 font-montserrat text-[9px] uppercase tracking-[0.25em] text-black/45">
//                         <User size={13} strokeWidth={1.4} />
//                         Full name
//                       </span>

//                       <input
//                         type="text"
//                         value={form.customerName}
//                         onChange={(event) =>
//                           updateField("customerName", event.target.value)
//                         }
//                         placeholder="Your name"
//                         className="w-full border-b border-black/15 bg-transparent px-0 py-4 font-montserrat text-[15px] outline-none transition-colors placeholder:text-black/25 focus:border-black"
//                       />
//                     </label>

//                     <label className="group block">
//                       <span className="mb-3 flex items-center gap-2 font-montserrat text-[9px] uppercase tracking-[0.25em] text-black/45">
//                         <Phone size={13} strokeWidth={1.4} />
//                         Phone number
//                       </span>

//                       <input
//                         type="tel"
//                         value={form.phone}
//                         onChange={(event) =>
//                           updateField("phone", event.target.value)
//                         }
//                         placeholder="Your phone number"
//                         className="w-full border-b border-black/15 bg-transparent px-0 py-4 font-montserrat text-[15px] outline-none transition-colors placeholder:text-black/25 focus:border-black"
//                       />
//                     </label>

//                     <label className="group block md:col-span-2">
//                       <span className="mb-3 flex items-center gap-2 font-montserrat text-[9px] uppercase tracking-[0.25em] text-black/45">
//                         <Mail size={13} strokeWidth={1.4} />
//                         Email address
//                         <span className="text-black/25">(optional)</span>
//                       </span>

//                       <input
//                         type="email"
//                         value={form.email}
//                         onChange={(event) =>
//                           updateField("email", event.target.value)
//                         }
//                         placeholder="you@example.com"
//                         className="w-full border-b border-black/15 bg-transparent px-0 py-4 font-montserrat text-[15px] outline-none transition-colors placeholder:text-black/25 focus:border-black"
//                       />
//                     </label>
//                   </div>

//                   {error && (
//                     <p className="mt-8 border-l-2 border-black px-4 py-2 font-montserrat text-[11px] leading-5 text-black/60">
//                       {error}
//                     </p>
//                   )}

//                   <div className="mt-12 flex justify-end">
//                     <button
//                       type="button"
//                       onClick={goToStepTwo}
//                       className="group inline-flex items-center gap-4 bg-black px-8 py-5 font-montserrat text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-black/80"
//                     >
//                       Continue

//                       <ArrowRight
//                         size={16}
//                         strokeWidth={1.4}
//                         className="transition-transform duration-300 group-hover:translate-x-1"
//                       />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {/* STEP 2 */}
//           {step === 2 && (
//             <motion.div
//               key="step-two"
//               initial={{ opacity: 0, y: 25 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.45 }}
//             >
//               <div className="grid gap-14 lg:grid-cols-[0.35fr_1fr] lg:gap-24">
//                 <div>
//                   <p className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-black/40">
//                     02 — Your appointment
//                   </p>

//                   <h2 className="mt-6 max-w-xs font-bebas text-[64px] leading-[0.85] tracking-wide sm:text-[82px]">
//                     WHEN WOULD YOU LIKE TO EXPERIENCE IT?
//                   </h2>

//                   <p className="mt-7 max-w-sm font-montserrat text-[12px] leading-6 text-black/50">
//                     Choose a day and time that works for you. We&apos;ll take
//                     care of the rest.
//                   </p>
//                 </div>

//                 <div>
//                   {/* DATE */}
//                   <div>
//                     <div className="mb-6 flex items-center gap-3">
//                       <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-black/40">
//                         Select a date
//                       </span>

//                       <div className="h-px flex-1 bg-black/10" />
//                     </div>

//                     <div className="grid grid-cols-3 border-l border-t border-black/10 sm:grid-cols-4 lg:grid-cols-7">
//                       {dateOptions.map((date) => {
//                         const selected = form.date === date.value;

//                         return (
//                           <button
//                             key={date.value}
//                             type="button"
//                             onClick={() => updateField("date", date.value)}
//                             className={`group border-b border-r border-black/10 px-3 py-5 text-center transition-all duration-300 sm:px-4 ${
//                               selected
//                                 ? "bg-black text-white"
//                                 : "hover:bg-black/[0.04]"
//                             }`}
//                           >
//                             <span
//                               className={`block font-montserrat text-[9px] uppercase tracking-[0.18em] ${
//                                 selected
//                                   ? "text-white/55"
//                                   : "text-black/40"
//                               }`}
//                             >
//                               {date.day}
//                             </span>

//                             <span className="mt-2 block font-bebas text-[30px] leading-none">
//                               {date.number}
//                             </span>

//                             <span
//                               className={`mt-1 block font-montserrat text-[9px] uppercase tracking-[0.15em] ${
//                                 selected
//                                   ? "text-white/55"
//                                   : "text-black/35"
//                               }`}
//                             >
//                               {date.month}
//                             </span>
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   {/* TIME */}
//                   <div className="mt-14">
//                     <div className="mb-6 flex items-center gap-3">
//                       <span className="flex items-center gap-2 font-montserrat text-[9px] uppercase tracking-[0.25em] text-black/40">
//                         <Clock3 size={13} strokeWidth={1.4} />
//                         Select a time
//                       </span>

//                       <div className="h-px flex-1 bg-black/10" />
//                     </div>

//                     <div className="grid grid-cols-3 border-l border-t border-black/10 sm:grid-cols-4 lg:grid-cols-6">
//                       {TIME_SLOTS.map((time) => {
//                         const selected = form.time === time;

//                         return (
//                           <button
//                             key={time}
//                             type="button"
//                             onClick={() => updateField("time", time)}
//                             className={`border-b border-r border-black/10 px-3 py-4 font-montserrat text-[11px] tracking-[0.08em] transition-all duration-300 ${
//                               selected
//                                 ? "bg-black text-white"
//                                 : "hover:bg-black/[0.04]"
//                             }`}
//                           >
//                             {time}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   {error && (
//                     <p className="mt-8 border-l-2 border-black px-4 py-2 font-montserrat text-[11px] leading-5 text-black/60">
//                       {error}
//                     </p>
//                   )}

//                   <div className="mt-12 flex items-center justify-between gap-4">
//                     <button
//                       type="button"
//                       onClick={goBack}
//                       className="group inline-flex items-center gap-3 border-b border-black/15 pb-2 font-montserrat text-[10px] uppercase tracking-[0.2em] text-black/55 transition-colors hover:border-black hover:text-black"
//                     >
//                       <ChevronLeft
//                         size={15}
//                         strokeWidth={1.4}
//                         className="transition-transform duration-300 group-hover:-translate-x-1"
//                       />
//                       Back
//                     </button>

//                     <button
//                       type="button"
//                       onClick={goToStepThree}
//                       className="group inline-flex items-center gap-4 bg-black px-8 py-5 font-montserrat text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-black/80"
//                     >
//                       Continue

//                       <ArrowRight
//                         size={16}
//                         strokeWidth={1.4}
//                         className="transition-transform duration-300 group-hover:translate-x-1"
//                       />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {/* STEP 3 */}
//           {step === 3 && (
//             <motion.div
//               key="step-three"
//               initial={{ opacity: 0, y: 25 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.45 }}
//             >
//               <div className="grid gap-14 lg:grid-cols-[0.35fr_1fr] lg:gap-24">
//                 <div>
//                   <p className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-black/40">
//                     03 — Final details
//                   </p>

//                   <h2 className="mt-6 max-w-xs font-bebas text-[64px] leading-[0.85] tracking-wide sm:text-[82px]">
//                     ANYTHING WE SHOULD KNOW?
//                   </h2>

//                   <p className="mt-7 max-w-sm font-montserrat text-[12px] leading-6 text-black/50">
//                     Let us know if there is anything specific you&apos;d like
//                     to discuss or experience during your visit.
//                   </p>
//                 </div>

//                 <div>
//                   <form onSubmit={handleSubmit}>
//                     <label className="block">
//                       <span className="mb-4 flex items-center gap-2 font-montserrat text-[9px] uppercase tracking-[0.25em] text-black/45">
//                         <MessageSquare size={13} strokeWidth={1.4} />
//                         Message
//                         <span className="text-black/25">(optional)</span>
//                       </span>

//                       <textarea
//                         value={form.message}
//                         onChange={(event) =>
//                           updateField("message", event.target.value)
//                         }
//                         placeholder="Tell us anything you'd like us to know..."
//                         rows={8}
//                         className="w-full resize-none border border-black/10 bg-[#fafafa] px-5 py-5 font-montserrat text-[13px] leading-6 outline-none transition-colors placeholder:text-black/25 focus:border-black/30"
//                       />
//                     </label>

//                     {/* APPOINTMENT SUMMARY */}
//                     <div className="mt-12 border-t border-black/10">
//                       <div className="grid grid-cols-1 border-b border-black/10 sm:grid-cols-3">
//                         <div className="border-b border-black/10 px-0 py-6 sm:border-b-0 sm:border-r sm:px-6">
//                           <p className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-black/40">
//                             Vehicle
//                           </p>

//                           <p className="mt-2 font-montserrat text-[13px]">
//                             {carName}
//                           </p>
//                         </div>

//                         <div className="border-b border-black/10 px-0 py-6 sm:border-b-0 sm:border-r sm:px-6">
//                           <p className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-black/40">
//                             Date
//                           </p>

//                           <p className="mt-2 font-montserrat text-[13px]">
//                             {dateOptions.find(
//                               (item) => item.value === form.date
//                             )?.full || form.date}
//                           </p>
//                         </div>

//                         <div className="px-0 py-6 sm:px-6">
//                           <p className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-black/40">
//                             Time
//                           </p>

//                           <p className="mt-2 font-montserrat text-[13px]">
//                             {form.time}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {error && (
//                       <p className="mt-8 border-l-2 border-black px-4 py-2 font-montserrat text-[11px] leading-5 text-black/60">
//                         {error}
//                       </p>
//                     )}

//                     <div className="mt-12 flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between">
//                       <button
//                         type="button"
//                         onClick={goBack}
//                         className="group inline-flex w-fit items-center gap-3 border-b border-black/15 pb-2 font-montserrat text-[10px] uppercase tracking-[0.2em] text-black/55 transition-colors hover:border-black hover:text-black"
//                       >
//                         <ChevronLeft
//                           size={15}
//                           strokeWidth={1.4}
//                           className="transition-transform duration-300 group-hover:-translate-x-1"
//                         />
//                         Back
//                       </button>

//                       <button
//                         type="submit"
//                         disabled={submitting}
//                         className="group inline-flex items-center justify-center gap-4 bg-black px-9 py-5 font-montserrat text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
//                       >
//                         {submitting
//                           ? "Sending request..."
//                           : "Request test drive"}

//                         {!submitting && (
//                           <ArrowUpRight
//                             size={16}
//                             strokeWidth={1.4}
//                             className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
//                           />
//                         )}
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </section>

//       {/* VEHICLE STRIP */}
//       <section className="border-t border-black/10 bg-[#f7f7f5]">
//         <div className="mx-auto grid max-w-[1400px] md:grid-cols-[280px_1fr]">
//           <div className="relative min-h-[230px] overflow-hidden md:min-h-full">
//             <Image
//               src={carImage}
//               alt={carName}
//               fill
//               className="object-cover"
//               sizes="280px"
//             />

//             <div className="absolute inset-0 bg-black/20" />
//           </div>

//           <div className="px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
//             <p className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-black/40">
//               Your selected vehicle
//             </p>

//             <div className="mt-5 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
//               <div>
//                 <p className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-black/40">
//                   {car.year}
//                 </p>

//                 <h3 className="mt-2 font-bebas text-[52px] leading-none tracking-wide">
//                   {carName}
//                 </h3>
//               </div>

//               <Link
//                 href={`/cars/${car._id}`}
//                 className="group inline-flex w-fit items-center gap-3 border-b border-black/20 pb-2 font-montserrat text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-black"
//               >
//                 View vehicle

//                 <ArrowUpRight
//                   size={14}
//                   strokeWidth={1.4}
//                   className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
//                 />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* BOTTOM CTA */}
//       <section className="bg-[#181818] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-28">
//         <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-12 lg:flex-row lg:items-end">
//           <div>
//             <p className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-white/40">
//               Still deciding?
//             </p>

//             <h2 className="mt-5 max-w-3xl font-bebas text-[64px] leading-[0.85] tracking-wide sm:text-[90px]">
//               TAKE YOUR TIME.
//               <br />
//               FIND YOUR CAR.
//             </h2>
//           </div>

//           <Link
//             href="/cars"
//             className="group inline-flex w-fit items-center gap-4 border-b border-white/25 pb-3 font-montserrat text-[10px] uppercase tracking-[0.2em] text-white/70 transition-colors hover:border-white hover:text-white"
//           >
//             Explore inventory

//             <ArrowUpRight
//               size={16}
//               strokeWidth={1.4}
//               className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
//             />
//           </Link>
//         </div>
//       </section>
//     </main>
//   );
// }


// // "use client";

// // import { useEffect, useState } from "react";
// // import Link from "next/link";
// // import {
// //   ArrowLeft,
// //   ArrowUpRight,
// //   CalendarDays,
// //   Clock3,
// //   Phone,
// // } from "lucide-react";
// // import { motion } from "framer-motion";
// // import { useSearchParams } from "next/navigation";

// // export default function TestDrivePage() {
// //   const searchParams = useSearchParams();

// //   const carId = searchParams.get("car");

// //   const [car, setCar] = useState(null);
// //   const [loadingCar, setLoadingCar] = useState(true);

// //   const [form, setForm] = useState({
// //     customerName: "",
// //     phone: "",
// //     email: "",
// //     date: "",
// //     time: "",
// //     message: "",
// //   });

// //   const [submitting, setSubmitting] = useState(false);
// //   const [success, setSuccess] = useState("");
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     if (!carId) {
// //       setLoadingCar(false);
// //       return;
// //     }

// //     async function loadCar() {
// //       try {
// //         setLoadingCar(true);
// //         setError("");

// //         const response = await fetch(`/api/cars/${carId}`, {
// //           cache: "no-store",
// //         });

// //         if (!response.ok) {
// //           throw new Error("Failed to load vehicle");
// //         }

// //         const result = await response.json();

// //         if (!result.success) {
// //           throw new Error(
// //             result.message || "Failed to load vehicle"
// //           );
// //         }

// //         setCar(result.data.car);
// //       } catch (loadError) {
// //         console.error(loadError);

// //         setError(
// //           "We couldn't load this vehicle. Please go back and try again."
// //         );
// //       } finally {
// //         setLoadingCar(false);
// //       }
// //     }

// //     loadCar();
// //   }, [carId]);

// //   function handleChange(event) {
// //     const { name, value } = event.target;

// //     setForm((current) => ({
// //       ...current,
// //       [name]: value,
// //     }));
// //   }

// //   async function handleSubmit(event) {
// //     event.preventDefault();

// //     setSubmitting(true);
// //     setSuccess("");
// //     setError("");

// //     try {
// //       const response = await fetch("/api/test-drives", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           ...form,
// //           carId,
// //         }),
// //       });

// //       const result = await response.json();

// //       if (!response.ok || !result.success) {
// //         throw new Error(
// //           result.message || "Failed to submit request"
// //         );
// //       }

// //       setSuccess(
// //         "Your test drive request has been submitted. The dealership will contact you to confirm the appointment."
// //       );

// //       setForm({
// //         customerName: "",
// //         phone: "",
// //         email: "",
// //         date: "",
// //         time: "",
// //         message: "",
// //       });
// //     } catch (submitError) {
// //       setError(
// //         submitError.message ||
// //           "Something went wrong. Please try again."
// //       );
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   }

// //   if (!carId) {
// //     return (
// //       <main className="min-h-screen bg-white text-black">
// //         {/* <div className="h-20 w-full bg-[#181818]" /> */}

// //         <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden border-b border-black/10 px-5 py-24">
// //           <span className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 font-bebas text-[22rem] leading-none tracking-[-0.08em] text-black/[0.025]">
// //             00
// //           </span>

// //           <div className="relative z-10 max-w-xl text-center">
// //             <p className="font-montserrat text-[10px] uppercase tracking-[0.35em] text-black/35">
// //               Test drive
// //             </p>

// //             <h1 className="mt-5 font-bebas text-6xl uppercase leading-[0.85] tracking-tight md:text-8xl">
// //               Vehicle not selected
// //             </h1>

// //             <p className="mx-auto mt-7 max-w-md font-montserrat text-sm leading-7 text-black/50 md:text-base">
// //               Please select a vehicle before booking a
// //               test drive.
// //             </p>

// //             <Link
// //               href="/cars"
// //               className="group mt-9 inline-flex items-center gap-3 bg-black px-7 py-4 font-montserrat text-[10px] font-medium uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-black/80"
// //             >
// //               Browse vehicles
// //               <ArrowUpRight
// //                 size={15}
// //                 strokeWidth={1.3}
// //                 className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
// //               />
// //             </Link>
// //           </div>
// //         </section>
// //       </main>
// //     );
// //   }

// //   return (
// //     <main className="min-h-screen bg-white text-black">
// //       {/* DARK NAVBAR SPACER */}

// //       <div className="h-20 w-full bg-[#181818]" />

// //       {/* HERO */}

// //       <section className="relative overflow-hidden border-b border-black/10 bg-[#f3f3f1]">
// //         <div className="mx-auto grid min-h-[42vh] max-w-[1600px] lg:grid-cols-[0.8fr_1.2fr]">
// //           {/* LEFT */}

// //           <div className="relative flex items-center px-5 py-16 md:px-10 lg:px-16 xl:px-24">
// //             <span className="pointer-events-none absolute -bottom-16 -left-5 font-bebas text-[19rem] leading-none tracking-[-0.08em] text-black/[0.035]">
// //               TD
// //             </span>

// //             <div className="relative z-10 max-w-2xl">
// //               <Link
// //                 href={`/cars/${carId}`}
// //                 className="group inline-flex items-center gap-2 font-montserrat text-[9px] uppercase tracking-[0.25em] text-black/40 transition-colors hover:text-black"
// //               >
// //                 <ArrowLeft
// //                   size={13}
// //                   strokeWidth={1.2}
// //                   className="transition-transform duration-300 group-hover:-translate-x-1"
// //                 />
// //                 Back to vehicle
// //               </Link>

// //               <p className="mt-12 font-montserrat text-[10px] uppercase tracking-[0.35em] text-black/35">
// //                 Experience the vehicle
// //               </p>

// //               <h1 className="mt-4 font-bebas text-[4.5rem] uppercase leading-[0.82] tracking-tight sm:text-[5.5rem] md:text-[7rem] lg:text-[7.5rem]">
// //                 Book a
// //                 <br />
// //                 test drive
// //               </h1>

// //               <p className="mt-7 max-w-lg font-montserrat text-sm leading-7 text-black/50 md:text-[15px]">
// //                 Get behind the wheel and experience your
// //                 next vehicle before making your decision.
// //                 Choose a convenient date and time and
// //                 we will take care of the rest.
// //               </p>
// //             </div>
// //           </div>

// //           {/* HERO IMAGE */}

// //           <div className="relative min-h-[360px] overflow-hidden bg-black lg:min-h-0">
// //             {loadingCar ? (
// //               <div className="h-full w-full animate-pulse bg-black/[0.08]" />
// //             ) : car?.images?.[0]?.url ? (
// //               <>
// //                 <img
// //                   src={car.images[0].url}
// //                   alt={`${car.make} ${car.model}`}
// //                   className="h-full w-full object-cover"
// //                 />

// //                 <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

// //                 <div className="absolute bottom-7 left-7 md:bottom-10 md:left-10">
// //                   <div className="border border-white/20 bg-black/30 px-5 py-3 backdrop-blur-sm">
// //                     <p className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-white/55">
// //                       Selected vehicle
// //                     </p>

// //                     <p className="mt-1 font-bebas text-2xl uppercase tracking-wide text-white">
// //                       {car.make} {car.model}
// //                     </p>
// //                   </div>
// //                 </div>
// //               </>
// //             ) : (
// //               <div className="flex h-full items-center justify-center">
// //                 <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-white/40">
// //                   No image available
// //                 </span>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </section>

// //       {/* MAIN */}

// //       <section className="border-b border-black/10">
// //         <div className="mx-auto max-w-[1600px]">
// //           {loadingCar ? (
// //             <LoadingState />
// //           ) : error && !car ? (
// //             <div className="flex min-h-[50vh] items-center justify-center px-5">
// //               <div className="max-w-lg text-center">
// //                 <p className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-red-500">
// //                   Something went wrong
// //                 </p>

// //                 <p className="mt-5 font-montserrat text-sm leading-7 text-black/55">
// //                   {error}
// //                 </p>

// //                 <Link
// //                   href="/cars"
// //                   className="mt-7 inline-flex items-center gap-3 bg-black px-6 py-4 font-montserrat text-[10px] uppercase tracking-[0.2em] text-white"
// //                 >
// //                   Browse vehicles
// //                   <ArrowUpRight size={15} />
// //                 </Link>
// //               </div>
// //             </div>
// //           ) : (
// //             <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
// //               {/* VEHICLE INFORMATION */}

// //               <div className="border-b border-black/10 px-5 py-14 md:px-10 md:py-20 lg:border-b-0 lg:border-r lg:px-12 xl:px-20">
// //                 <div className="sticky top-28">
// //                   <div className="flex items-center justify-between border-b border-black/10 pb-5">
// //                     <span className="font-montserrat text-[9px] uppercase tracking-[0.28em] text-black/35">
// //                       Your selection
// //                     </span>

// //                     <span className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-black/35">
// //                       {car?.condition || "Vehicle"}
// //                     </span>
// //                   </div>

// //                   <div className="mt-8">
// //                     <p className="font-montserrat text-[10px] uppercase tracking-[0.28em] text-black/35">
// //                       {car?.make}
// //                     </p>

// //                     <h2 className="mt-3 font-bebas text-6xl uppercase leading-[0.85] tracking-tight md:text-7xl">
// //                       {car?.model}
// //                     </h2>

// //                     <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-montserrat text-[10px] uppercase tracking-[0.15em] text-black/45">
// //                       <span>{car?.year}</span>

// //                       {car?.mileage !== undefined && (
// //                         <span>
// //                           {Number(car.mileage).toLocaleString(
// //                             "en-US"
// //                           )}{" "}
// //                           miles
// //                         </span>
// //                       )}

// //                       {car?.transmission && (
// //                         <span>{car.transmission}</span>
// //                       )}
// //                     </div>
// //                   </div>

// //                   <div className="mt-12 border-y border-black/10 py-7">
// //                     <p className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-black/35">
// //                       Vehicle price
// //                     </p>

// //                     <p className="mt-2 font-bebas text-5xl tracking-wide">
// //                       {car?.currency}{" "}
// //                       {new Intl.NumberFormat("en-US").format(
// //                         car?.price || 0
// //                       )}
// //                     </p>
// //                   </div>

// //                   <div className="mt-8">
// //                     <p className="font-montserrat text-sm leading-7 text-black/50">
// //                       Take your time behind the wheel.
// //                       We will help you experience the
// //                       vehicle and answer any questions you
// //                       may have.
// //                     </p>
// //                   </div>

// //                   <div className="mt-10 grid grid-cols-2 border-t border-black/10 pt-7">
// //                     <div className="border-r border-black/10 pr-5">
// //                       <CalendarDays
// //                         size={17}
// //                         strokeWidth={1.1}
// //                         className="text-black/50"
// //                       />

// //                       <p className="mt-3 font-montserrat text-[9px] uppercase tracking-[0.18em] text-black/35">
// //                         Flexible date
// //                       </p>
// //                     </div>

// //                     <div className="pl-5">
// //                       <Clock3
// //                         size={17}
// //                         strokeWidth={1.1}
// //                         className="text-black/50"
// //                       />

// //                       <p className="mt-3 font-montserrat text-[9px] uppercase tracking-[0.18em] text-black/35">
// //                         Your preferred time
// //                       </p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* FORM */}

// //               <div className="px-5 py-14 md:px-10 md:py-20 lg:px-14 xl:px-24">
// //                 <div className="max-w-3xl">
// //                   <div className="flex items-end justify-between gap-5 border-b border-black/10 pb-7">
// //                     <div>
// //                       <p className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-black/35">
// //                         Appointment request
// //                       </p>

// //                       <h2 className="mt-3 font-bebas text-5xl uppercase leading-none tracking-tight md:text-6xl">
// //                         Your details
// //                       </h2>
// //                     </div>

// //                     <span className="hidden font-bebas text-5xl text-black/[0.06] sm:block md:text-7xl">
// //                       01
// //                     </span>
// //                   </div>

// //                   {success && (
// //                     <motion.div
// //                       initial={{
// //                         opacity: 0,
// //                         y: 10,
// //                       }}
// //                       animate={{
// //                         opacity: 1,
// //                         y: 0,
// //                       }}
// //                       className="mt-8 border border-black/10 bg-[#f3f3f1] p-6"
// //                     >
// //                       <p className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-black/35">
// //                         Request received
// //                       </p>

// //                       <p className="mt-3 font-montserrat text-sm leading-7 text-black/60">
// //                         {success}
// //                       </p>
// //                     </motion.div>
// //                   )}

// //                   {error && (
// //                     <div className="mt-8 border border-red-200 bg-red-50 p-5">
// //                       <p className="font-montserrat text-sm leading-6 text-red-700">
// //                         {error}
// //                       </p>
// //                     </div>
// //                   )}

// //                   <form
// //                     onSubmit={handleSubmit}
// //                     className="mt-10"
// //                   >
// //                     {/* PERSONAL DETAILS */}

// //                     <div className="border-b border-black/10 pb-10">
// //                       <div className="mb-7 flex items-center gap-4">
// //                         <span className="font-bebas text-2xl text-black/25">
// //                           01
// //                         </span>

// //                         <span className="font-montserrat text-[9px] uppercase tracking-[0.28em] text-black/40">
// //                           Personal information
// //                         </span>
// //                       </div>

// //                       <div className="grid gap-7 md:grid-cols-2">
// //                         <FormField
// //                           label="Full name"
// //                           htmlFor="customerName"
// //                         >
// //                           <input
// //                             id="customerName"
// //                             name="customerName"
// //                             value={form.customerName}
// //                             onChange={handleChange}
// //                             required
// //                             maxLength={100}
// //                             placeholder="John Smith"
// //                             className="luxury-input"
// //                           />
// //                         </FormField>

// //                         <FormField
// //                           label="Phone number"
// //                           htmlFor="phone"
// //                         >
// //                           <input
// //                             id="phone"
// //                             name="phone"
// //                             type="tel"
// //                             value={form.phone}
// //                             onChange={handleChange}
// //                             required
// //                             maxLength={30}
// //                             placeholder="+974 0000 0000"
// //                             className="luxury-input"
// //                           />
// //                         </FormField>

// //                         <div className="md:col-span-2">
// //                           <FormField
// //                             label="Email address"
// //                             optional
// //                             htmlFor="email"
// //                           >
// //                             <input
// //                               id="email"
// //                               name="email"
// //                               type="email"
// //                               value={form.email}
// //                               onChange={handleChange}
// //                               maxLength={150}
// //                               placeholder="john@example.com"
// //                               className="luxury-input"
// //                             />
// //                           </FormField>
// //                         </div>
// //                       </div>
// //                     </div>

// //                     {/* APPOINTMENT */}

// //                     <div className="border-b border-black/10 py-10">
// //                       <div className="mb-7 flex items-center gap-4">
// //                         <span className="font-bebas text-2xl text-black/25">
// //                           02
// //                         </span>

// //                         <span className="font-montserrat text-[9px] uppercase tracking-[0.28em] text-black/40">
// //                           Choose your appointment
// //                         </span>
// //                       </div>

// //                       <div className="grid gap-7 md:grid-cols-2">
// //                         <FormField
// //                           label="Preferred date"
// //                           htmlFor="date"
// //                         >
// //                           <input
// //                             id="date"
// //                             name="date"
// //                             type="date"
// //                             value={form.date}
// //                             onChange={handleChange}
// //                             min={getTodayDate()}
// //                             required
// //                             className="luxury-input bg-white"
// //                           />
// //                         </FormField>

// //                         <FormField
// //                           label="Preferred time"
// //                           htmlFor="time"
// //                         >
// //                           <select
// //                             id="time"
// //                             name="time"
// //                             value={form.time}
// //                             onChange={handleChange}
// //                             required
// //                             className="luxury-input bg-white"
// //                           >
// //                             <option value="">
// //                               Select time
// //                             </option>

// //                             <option value="09:00">
// //                               9:00 AM
// //                             </option>

// //                             <option value="09:30">
// //                               9:30 AM
// //                             </option>

// //                             <option value="10:00">
// //                               10:00 AM
// //                             </option>

// //                             <option value="10:30">
// //                               10:30 AM
// //                             </option>

// //                             <option value="11:00">
// //                               11:00 AM
// //                             </option>

// //                             <option value="11:30">
// //                               11:30 AM
// //                             </option>

// //                             <option value="12:00">
// //                               12:00 PM
// //                             </option>

// //                             <option value="12:30">
// //                               12:30 PM
// //                             </option>

// //                             <option value="13:00">
// //                               1:00 PM
// //                             </option>

// //                             <option value="13:30">
// //                               1:30 PM
// //                             </option>

// //                             <option value="14:00">
// //                               2:00 PM
// //                             </option>

// //                             <option value="14:30">
// //                               2:30 PM
// //                             </option>

// //                             <option value="15:00">
// //                               3:00 PM
// //                             </option>

// //                             <option value="15:30">
// //                               3:30 PM
// //                             </option>

// //                             <option value="16:00">
// //                               4:00 PM
// //                             </option>

// //                             <option value="16:30">
// //                               4:30 PM
// //                             </option>

// //                             <option value="17:00">
// //                               5:00 PM
// //                             </option>

// //                             <option value="17:30">
// //                               5:30 PM
// //                             </option>
// //                           </select>
// //                         </FormField>
// //                       </div>
// //                     </div>

// //                     {/* MESSAGE */}

// //                     <div className="py-10">
// //                       <div className="mb-7 flex items-center gap-4">
// //                         <span className="font-bebas text-2xl text-black/25">
// //                           03
// //                         </span>

// //                         <span className="font-montserrat text-[9px] uppercase tracking-[0.28em] text-black/40">
// //                           Additional information
// //                         </span>
// //                       </div>

// //                       <FormField
// //                         label="Message"
// //                         optional
// //                         htmlFor="message"
// //                       >
// //                         <textarea
// //                           id="message"
// //                           name="message"
// //                           value={form.message}
// //                           onChange={handleChange}
// //                           maxLength={1000}
// //                           rows={6}
// //                           placeholder="Anything you'd like us to know?"
// //                           className="luxury-input min-h-[150px] resize-none py-4"
// //                         />
// //                       </FormField>
// //                     </div>

// //                     {/* SUBMIT */}

// //                     <div className="border-t border-black/10 pt-8">
// //                       <button
// //                         type="submit"
// //                         disabled={submitting}
// //                         className="group flex w-full items-center justify-center gap-4 bg-black px-7 py-5 font-montserrat text-[10px] font-medium uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
// //                       >
// //                         {submitting
// //                           ? "Submitting request..."
// //                           : "Request test drive"}

// //                         {!submitting && (
// //                           <ArrowUpRight
// //                             size={16}
// //                             strokeWidth={1.2}
// //                             className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
// //                           />
// //                         )}
// //                       </button>

// //                       <div className="mt-5 flex items-start gap-3">
// //                         <Phone
// //                           size={14}
// //                           strokeWidth={1.2}
// //                           className="mt-0.5 shrink-0 text-black/30"
// //                         />

// //                         <p className="font-montserrat text-[10px] leading-5 text-black/35">
// //                           Your requested time is not confirmed
// //                           until the dealership approves the
// //                           appointment.
// //                         </p>
// //                       </div>
// //                     </div>
// //                   </form>
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </section>

// //       {/* BOTTOM CTA */}

// //       <section className="bg-[#181818] px-5 py-20 text-white md:px-10 md:py-28">
// //         <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-12 md:flex-row md:items-end">
// //           <div>
// //             <p className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-white/35">
// //               Not ready yet?
// //             </p>

// //             <h2 className="mt-5 max-w-3xl font-bebas text-6xl uppercase leading-[0.82] tracking-tight sm:text-7xl md:text-8xl">
// //               Explore the
// //               <br />
// //               full collection.
// //             </h2>
// //           </div>

// //           <Link
// //             href="/cars"
// //             className="group inline-flex shrink-0 items-center gap-4 border border-white/20 px-7 py-5 font-montserrat text-[10px] uppercase tracking-[0.22em] text-white transition-all duration-300 hover:border-white/50"
// //           >
// //             View inventory
// //             <ArrowUpRight
// //               size={16}
// //               strokeWidth={1.2}
// //               className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
// //             />
// //           </Link>
// //         </div>
// //       </section>
// //     </main>
// //   );
// // }

// // function FormField({
// //   label,
// //   optional = false,
// //   htmlFor,
// //   children,
// // }) {
// //   return (
// //     <div>
// //       <label
// //         htmlFor={htmlFor}
// //         className="mb-3 flex items-center gap-2 font-montserrat text-[9px] font-medium uppercase tracking-[0.2em] text-black/45"
// //       >
// //         {label}

// //         {optional && (
// //           <span className="text-black/25">
// //             Optional
// //           </span>
// //         )}
// //       </label>

// //       {children}
// //     </div>
// //   );
// // }

// // function LoadingState() {
// //   return (
// //     <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
// //       <div className="border-b border-black/10 px-5 py-14 md:px-10 md:py-20 lg:border-b-0 lg:border-r lg:px-12 xl:px-20">
// //         <div className="animate-pulse">
// //           <div className="h-3 w-28 bg-black/[0.06]" />

// //           <div className="mt-10 h-4 w-20 bg-black/[0.06]" />

// //           <div className="mt-4 h-20 w-64 bg-black/[0.06]" />

// //           <div className="mt-7 h-4 w-80 max-w-full bg-black/[0.06]" />

// //           <div className="mt-12 border-y border-black/10 py-7">
// //             <div className="h-3 w-24 bg-black/[0.06]" />

// //             <div className="mt-3 h-12 w-48 bg-black/[0.06]" />
// //           </div>
// //         </div>
// //       </div>

// //       <div className="px-5 py-14 md:px-10 md:py-20 lg:px-14 xl:px-24">
// //         <div className="animate-pulse">
// //           <div className="h-3 w-36 bg-black/[0.06]" />

// //           <div className="mt-4 h-14 w-56 bg-black/[0.06]" />

// //           <div className="mt-10 space-y-8">
// //             <div className="grid gap-7 md:grid-cols-2">
// //               <div className="h-14 bg-black/[0.06]" />
// //               <div className="h-14 bg-black/[0.06]" />
// //             </div>

// //             <div className="h-14 bg-black/[0.06]" />

// //             <div className="grid gap-7 md:grid-cols-2">
// //               <div className="h-14 bg-black/[0.06]" />
// //               <div className="h-14 bg-black/[0.06]" />
// //             </div>

// //             <div className="h-36 bg-black/[0.06]" />

// //             <div className="h-16 bg-black/[0.06]" />
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function getTodayDate() {
// //   const date = new Date();

// //   const year = date.getFullYear();

// //   const month = String(
// //     date.getMonth() + 1
// //   ).padStart(2, "0");

// //   const day = String(
// //     date.getDate()
// //   ).padStart(2, "0");

// //   return `${year}-${month}-${day}`;
// // }
// // // "use client";

// // // import { useEffect, useState } from "react";
// // // import Link from "next/link";
// // // import { useSearchParams } from "next/navigation";

// // // export default function TestDrivePage() {
// // //   const searchParams = useSearchParams();

// // //   const carId = searchParams.get("car");

// // //   const [car, setCar] = useState(null);

// // //   const [loadingCar, setLoadingCar] =
// // //     useState(true);

// // //   const [form, setForm] = useState({
// // //     customerName: "",
// // //     phone: "",
// // //     email: "",
// // //     date: "",
// // //     time: "",
// // //     message: "",
// // //   });

// // //   const [submitting, setSubmitting] =
// // //     useState(false);

// // //   const [success, setSuccess] =
// // //     useState("");

// // //   const [error, setError] =
// // //     useState("");

// // //   useEffect(() => {
// // //     if (!carId) {
// // //       return;
// // //     }

// // //     async function loadCar() {
// // //       try {
// // //         setLoadingCar(true);

// // //         const response = await fetch(
// // //           `/api/cars/${carId}`,
// // //           {
// // //             cache: "no-store",
// // //           }
// // //         );

// // //         if (!response.ok) {
// // //           throw new Error(
// // //             "Failed to load vehicle"
// // //           );
// // //         }

// // //         const result = await response.json();

// // //         if (!result.success) {
// // //           throw new Error(
// // //             result.message ||
// // //               "Failed to load vehicle"
// // //           );
// // //         }

// // //         setCar(result.data.car);
// // //       } catch (loadError) {
// // //         console.error(loadError);

// // //         setError(
// // //           "We couldn't load this vehicle. Please go back and try again."
// // //         );
// // //       } finally {
// // //         setLoadingCar(false);
// // //       }
// // //     }

// // //     loadCar();
// // //   }, [carId]);

// // //   function handleChange(event) {
// // //     const { name, value } = event.target;

// // //     setForm((current) => ({
// // //       ...current,
// // //       [name]: value,
// // //     }));
// // //   }

// // //   async function handleSubmit(event) {
// // //     event.preventDefault();

// // //     setSubmitting(true);
// // //     setSuccess("");
// // //     setError("");

// // //     try {
// // //       const response = await fetch(
// // //         "/api/test-drives",
// // //         {
// // //           method: "POST",
// // //           headers: {
// // //             "Content-Type": "application/json",
// // //           },
// // //           body: JSON.stringify({
// // //             ...form,
// // //             carId,
// // //           }),
// // //         }
// // //       );

// // //       const result = await response.json();

// // //       if (!response.ok || !result.success) {
// // //         throw new Error(
// // //           result.message ||
// // //             "Failed to submit request"
// // //         );
// // //       }

// // //       setSuccess(
// // //         "Your test drive request has been submitted. The dealership will contact you to confirm the appointment."
// // //       );

// // //       setForm({
// // //         customerName: "",
// // //         phone: "",
// // //         email: "",
// // //         date: "",
// // //         time: "",
// // //         message: "",
// // //       });
// // //     } catch (submitError) {
// // //       setError(
// // //         submitError.message ||
// // //           "Something went wrong. Please try again."
// // //       );
// // //     } finally {
// // //       setSubmitting(false);
// // //     }
// // //   }

// // //   if (!carId) {
// // //     return (
// // //       <main className="min-h-screen bg-[#f7f7f5] text-black">
// // //         {/* <SimpleHeader /> */}

// // //         <section className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-5 py-20 text-center">
// // //           <div>
// // //             <h1 className="text-3xl font-semibold tracking-tight">
// // //               Vehicle not selected
// // //             </h1>

// // //             <p className="mt-4 text-sm leading-6 text-black/50">
// // //               Please select a vehicle before booking a
// // //               test drive.
// // //             </p>

// // //             <Link
// // //               href="/cars"
// // //               className="mt-7 inline-flex rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white"
// // //             >
// // //               Browse Cars
// // //             </Link>
// // //           </div>
// // //         </section>
// // //       </main>
// // //     );
// // //   }

// // //   return (
// // //     <main className="min-h-screen bg-[#f7f7f5] text-black">
// // //       {/* <SimpleHeader /> */}

// // //       <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-20">
// // //         <div className="mb-10">
// // //           <Link
// // //             href={`/cars/${carId}`}
// // //             className="text-sm text-black/45 underline underline-offset-4"
// // //           >
// // //             ← Back to vehicle
// // //           </Link>

// // //           <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-black/40">
// // //             Test drive
// // //           </p>

// // //           <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
// // //             Book a test drive.
// // //           </h1>

// // //           <p className="mt-4 max-w-2xl text-sm leading-7 text-black/50">
// // //             Choose a preferred date and time. Your
// // //             request will be sent to the dealership for
// // //             confirmation.
// // //           </p>
// // //         </div>

// // //         {loadingCar ? (
// // //           <LoadingState />
// // //         ) : error && !car ? (
// // //           <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
// // //             {error}
// // //           </div>
// // //         ) : (
// // //           <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
// // //             {/* Vehicle */}
// // //             <div>
// // //               <div className="overflow-hidden rounded-3xl border border-black/10 bg-white">
// // //                 <div className="aspect-[4/3] bg-neutral-100">
// // //                   {car?.images?.[0]?.url ? (
// // //                     <img
// // //                       src={car.images[0].url}
// // //                       alt={`${car.make} ${car.model}`}
// // //                       className="h-full w-full object-cover"
// // //                     />
// // //                   ) : (
// // //                     <div className="flex h-full items-center justify-center text-sm text-black/35">
// // //                       No image available
// // //                     </div>
// // //                   )}
// // //                 </div>

// // //                 <div className="p-6">
// // //                   <p className="text-xs uppercase tracking-[0.15em] text-black/35">
// // //                     Selected vehicle
// // //                   </p>

// // //                   <h2 className="mt-2 text-2xl font-semibold tracking-tight">
// // //                     {car?.make} {car?.model}
// // //                   </h2>

// // //                   <p className="mt-2 text-sm text-black/45">
// // //                     {car?.year} ·{" "}
// // //                     {car?.currency}{" "}
// // //                     {new Intl.NumberFormat(
// // //                       "en-US"
// // //                     ).format(car?.price || 0)}
// // //                   </p>

// // //                   <div className="mt-5 border-t border-black/10 pt-5">
// // //                     <p className="text-sm leading-6 text-black/50">
// // //                       The dealership will contact you to confirm your appointment.
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             {/* Form */}
// // //             <div className="rounded-3xl border border-black/10 bg-white p-6 md:p-10">
// // //               <h2 className="text-2xl font-semibold tracking-tight">
// // //                 Your details
// // //               </h2>

// // //               <p className="mt-2 text-sm text-black/45">
// // //                 Tell us when you would like to visit.
// // //               </p>

// // //               {success && (
// // //                 <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-700">
// // //                   {success}
// // //                 </div>
// // //               )}

// // //               {error && (
// // //                 <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
// // //                   {error}
// // //                 </div>
// // //               )}

// // //               <form
// // //                 onSubmit={handleSubmit}
// // //                 className="mt-8 space-y-5"
// // //               >
// // //                 <div>
// // //                   <label
// // //                     htmlFor="customerName"
// // //                     className="mb-2 block text-sm font-medium"
// // //                   >
// // //                     Full name
// // //                   </label>

// // //                   <input
// // //                     id="customerName"
// // //                     name="customerName"
// // //                     value={form.customerName}
// // //                     onChange={handleChange}
// // //                     required
// // //                     maxLength={100}
// // //                     placeholder="John Smith"
// // //                     className="h-13 w-full rounded-xl border border-black/15 px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-black"
// // //                   />
// // //                 </div>

// // //                 <div>
// // //                   <label
// // //                     htmlFor="phone"
// // //                     className="mb-2 block text-sm font-medium"
// // //                   >
// // //                     Phone number
// // //                   </label>

// // //                   <input
// // //                     id="phone"
// // //                     name="phone"
// // //                     type="tel"
// // //                     value={form.phone}
// // //                     onChange={handleChange}
// // //                     required
// // //                     maxLength={30}
// // //                     placeholder="+974 0000 0000"
// // //                     className="h-13 w-full rounded-xl border border-black/15 px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-black"
// // //                   />
// // //                 </div>

// // //                 <div>
// // //                   <label
// // //                     htmlFor="email"
// // //                     className="mb-2 block text-sm font-medium"
// // //                   >
// // //                     Email
// // //                     <span className="ml-1 text-black/35">
// // //                       (optional)
// // //                     </span>
// // //                   </label>

// // //                   <input
// // //                     id="email"
// // //                     name="email"
// // //                     type="email"
// // //                     value={form.email}
// // //                     onChange={handleChange}
// // //                     maxLength={150}
// // //                     placeholder="john@example.com"
// // //                     className="h-13 w-full rounded-xl border border-black/15 px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-black"
// // //                   />
// // //                 </div>

// // //                 <div className="grid gap-5 sm:grid-cols-2">
// // //                   <div>
// // //                     <label
// // //                       htmlFor="date"
// // //                       className="mb-2 block text-sm font-medium"
// // //                     >
// // //                       Preferred date
// // //                     </label>

// // //                     <input
// // //                       id="date"
// // //                       name="date"
// // //                       type="date"
// // //                       value={form.date}
// // //                       onChange={handleChange}
// // //                       min={getTodayDate()}
// // //                       required
// // //                       className="h-13 w-full rounded-xl border border-black/15 bg-white px-4 text-sm outline-none focus:border-black"
// // //                     />
// // //                   </div>

// // //                   <div>
// // //                     <label
// // //                       htmlFor="time"
// // //                       className="mb-2 block text-sm font-medium"
// // //                     >
// // //                       Preferred time
// // //                     </label>

// // //                     <select
// // //                       id="time"
// // //                       name="time"
// // //                       value={form.time}
// // //                       onChange={handleChange}
// // //                       required
// // //                       className="h-13 w-full rounded-xl border border-black/15 bg-white px-4 text-sm outline-none focus:border-black"
// // //                     >
// // //                       <option value="">
// // //                         Select time
// // //                       </option>

// // //                       <option value="09:00">
// // //                         9:00 AM
// // //                       </option>

// // //                       <option value="09:30">
// // //                         9:30 AM
// // //                       </option>

// // //                       <option value="10:00">
// // //                         10:00 AM
// // //                       </option>

// // //                       <option value="10:30">
// // //                         10:30 AM
// // //                       </option>

// // //                       <option value="11:00">
// // //                         11:00 AM
// // //                       </option>

// // //                       <option value="11:30">
// // //                         11:30 AM
// // //                       </option>

// // //                       <option value="12:00">
// // //                         12:00 PM
// // //                       </option>

// // //                       <option value="12:30">
// // //                         12:30 PM
// // //                       </option>

// // //                       <option value="13:00">
// // //                         1:00 PM
// // //                       </option>

// // //                       <option value="13:30">
// // //                         1:30 PM
// // //                       </option>

// // //                       <option value="14:00">
// // //                         2:00 PM
// // //                       </option>

// // //                       <option value="14:30">
// // //                         2:30 PM
// // //                       </option>

// // //                       <option value="15:00">
// // //                         3:00 PM
// // //                       </option>

// // //                       <option value="15:30">
// // //                         3:30 PM
// // //                       </option>

// // //                       <option value="16:00">
// // //                         4:00 PM
// // //                       </option>

// // //                       <option value="16:30">
// // //                         4:30 PM
// // //                       </option>

// // //                       <option value="17:00">
// // //                         5:00 PM
// // //                       </option>

// // //                       <option value="17:30">
// // //                         5:30 PM
// // //                       </option>
// // //                     </select>
// // //                   </div>
// // //                 </div>

// // //                 <div>
// // //                   <label
// // //                     htmlFor="message"
// // //                     className="mb-2 block text-sm font-medium"
// // //                   >
// // //                     Message
// // //                     <span className="ml-1 text-black/35">
// // //                       (optional)
// // //                     </span>
// // //                   </label>

// // //                   <textarea
// // //                     id="message"
// // //                     name="message"
// // //                     value={form.message}
// // //                     onChange={handleChange}
// // //                     maxLength={1000}
// // //                     rows={5}
// // //                     placeholder="Anything you'd like us to know?"
// // //                     className="w-full resize-none rounded-xl border border-black/15 px-4 py-4 text-sm outline-none placeholder:text-black/30 focus:border-black"
// // //                   />
// // //                 </div>

// // //                 <button
// // //                   type="submit"
// // //                   disabled={submitting}
// // //                   className="h-13 w-full rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
// // //                 >
// // //                   {submitting
// // //                     ? "Submitting..."
// // //                     : "Request test drive"}
// // //                 </button>

// // //                 <p className="text-center text-xs leading-5 text-black/35">
// // //                   Your requested time is not confirmed
// // //                   until the dealership approves it.
// // //                 </p>
// // //               </form>
// // //             </div>
// // //           </div>
// // //         )}
// // //       </section>
// // //     </main>
// // //   );
// // // }

// // // function LoadingState() {
// // //   return (
// // //     <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
// // //       <div className="overflow-hidden rounded-3xl bg-white">
// // //         <div className="aspect-[4/3] animate-pulse bg-black/[0.06]" />

// // //         <div className="space-y-3 p-6">
// // //           <div className="h-4 w-24 animate-pulse rounded bg-black/[0.06]" />
// // //           <div className="h-7 w-48 animate-pulse rounded bg-black/[0.06]" />
// // //           <div className="h-4 w-32 animate-pulse rounded bg-black/[0.06]" />
// // //         </div>
// // //       </div>

// // //       <div className="rounded-3xl bg-white p-8">
// // //         <div className="h-7 w-44 animate-pulse rounded bg-black/[0.06]" />

// // //         <div className="mt-8 space-y-5">
// // //           <div className="h-13 animate-pulse rounded-xl bg-black/[0.06]" />
// // //           <div className="h-13 animate-pulse rounded-xl bg-black/[0.06]" />
// // //           <div className="h-13 animate-pulse rounded-xl bg-black/[0.06]" />
// // //           <div className="h-28 animate-pulse rounded-xl bg-black/[0.06]" />
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // function getTodayDate() {
// // //   const date = new Date();

// // //   const year = date.getFullYear();

// // //   const month = String(
// // //     date.getMonth() + 1
// // //   ).padStart(2, "0");

// // //   const day = String(
// // //     date.getDate()
// // //   ).padStart(2, "0");

// // //   return `${year}-${month}-${day}`;
// // // }