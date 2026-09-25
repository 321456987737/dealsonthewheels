"use client";

import { useEffect, useState } from "react";

const DAYS = [
  ["monday", "Monday"],
  ["tuesday", "Tuesday"],
  ["wednesday", "Wednesday"],
  ["thursday", "Thursday"],
  ["friday", "Friday"],
  ["saturday", "Saturday"],
  ["sunday", "Sunday"],
];

const DEFAULT_FORM = {
  name: "",
  logo: "",
  heroImage: "",
  description: "",
  phone: "",
  whatsapp: "",
  email: "",
  website: "",
  address: "",
  city: "",
  country: "",
  postalCode: "",
  lat: "",
  lng: "",
  openingHours: {
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  },
  services: "",
  instagram: "",
  facebook: "",
  tiktok: "",
};

export default function AdminSettingsPage() {
  const [form, setForm] =
    useState(DEFAULT_FORM);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/settings",
        {
          cache: "no-store",
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to load settings"
        );
      }

      const business =
        result.data.business;

      setForm({
        name: business.name || "",
        logo: business.logo || "",
        heroImage:
          business.heroImage || "",
        description:
          business.description || "",
        phone: business.phone || "",
        whatsapp:
          business.whatsapp || "",
        email: business.email || "",
        website:
          business.website || "",
        address:
          business.address || "",
        city: business.city || "",
        country:
          business.country || "",
        postalCode:
          business.postalCode || "",

        lat:
          business.location?.lat !==
          null &&
          business.location?.lat !==
            undefined
            ? String(
                business.location.lat
              )
            : "",

        lng:
          business.location?.lng !==
          null &&
          business.location?.lng !==
            undefined
            ? String(
                business.location.lng
              )
            : "",

        openingHours: {
          monday:
            business.openingHours
              ?.monday || "",

          tuesday:
            business.openingHours
              ?.tuesday || "",

          wednesday:
            business.openingHours
              ?.wednesday || "",

          thursday:
            business.openingHours
              ?.thursday || "",

          friday:
            business.openingHours
              ?.friday || "",

          saturday:
            business.openingHours
              ?.saturday || "",

          sunday:
            business.openingHours
              ?.sunday || "",
        },

        services:
          Array.isArray(
            business.services
          )
            ? business.services.join(
                "\n"
              )
            : "",

        instagram:
          business.socialLinks
            ?.instagram || "",

        facebook:
          business.socialLinks
            ?.facebook || "",

        tiktok:
          business.socialLinks
            ?.tiktok || "",
      });
    } catch (loadError) {
      console.error(loadError);

      setError(
        loadError.message ||
          "Failed to load settings"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleHoursChange(
    day,
    value
  ) {
    setForm((current) => ({
      ...current,

      openingHours: {
        ...current.openingHours,
        [day]: value,
      },
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const lat = form.lat.trim();
      const lng = form.lng.trim();

      let location = {
        lat: null,
        lng: null,
      };

      if (lat || lng) {
        const parsedLat = Number(lat);
        const parsedLng = Number(lng);

        if (
          !Number.isFinite(
            parsedLat
          ) ||
          !Number.isFinite(
            parsedLng
          )
        ) {
          throw new Error(
            "Please enter valid map coordinates."
          );
        }

        location = {
          lat: parsedLat,
          lng: parsedLng,
        };
      }

      const services = form.services
        .split("\n")
        .map((service) =>
          service.trim()
        )
        .filter(Boolean);

      const response = await fetch(
        "/api/admin/settings",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            logo: form.logo,
            heroImage:
              form.heroImage,
            description:
              form.description,
            phone: form.phone,
            whatsapp:
              form.whatsapp,
            email: form.email,
            website:
              form.website,
            address:
              form.address,
            city: form.city,
            country:
              form.country,
            postalCode:
              form.postalCode,

            location,

            openingHours:
              form.openingHours,

            services,

            socialLinks: {
              instagram:
                form.instagram,
              facebook:
                form.facebook,
              tiktok:
                form.tiktok,
            },
          }),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to save settings"
        );
      }

      setSuccess(
        "Dealership settings saved successfully."
      );
    } catch (saveError) {
      console.error(saveError);

      setError(
        saveError.message ||
          "Failed to save settings"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <div className="h-3 w-24 animate-pulse rounded bg-black/[0.05]" />

          <div className="mt-3 h-9 w-48 animate-pulse rounded bg-black/[0.05]" />

          <div className="mt-3 h-4 w-72 animate-pulse rounded bg-black/[0.05]" />
        </div>

        <div className="space-y-6">
          <LoadingSection />
          <LoadingSection />
          <LoadingSection />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/35">
          Configuration
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Settings
        </h1>

        <p className="mt-2 text-sm leading-6 text-black/45">
          Manage the dealership information displayed across the website.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-sm leading-6 text-green-700">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Basic information */}
        <SettingsSection
          title="Dealership information"
          description="Basic information about your dealership."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Dealership name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Elite Motors"
              required
            />

            <InputField
              label="Website"
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={6}
              maxLength={3000}
              placeholder="Tell customers about your dealership..."
              className="w-full resize-y rounded-xl border border-black/15 px-4 py-4 text-sm leading-6 outline-none placeholder:text-black/30 focus:border-black"
            />
          </div>
        </SettingsSection>

        {/* Images */}
        <SettingsSection
          title="Images"
          description="These images are used on the public website."
        >
          <div className="space-y-5">
            <InputField
              label="Logo URL"
              name="logo"
              value={form.logo}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
            />

            <InputField
              label="Hero image URL"
              name="heroImage"
              value={form.heroImage}
              onChange={handleChange}
              placeholder="https://example.com/dealership.jpg"
            />

            {form.heroImage && (
              <div className="overflow-hidden rounded-2xl border border-black/10 bg-black/[0.03]">
                <img
                  src={form.heroImage}
                  alt="Dealership hero preview"
                  className="aspect-[16/6] w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              </div>
            )}
          </div>
        </SettingsSection>

        {/* Contact */}
        <SettingsSection
          title="Contact information"
          description="Customers will see these details on the website."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+974 0000 0000"
            />

            <InputField
              label="WhatsApp"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="+974 0000 0000"
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="info@example.com"
            />

            <InputField
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Street address"
            />

            <InputField
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Doha"
            />

            <InputField
              label="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Qatar"
            />

            <InputField
              label="Postal code"
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              placeholder="00000"
            />
          </div>
        </SettingsSection>

        {/* Location */}
        <SettingsSection
          title="Map location"
          description="Enter the dealership's latitude and longitude for the Google Maps link."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Latitude"
              name="lat"
              type="number"
              value={form.lat}
              onChange={handleChange}
              placeholder="25.2854"
            />

            <InputField
              label="Longitude"
              name="lng"
              type="number"
              value={form.lng}
              onChange={handleChange}
              placeholder="51.5310"
            />
          </div>
        </SettingsSection>

        {/* Opening hours */}
        <SettingsSection
          title="Opening hours"
          description="Set the hours customers see on the Contact page."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {DAYS.map(
              ([key, label]) => (
                <div key={key}>
                  <label
                    htmlFor={`hours-${key}`}
                    className="mb-2 block text-sm font-medium"
                  >
                    {label}
                  </label>

                  <input
                    id={`hours-${key}`}
                    type="text"
                    value={
                      form.openingHours[
                        key
                      ]
                    }
                    onChange={(event) =>
                      handleHoursChange(
                        key,
                        event.target.value
                      )
                    }
                    placeholder="9:00 AM – 8:00 PM"
                    className="h-11 w-full rounded-xl border border-black/15 px-4 text-sm outline-none placeholder:text-black/30 focus:border-black"
                  />
                </div>
              )
            )}
          </div>
        </SettingsSection>

        {/* Services */}
        <SettingsSection
          title="Services"
          description="Enter one service per line. These are used on the Services page."
        >
          <textarea
            name="services"
            value={form.services}
            onChange={handleChange}
            rows={8}
            placeholder={`Vehicle Sales
Test Drives
Trade-In
Vehicle Financing
Vehicle Inspection`}
            className="w-full resize-y rounded-xl border border-black/15 px-4 py-4 text-sm leading-6 outline-none placeholder:text-black/30 focus:border-black"
          />
        </SettingsSection>

        {/* Social media */}
        <SettingsSection
          title="Social media"
          description="Add links to the dealership's social profiles."
        >
          <div className="grid gap-5 md:grid-cols-3">
            <InputField
              label="Instagram"
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/..."
            />

            <InputField
              label="Facebook"
              name="facebook"
              value={form.facebook}
              onChange={handleChange}
              placeholder="https://facebook.com/..."
            />

            <InputField
              label="TikTok"
              name="tiktok"
              value={form.tiktok}
              onChange={handleChange}
              placeholder="https://tiktok.com/@..."
            />
          </div>
        </SettingsSection>

        {/* Save */}
        <div className="sticky bottom-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-black px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

function SettingsSection({
  title,
  description,
  children,
}) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-black/45">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="h-11 w-full rounded-xl border border-black/15 bg-white px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-black"
      />
    </div>
  );
}

function LoadingSection() {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-8">
      <div className="h-5 w-48 animate-pulse rounded bg-black/[0.05]" />

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="h-11 animate-pulse rounded-xl bg-black/[0.05]" />
        <div className="h-11 animate-pulse rounded-xl bg-black/[0.05]" />
      </div>
    </div>
  );
}