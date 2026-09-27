"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

export default function AdminSignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    setupKey: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showSetupKey, setShowSetupKey] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to create admin account."
        );
        setLoading(false);
        return;
      }

      setSuccess("Account created. Redirecting to login...");

      setTimeout(() => {
        router.replace("/admin/login");
      }, 1000);
    } catch (error) {
      console.error("SIGNUP ERROR:", error);

      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className=" z-[100] overflow-y-auto min-h-screen h-full flex  w-full items-center justify-center  bg-[#f5f5f2] px-5 py-6">
      <div className="w-full max-w-2xl">
        <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.07)] sm:p-8 md:p-9">
          {/* HEADER */}
          <div className="mb-7 flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#181818]">
              <span className="text-xs font-bold tracking-tight text-white">
                DW
              </span>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-black/35">
                Deals On Wheels Qatar
              </p>

              <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-[#181818] sm:text-3xl">
                Create admin account
              </h1>

              <p className="mt-1.5 text-sm text-black/45">
                Set up the administrator account for your dealership.
              </p>
            </div>
          </div>

          {/* SETUP NOTICE */}
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-3.5">
            <KeyRound
              size={16}
              strokeWidth={1.8}
              className="mt-0.5 shrink-0 text-black/40"
            />

            <div>
              <p className="text-xs font-semibold text-black/70">
                One-time setup
              </p>

              <p className="mt-1 text-[11px] leading-5 text-black/40">
                Your private setup key is required to create the initial
                administrator account.
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME + EMAIL */}
            <div className="grid gap-5 sm:grid-cols-2">
              {/* NAME */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-black/75"
                >
                  Full name
                </label>

                <div className="relative">
                  <UserRound
                    size={17}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Admin name"
                    autoComplete="name"
                    required
                    className="h-13 w-full rounded-2xl border border-black/10 bg-[#fafafa] pl-11 pr-4 text-sm text-black outline-none transition placeholder:text-black/25 hover:border-black/20 focus:border-black/30 focus:bg-white focus:ring-4 focus:ring-black/[0.03]"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-black/75"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@example.com"
                    autoComplete="email"
                    required
                    className="h-13 w-full rounded-2xl border border-black/10 bg-[#fafafa] pl-11 pr-4 text-sm text-black outline-none transition placeholder:text-black/25 hover:border-black/20 focus:border-black/30 focus:bg-white focus:ring-4 focus:ring-black/[0.03]"
                  />
                </div>
              </div>
            </div>

            {/* PASSWORD + SETUP KEY */}
            <div className="grid gap-5 sm:grid-cols-2">
              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-black/75"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="h-13 w-full rounded-2xl border border-black/10 bg-[#fafafa] pl-11 pr-14 text-sm text-black outline-none transition placeholder:text-black/25 hover:border-black/20 focus:border-black/30 focus:bg-white focus:ring-4 focus:ring-black/[0.03]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-black/35 transition hover:bg-black/[0.05] hover:text-black"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} strokeWidth={1.8} />
                    ) : (
                      <Eye size={17} strokeWidth={1.8} />
                    )}
                  </button>
                </div>
              </div>

              {/* SETUP KEY */}
              <div>
                <label
                  htmlFor="setupKey"
                  className="mb-2 block text-sm font-medium text-black/75"
                >
                  Setup key
                </label>

                <div className="relative">
                  <KeyRound
                    size={17}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                  />

                  <input
                    id="setupKey"
                    name="setupKey"
                    type={showSetupKey ? "text" : "password"}
                    value={form.setupKey}
                    onChange={handleChange}
                    placeholder="Enter setup key"
                    required
                    className="h-13 w-full rounded-2xl border border-black/10 bg-[#fafafa] pl-11 pr-14 text-sm text-black outline-none transition placeholder:text-black/25 hover:border-black/20 focus:border-black/30 focus:bg-white focus:ring-4 focus:ring-black/[0.03]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowSetupKey((current) => !current)
                    }
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-black/35 transition hover:bg-black/[0.05] hover:text-black"
                    aria-label={
                      showSetupKey
                        ? "Hide setup key"
                        : "Show setup key"
                    }
                  >
                    {showSetupKey ? (
                      <EyeOff size={17} strokeWidth={1.8} />
                    ) : (
                      <Eye size={17} strokeWidth={1.8} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-5 text-green-700">
                {success}
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="group flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#181818] px-5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>
                {loading
                  ? "Creating account..."
                  : "Create Admin Account"}
              </span>

              {!loading && (
                <ArrowRight
                  size={17}
                  strokeWidth={2}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              )}
            </button>
          </form>

          {/* LOGIN */}
          <div className="mt-6 border-t border-black/10 pt-5 text-center">
            <p className="text-sm text-black/45">
              Already have an admin account?{" "}
              <Link
                href="/admin/login"
                className="font-semibold text-[#181818] underline decoration-black/20 underline-offset-4 hover:decoration-black/60"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-black/25">
          Private dealership administration
        </p>
      </div>
    </main>
  );
}