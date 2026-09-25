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
