"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BODY_TYPES = [
  "Sedan",
  "SUV",
  "Coupe",
  "Convertible",
  "Hatchback",
  "Wagon",
  "Pickup",
  "Van",
  "Minivan",
  "Other",
];

const FUEL_TYPES = [
  "Petrol",
  "Diesel",
  "Hybrid",
  "Electric",
  "Plug-in Hybrid",
  "Other",
];

const TRANSMISSIONS = ["Automatic", "Manual", "CVT", "Other"];

const CONDITIONS = ["New", "Used"];

const STATUSES = ["Available", "Reserved", "Sold"];

const MAX_IMAGES = 15;

const DEFAULT_FORM = {
  stockNumber: "",
  make: "",
  model: "",
  year: "",
  price: "",
  currency: "USD",
  mileage: "",
  mileageUnit: "km",
  transmission: "Automatic",
  fuelType: "Petrol",
  bodyType: "SUV",
  condition: "Used",
  exteriorColor: "",
  interiorColor: "",
  engine: "",
  description: "",
  features: "",
  status: "Available",
  isFeatured: false,
};

export default function CarForm({ initialData = null }) {
  const router = useRouter();

  const [form, setForm] = useState(() => {
    if (!initialData) {
      return DEFAULT_FORM;
    }

    return {
      stockNumber: initialData.stockNumber || "",

      make: initialData.make || "",

      model: initialData.model || "",

      year: initialData.year ? String(initialData.year) : "",

      price: initialData.price !== undefined ? String(initialData.price) : "",

      currency: initialData.currency || "USD",

      mileage:
        initialData.mileage !== undefined ? String(initialData.mileage) : "",

      mileageUnit: initialData.mileageUnit || "km",

      transmission: initialData.transmission || "Automatic",

      fuelType: initialData.fuelType || "Petrol",

      bodyType: initialData.bodyType || "SUV",

      condition: initialData.condition || "Used",

      exteriorColor: initialData.exteriorColor || "",

      interiorColor: initialData.interiorColor || "",

      engine: initialData.engine || "",

      description: initialData.description || "",

      features: Array.isArray(initialData.features)
        ? initialData.features.join("\n")
        : "",

      status: initialData.status || "Available",

      isFeatured: Boolean(initialData.isFeatured),
    };
  });

  const [images, setImages] = useState(() => {
    if (!initialData?.images || !Array.isArray(initialData.images)) {
      return [];
    }

    return initialData.images
      .filter((image) => image && image.url)
      .map((image, index) => ({
        id: image.publicId || `existing-${index}-${image.url}`,

        url: image.url,

        publicId: image.publicId || "",

        alt: image.alt || "",

        isExisting: true,

        file: null,

        preview: image.url,
      }));
  });

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const previewUrls = useRef(new Set());

  const isEdit = Boolean(initialData?._id);

  useEffect(() => {
    return () => {
      for (const url of previewUrls.current) {
        URL.revokeObjectURL(url);
      }
    };
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleImageSelection(event) {
    const selectedFiles = Array.from(event.target.files || []);

    event.target.value = "";

    if (selectedFiles.length === 0) {
      return;
    }

    setError("");

    const remainingSlots = MAX_IMAGES - images.length;

    if (remainingSlots <= 0) {
      setError(`You can upload a maximum of ${MAX_IMAGES} images.`);

      return;
    }

    const filesToAdd = selectedFiles.slice(0, remainingSlots);

    const invalidFile = filesToAdd.find(
      (file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type),
    );

    if (invalidFile) {
      setError("Only JPG, PNG and WebP images are allowed.");

      return;
    }

    const tooLarge = filesToAdd.find((file) => file.size > 10 * 1024 * 1024);

    if (tooLarge) {
      setError("Each image must be smaller than 10MB.");

      return;
    }

    const existingKeys = new Set(
      images
        .filter((image) => image.file)
        .map(
          (image) =>
            `${image.file.name}-${image.file.lastModified}-${image.file.size}`,
        ),
    );

    const newImages = filesToAdd
      .filter((file) => {
        const key = `${file.name}-${file.lastModified}-${file.size}`;

        return !existingKeys.has(key);
      })
      .map((file) => {
        const preview = URL.createObjectURL(file);

        previewUrls.current.add(preview);

        return {
          id: `${file.name}-${file.lastModified}-${file.size}`,

          file,

          preview,

          url: "",

          publicId: "",

          alt: file.name,

          isExisting: false,
        };
      });

    setImages((current) => [...current, ...newImages]);

    if (selectedFiles.length > remainingSlots) {
      setError(
        `Only ${remainingSlots} image${
          remainingSlots === 1 ? "" : "s"
        } could be added because the maximum is ${MAX_IMAGES}.`,
      );
    }
  }

  function removeImage(index) {
    setImages((current) => {
      const image = current[index];

      if (image?.preview && !image.isExisting) {
        URL.revokeObjectURL(image.preview);

        previewUrls.current.delete(image.preview);
      }

      return current.filter((_, imageIndex) => imageIndex !== index);
    });
  }

  function moveImage(index, direction) {
    setImages((current) => {
      const newIndex = direction === "left" ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= current.length) {
        return current;
      }

      const updated = [...current];

      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];

      return updated;
    });
  }

  async function uploadNewImages() {
    const newImages = images.filter((image) => image.file && !image.isExisting);

    if (newImages.length === 0) {
      return [];
    }

    const formData = new FormData();

    for (const image of newImages) {
      formData.append("files", image.file);
    }

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to upload images");
    }

    return result.data.images || [];
  }

  async function deleteCloudinaryImages(publicIds) {
    if (!publicIds || publicIds.length === 0) {
      return;
    }

    const response = await fetch("/api/admin/upload", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publicIds,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to delete images");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setError("");
    setSuccess("");

    let newlyUploadedPublicIds = [];

    try {
      if (!form.make.trim()) {
        throw new Error("Make is required.");
      }

      if (!form.model.trim()) {
        throw new Error("Model is required.");
      }

      if (!form.year) {
        throw new Error("Year is required.");
      }

      if (!form.price) {
        throw new Error("Price is required.");
      }

      if (images.length > MAX_IMAGES) {
        throw new Error(`A maximum of ${MAX_IMAGES} images is allowed.`);
      }

      /*
       * Existing images that were removed
       * from the edit form.
       */
      const originalPublicIds = isEdit
        ? (initialData.images || [])
            .map((image) => image.publicId)
            .filter(Boolean)
        : [];

      const currentExistingPublicIds = images
        .filter((image) => image.isExisting)
        .map((image) => image.publicId)
        .filter(Boolean);

      const removedPublicIds = originalPublicIds.filter(
        (publicId) => !currentExistingPublicIds.includes(publicId),
      );

      /*
       * Upload new files first.
       */
      setSuccess("Uploading images...");

      const uploadedImages = await uploadNewImages();

      newlyUploadedPublicIds = uploadedImages
        .map((image) => image.publicId)
        .filter(Boolean);

      let uploadedIndex = 0;

      /*
       * Preserve the exact order selected
       * by the admin.
       */
      const finalImages = images.map((image) => {
        if (image.isExisting) {
          return {
            url: image.url,

            publicId: image.publicId,

            alt: image.alt || `${form.year} ${form.make} ${form.model}`,
          };
        }

        const uploaded = uploadedImages[uploadedIndex];

        uploadedIndex += 1;

        return {
          url: uploaded.url,

          publicId: uploaded.publicId,

          alt: `${form.year} ${form.make} ${form.model}`,
        };
      });

      const features = form.features
        .split("\n")
        .map((feature) => feature.trim())
        .filter(Boolean);

      const payload = {
        stockNumber: form.stockNumber.trim(),

        make: form.make.trim(),

        model: form.model.trim(),

        year: Number(form.year),

        price: Number(form.price),

        currency: form.currency.trim().toUpperCase(),

        mileage: Number(form.mileage || 0),

        mileageUnit: form.mileageUnit,

        transmission: form.transmission,

        fuelType: form.fuelType,

        bodyType: form.bodyType,

        condition: form.condition,

        exteriorColor: form.exteriorColor.trim(),

        interiorColor: form.interiorColor.trim(),

        engine: form.engine.trim(),

        description: form.description.trim(),

        features,

        images: finalImages,

        status: form.status,

        isFeatured: form.isFeatured,
      };

      setSuccess(isEdit ? "Updating car..." : "Adding car...");

      const endpoint = isEdit
        ? `/api/admin/cars/${initialData._id}`
        : "/api/admin/cars";

      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || `Failed to ${isEdit ? "update" : "create"} car`,
        );
      }

      let cleanupWarning = "";

      /*
       * Delete old Cloudinary assets that the
       * admin removed while editing.
       *
       * This happens AFTER the database update
       * so we never remove an image before the
       * new car state is saved.
       */
      if (removedPublicIds.length > 0) {
        try {
          await deleteCloudinaryImages(removedPublicIds);
        } catch (deleteError) {
          console.error("Removed image cleanup error:", deleteError);

          cleanupWarning =
            " The car was saved, but some removed images could not be deleted from Cloudinary.";
        }
      }

      setSuccess(
        `${
          isEdit ? "Car updated successfully." : "Car added successfully."
        }${cleanupWarning}`,
      );

      setTimeout(() => {
        router.push("/admin/cars");
        router.refresh();
      }, 900);
    } catch (submitError) {
      console.error("Car form submit error:", submitError);

      /*
       * If MongoDB create/update failed after
       * Cloudinary upload succeeded, clean up
       * those newly uploaded assets.
       */
      if (newlyUploadedPublicIds.length > 0) {
        try {
          await deleteCloudinaryImages(newlyUploadedPublicIds);
        } catch (cleanupError) {
          console.error("New upload cleanup error:", cleanupError);
        }
      }

      setSuccess("");

      setError(submitError.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-sm leading-6 text-green-700">
          {success}
        </div>
      )}

      {/* Basic information */}
      <FormSection
        title="Basic information"
        description="Enter the main information customers will see about this vehicle."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <InputField
            label="Make"
            name="make"
            value={form.make}
            onChange={handleChange}
            placeholder="BMW"
            required
          />

          <InputField
            label="Model"
            name="model"
            value={form.model}
            onChange={handleChange}
            placeholder="M4 Competition"
            required
          />

          <InputField
            label="Year"
            name="year"
            type="number"
            value={form.year}
            onChange={handleChange}
            placeholder="2024"
            min="1900"
            max="2100"
            required
          />

          <InputField
            label="Stock number"
            name="stockNumber"
            value={form.stockNumber}
            onChange={handleChange}
            placeholder="BMW-M4-024"
          />
        </div>
      </FormSection>

      {/* Pricing */}
      <FormSection
        title="Pricing & mileage"
        description="Set the vehicle price and mileage information."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <InputField
            label="Price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="75000"
            min="0"
            required
          />

          <SelectField
            label="Currency"
            name="currency"
            value={form.currency}
            onChange={handleChange}
            options={["USD", "QAR", "AED", "SAR", "EUR", "GBP"]}
          />

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Mileage"
              name="mileage"
              type="number"
              value={form.mileage}
              onChange={handleChange}
              placeholder="8000"
              min="0"
            />

            <SelectField
              label="Unit"
              name="mileageUnit"
              value={form.mileageUnit}
              onChange={handleChange}
              options={["km", "miles"]}
            />
          </div>
        </div>
      </FormSection>

      {/* Specifications */}
      <FormSection
        title="Vehicle specifications"
        description="Add the specifications customers can use to compare vehicles."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <SelectField
            label="Body type"
            name="bodyType"
            value={form.bodyType}
            onChange={handleChange}
            options={BODY_TYPES}
          />

          <SelectField
            label="Fuel type"
            name="fuelType"
            value={form.fuelType}
            onChange={handleChange}
            options={FUEL_TYPES}
          />

          <SelectField
            label="Transmission"
            name="transmission"
            value={form.transmission}
            onChange={handleChange}
            options={TRANSMISSIONS}
          />

          <SelectField
            label="Condition"
            name="condition"
            value={form.condition}
            onChange={handleChange}
            options={CONDITIONS}
          />

          <InputField
            label="Engine"
            name="engine"
            value={form.engine}
            onChange={handleChange}
            placeholder="3.0L Twin-Turbo"
          />

          <InputField
            label="Exterior color"
            name="exteriorColor"
            value={form.exteriorColor}
            onChange={handleChange}
            placeholder="Black"
          />

          <InputField
            label="Interior color"
            name="interiorColor"
            value={form.interiorColor}
            onChange={handleChange}
            placeholder="Black leather"
          />
        </div>
      </FormSection>

      {/* Description */}
      <FormSection
        title="Description"
        description="Write the description that will appear on the vehicle details page."
      >
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={7}
          maxLength={5000}
          placeholder="Tell customers about this vehicle, its condition, history and notable details..."
          className="w-full resize-y rounded-xl border border-black/15 px-4 py-4 text-sm leading-6 outline-none transition placeholder:text-black/30 focus:border-black"
        />
      </FormSection>

      {/* Features */}
      <FormSection
        title="Features & equipment"
        description="Enter one feature per line."
      >
        <textarea
          name="features"
          value={form.features}
          onChange={handleChange}
          rows={8}
          placeholder={`Apple CarPlay
Leather seats
360° camera
Adaptive cruise control
Panoramic roof`}
          className="w-full resize-y rounded-xl border border-black/15 px-4 py-4 text-sm leading-6 outline-none placeholder:text-black/30 focus:border-black"
        />
      </FormSection>

      {/* Images */}
      <FormSection
        title="Vehicle images"
        description={`Upload up to ${MAX_IMAGES} images. The first image is used as the primary vehicle image.`}
      >
        <div className="space-y-6">
          <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-black/20 bg-black/[0.02] px-6 py-8 text-center transition hover:border-black hover:bg-black/[0.035]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-lg font-semibold text-white">
              +
            </div>

            <p className="mt-4 text-sm font-semibold">Choose vehicle images</p>

            <p className="mt-1 text-xs text-black/40">
              JPG, PNG or WebP · Maximum 10MB each
            </p>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageSelection}
              className="hidden"
            />
          </label>

          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-black/45">
              {images.length} / {MAX_IMAGES} images selected
            </p>

            {images.length > 0 && (
              <p className="text-xs text-black/40">
                First image = primary image
              </p>
            )}
          </div>

          {images.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="overflow-hidden rounded-2xl border border-black/10 bg-white"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-black/[0.04]">
                    <img
                      src={image.preview}
                      alt={image.alt || `${form.make} ${form.model}`}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold shadow-sm">
                      {index === 0 ? "Primary" : `Image ${index + 1}`}
                    </div>

                    {image.isExisting && (
                      <div className="absolute right-3 top-3 rounded-full bg-black px-3 py-1.5 text-[11px] font-semibold text-white">
                        Saved
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 p-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={index === 0 || submitting}
                        onClick={() => moveImage(index, "left")}
                        className="rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        ←
                      </button>

                      <button
                        type="button"
                        disabled={index === images.length - 1 || submitting}
                        onClick={() => moveImage(index, "right")}
                        className="rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        →
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => removeImage(index)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </FormSection>

      {/* Inventory settings */}
      <FormSection
        title="Inventory settings"
        description="Control how this vehicle is displayed on the website."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <SelectField
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={STATUSES}
          />

          <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-black/10 bg-black/[0.02] px-4">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
              className="h-4 w-4 accent-black"
            />

            <span>
              <span className="block text-sm font-semibold">
                Featured vehicle
              </span>

              <span className="block text-xs text-black/40">
                Show this vehicle in the Home page featured section.
              </span>
            </span>
          </label>
        </div>
      </FormSection>

      {/* Actions */}
      <div className="flex flex-col-reverse justify-end gap-3 border-t border-black/10 pt-6 sm:flex-row">
        <Link
          href="/admin/cars"
          className="flex h-12 items-center justify-center rounded-full border border-black/15 px-7 text-sm font-semibold transition hover:bg-black hover:text-white"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={submitting}
          className="flex h-12 items-center justify-center rounded-full bg-black px-8 text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? isEdit
              ? "Updating..."
              : "Adding..."
            : isEdit
              ? "Update Car"
              : "Add Car"}
        </button>
      </div>
    </form>
  );
}

function FormSection({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>

        <p className="mt-1 text-sm leading-6 text-black/45">{description}</p>
      </div>

      {children}
    </section>
  );
}

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  min,
  max,
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className="h-11 w-full rounded-xl border border-black/15 bg-white px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-black"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-xl border border-black/15 bg-white px-3 text-sm outline-none transition focus:border-black"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// const BODY_TYPES = [
//   "Sedan",
//   "SUV",
//   "Coupe",
//   "Convertible",
//   "Hatchback",
//   "Wagon",
//   "Pickup",
//   "Van",
//   "Minivan",
//   "Other",
// ];

// const FUEL_TYPES = [
//   "Petrol",
//   "Diesel",
//   "Hybrid",
//   "Electric",
//   "Plug-in Hybrid",
//   "Other",
// ];

// const TRANSMISSIONS = [
//   "Automatic",
//   "Manual",
//   "CVT",
//   "Other",
// ];

// const CONDITIONS = [
//   "New",
//   "Used",
// ];

// const STATUSES = [
//   "Available",
//   "Reserved",
//   "Sold",
// ];

// const DEFAULT_FORM = {
//   stockNumber: "",
//   make: "",
//   model: "",
//   year: "",
//   price: "",
//   currency: "USD",
//   mileage: "",
//   mileageUnit: "km",
//   transmission: "Automatic",
//   fuelType: "Petrol",
//   bodyType: "SUV",
//   condition: "Used",
//   exteriorColor: "",
//   interiorColor: "",
//   engine: "",
//   description: "",
//   features: "",
//   images: [""],
//   status: "Available",
//   isFeatured: false,
// };

// export default function CarForm({
//   initialData = null,
// }) {
//    const router = useRouter();
//   const [form, setForm] = useState(() => {
//     if (!initialData) {
//       return DEFAULT_FORM;
//     }

//     return {
//       stockNumber:
//         initialData.stockNumber || "",

//       make: initialData.make || "",

//       model: initialData.model || "",

//       year:
//         initialData.year
//           ? String(initialData.year)
//           : "",

//       price:
//         initialData.price !== undefined
//           ? String(initialData.price)
//           : "",

//       currency:
//         initialData.currency || "USD",

//       mileage:
//         initialData.mileage !== undefined
//           ? String(initialData.mileage)
//           : "",

//       mileageUnit:
//         initialData.mileageUnit || "km",

//       transmission:
//         initialData.transmission ||
//         "Automatic",

//       fuelType:
//         initialData.fuelType || "Petrol",

//       bodyType:
//         initialData.bodyType || "SUV",

//       condition:
//         initialData.condition || "Used",

//       exteriorColor:
//         initialData.exteriorColor || "",

//       interiorColor:
//         initialData.interiorColor || "",

//       engine: initialData.engine || "",

//       description:
//         initialData.description || "",

//       features: Array.isArray(
//         initialData.features
//       )
//         ? initialData.features.join("\n")
//         : "",

//       images:
//         Array.isArray(initialData.images) &&
//         initialData.images.length > 0
//           ? initialData.images.map(
//               (image) => image.url || ""
//             )
//           : [""],

//       status:
//         initialData.status || "Available",

//       isFeatured:
//         Boolean(initialData.isFeatured),
//     };
//   });

//   const [submitting, setSubmitting] =
//     useState(false);

//   const [error, setError] =
//     useState("");

//   const [success, setSuccess] =
//     useState("");

//   const isEdit = Boolean(initialData?._id);

//   function handleChange(event) {
//     const {
//       name,
//       value,
//       type,
//       checked,
//     } = event.target;

//     setForm((current) => ({
//       ...current,
//       [name]:
//         type === "checkbox"
//           ? checked
//           : value,
//     }));
//   }

//   function handleImageChange(
//     index,
//     value
//   ) {
//     setForm((current) => {
//       const images = [...current.images];

//       images[index] = value;

//       return {
//         ...current,
//         images,
//       };
//     });
//   }

//   function addImageField() {
//     setForm((current) => ({
//       ...current,
//       images: [
//         ...current.images,
//         "",
//       ],
//     }));
//   }

//   function removeImageField(index) {
//     setForm((current) => {
//       if (current.images.length === 1) {
//         return {
//           ...current,
//           images: [""],
//         };
//       }

//       return {
//         ...current,
//         images: current.images.filter(
//           (_, imageIndex) =>
//             imageIndex !== index
//         ),
//       };
//     });
//   }

//   async function handleSubmit(event) {
//     event.preventDefault();

//     setSubmitting(true);
//     setError("");
//     setSuccess("");

//     try {
//       const features = form.features
//         .split("\n")
//         .map((feature) => feature.trim())
//         .filter(Boolean);

//       const images = form.images
//         .map((url) => url.trim())
//         .filter(Boolean)
//         .map((url) => ({
//           url,
//           alt: `${form.year} ${form.make} ${form.model}`,
//         }));

//       const payload = {
//         stockNumber:
//           form.stockNumber.trim(),

//         make: form.make.trim(),

//         model: form.model.trim(),

//         year: Number(form.year),

//         price: Number(form.price),

//         currency:
//           form.currency.trim().toUpperCase(),

//         mileage: Number(
//           form.mileage || 0
//         ),

//         mileageUnit:
//           form.mileageUnit,

//         transmission:
//           form.transmission,

//         fuelType:
//           form.fuelType,

//         bodyType:
//           form.bodyType,

//         condition:
//           form.condition,

//         exteriorColor:
//           form.exteriorColor.trim(),

//         interiorColor:
//           form.interiorColor.trim(),

//         engine:
//           form.engine.trim(),

//         description:
//           form.description.trim(),

//         features,

//         images,

//         status:
//           form.status,

//         isFeatured:
//           form.isFeatured,
//       };

//       const endpoint = isEdit
//         ? `/api/admin/cars/${initialData._id}`
//         : "/api/admin/cars";

//       const method = isEdit
//         ? "PATCH"
//         : "POST";

//       const response = await fetch(
//         endpoint,
//         {
//           method,
//           headers: {
//             "Content-Type":
//               "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const result =
//         await response.json();

//       if (
//         !response.ok ||
//         !result.success
//       ) {
//         throw new Error(
//           result.message ||
//             `Failed to ${
//               isEdit
//                 ? "update"
//                 : "create"
//             } car`
//         );
//       }

//       setSuccess(
//         isEdit
//           ? "Car updated successfully."
//           : "Car added successfully."
//       );

//       if (!isEdit) {
//         setForm(DEFAULT_FORM);
//       }

//       /*
//        * Redirect after a short delay so the
//        * success message can be seen.
//        */
//       setTimeout(() => {
//   router.push("/admin/cars");
//   router.refresh();
// }, 700);
//     } catch (submitError) {
//       console.error(
//         "Car form submit error:",
//         submitError
//       );

//       setError(
//         submitError.message ||
//           "Something went wrong."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="space-y-8"
//     >
//       {error && (
//         <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-700">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-sm leading-6 text-green-700">
//           {success}
//         </div>
//       )}

//       {/* Basic Information */}
//       <FormSection
//         title="Basic information"
//         description="Enter the main information customers will see about this vehicle."
//       >
//         <div className="grid gap-5 md:grid-cols-2">
//           <InputField
//             label="Make"
//             name="make"
//             value={form.make}
//             onChange={handleChange}
//             placeholder="BMW"
//             required
//           />

//           <InputField
//             label="Model"
//             name="model"
//             value={form.model}
//             onChange={handleChange}
//             placeholder="M4 Competition"
//             required
//           />

//           <InputField
//             label="Year"
//             name="year"
//             type="number"
//             value={form.year}
//             onChange={handleChange}
//             placeholder="2024"
//             min="1900"
//             max="2100"
//             required
//           />

//           <InputField
//             label="Stock number"
//             name="stockNumber"
//             value={form.stockNumber}
//             onChange={handleChange}
//             placeholder="BMW-M4-024"
//           />
//         </div>
//       </FormSection>

//       {/* Pricing */}
//       <FormSection
//         title="Pricing & mileage"
//         description="Set the vehicle price and mileage information."
//       >
//         <div className="grid gap-5 md:grid-cols-3">
//           <InputField
//             label="Price"
//             name="price"
//             type="number"
//             value={form.price}
//             onChange={handleChange}
//             placeholder="75000"
//             min="0"
//             required
//           />

//           <SelectField
//             label="Currency"
//             name="currency"
//             value={form.currency}
//             onChange={handleChange}
//             options={[
//               "USD",
//               "QAR",
//               "AED",
//               "SAR",
//               "EUR",
//               "GBP",
//             ]}
//           />

//           <div className="grid grid-cols-2 gap-3">
//             <InputField
//               label="Mileage"
//               name="mileage"
//               type="number"
//               value={form.mileage}
//               onChange={handleChange}
//               placeholder="8000"
//               min="0"
//             />

//             <SelectField
//               label="Unit"
//               name="mileageUnit"
//               value={form.mileageUnit}
//               onChange={handleChange}
//               options={[
//                 "km",
//                 "miles",
//               ]}
//             />
//           </div>
//         </div>
//       </FormSection>

//       {/* Vehicle specifications */}
//       <FormSection
//         title="Vehicle specifications"
//         description="Add the specifications customers can use to compare vehicles."
//       >
//         <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
//           <SelectField
//             label="Body type"
//             name="bodyType"
//             value={form.bodyType}
//             onChange={handleChange}
//             options={BODY_TYPES}
//           />

//           <SelectField
//             label="Fuel type"
//             name="fuelType"
//             value={form.fuelType}
//             onChange={handleChange}
//             options={FUEL_TYPES}
//           />

//           <SelectField
//             label="Transmission"
//             name="transmission"
//             value={form.transmission}
//             onChange={handleChange}
//             options={TRANSMISSIONS}
//           />

//           <SelectField
//             label="Condition"
//             name="condition"
//             value={form.condition}
//             onChange={handleChange}
//             options={CONDITIONS}
//           />

//           <InputField
//             label="Engine"
//             name="engine"
//             value={form.engine}
//             onChange={handleChange}
//             placeholder="3.0L Twin-Turbo"
//           />

//           <InputField
//             label="Exterior color"
//             name="exteriorColor"
//             value={form.exteriorColor}
//             onChange={handleChange}
//             placeholder="Black"
//           />

//           <InputField
//             label="Interior color"
//             name="interiorColor"
//             value={form.interiorColor}
//             onChange={handleChange}
//             placeholder="Black leather"
//           />
//         </div>
//       </FormSection>

//       {/* Description */}
//       <FormSection
//         title="Description"
//         description="Write the description that will appear on the vehicle details page."
//       >
//         <textarea
//           name="description"
//           value={form.description}
//           onChange={handleChange}
//           rows={7}
//           maxLength={5000}
//           placeholder="Tell customers about this vehicle, its condition, history and notable details..."
//           className="w-full resize-y rounded-xl border border-black/15 px-4 py-4 text-sm leading-6 outline-none transition placeholder:text-black/30 focus:border-black"
//         />
//       </FormSection>

//       {/* Features */}
//       <FormSection
//         title="Features & equipment"
//         description="Enter one feature per line."
//       >
//         <textarea
//           name="features"
//           value={form.features}
//           onChange={handleChange}
//           rows={8}
//           placeholder={`Apple CarPlay
// Leather seats
// 360° camera
// Adaptive cruise control
// Panoramic roof`}
//           className="w-full resize-y rounded-xl border border-black/15 px-4 py-4 text-sm leading-6 outline-none transition placeholder:text-black/30 focus:border-black"
//         />
//       </FormSection>

//       {/* Images */}
//       <FormSection
//         title="Vehicle images"
//         description="Add the image URLs for this vehicle. The first image will be the primary image."
//       >
//         <div className="space-y-4">
//           {form.images.map(
//             (image, index) => (
//               <div
//                 key={index}
//                 className="flex gap-3"
//               >
//                 <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black/[0.04] text-xs font-semibold text-black/40">
//                   {index + 1}
//                 </div>

//                 <input
//                   type="url"
//                   value={image}
//                   onChange={(event) =>
//                     handleImageChange(
//                       index,
//                       event.target.value
//                     )
//                   }
//                   placeholder="https://example.com/car-image.jpg"
//                   className="h-11 min-w-0 flex-1 rounded-xl border border-black/15 px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-black"
//                 />

//                 <button
//                   type="button"
//                   onClick={() =>
//                     removeImageField(
//                       index
//                     )
//                   }
//                   className="h-11 rounded-xl border border-red-200 px-4 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
//                 >
//                   Remove
//                 </button>
//               </div>
//             )
//           )}

//           <button
//             type="button"
//             onClick={addImageField}
//             className="rounded-xl border border-dashed border-black/20 px-5 py-3 text-sm font-semibold transition hover:border-black hover:bg-black/[0.03]"
//           >
//             + Add another image
//           </button>
//         </div>
//       </FormSection>

//       {/* Status */}
//       <FormSection
//         title="Inventory settings"
//         description="Control how this vehicle is displayed on the website."
//       >
//         <div className="grid gap-5 md:grid-cols-2">
//           <SelectField
//             label="Status"
//             name="status"
//             value={form.status}
//             onChange={handleChange}
//             options={STATUSES}
//           />

//           <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-black/10 bg-black/[0.02] px-4">
//             <input
//               type="checkbox"
//               name="isFeatured"
//               checked={form.isFeatured}
//               onChange={handleChange}
//               className="h-4 w-4 accent-black"
//             />

//             <span>
//               <span className="block text-sm font-semibold">
//                 Featured vehicle
//               </span>

//               <span className="block text-xs text-black/40">
//                 Show this vehicle in the Home page featured section.
//               </span>
//             </span>
//           </label>
//         </div>
//       </FormSection>

//       {/* Actions */}
//       <div className="flex flex-col-reverse justify-end gap-3 border-t border-black/10 pt-6 sm:flex-row">
//         <Link
//           href="/admin/cars"
//           className="flex h-12 items-center justify-center rounded-full border border-black/15 px-7 text-sm font-semibold transition hover:bg-black hover:text-white"
//         >
//           Cancel
//         </Link>

//         <button
//           type="submit"
//           disabled={submitting}
//           className="flex h-12 items-center justify-center rounded-full bg-black px-8 text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           {submitting
//             ? isEdit
//               ? "Updating..."
//               : "Adding..."
//             : isEdit
//               ? "Update Car"
//               : "Add Car"}
//         </button>
//       </div>
//     </form>
//   );
// }

// function FormSection({
//   title,
//   description,
//   children,
// }) {
//   return (
//     <section className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
//       <div className="mb-6">
//         <h2 className="text-lg font-semibold tracking-tight">
//           {title}
//         </h2>

//         <p className="mt-1 text-sm leading-6 text-black/45">
//           {description}
//         </p>
//       </div>

//       {children}
//     </section>
//   );
// }

// function InputField({
//   label,
//   name,
//   type = "text",
//   value,
//   onChange,
//   placeholder,
//   required = false,
//   min,
//   max,
// }) {
//   return (
//     <div>
//       <label
//         htmlFor={name}
//         className="mb-2 block text-sm font-medium"
//       >
//         {label}

//         {required && (
//           <span className="ml-1 text-red-500">
//             *
//           </span>
//         )}
//       </label>

//       <input
//         id={name}
//         name={name}
//         type={type}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         required={required}
//         min={min}
//         max={max}
//         className="h-11 w-full rounded-xl border border-black/15 bg-white px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-black"
//       />
//     </div>
//   );
// }

// function SelectField({
//   label,
//   name,
//   value,
//   onChange,
//   options,
// }) {
//   return (
//     <div>
//       <label
//         htmlFor={name}
//         className="mb-2 block text-sm font-medium"
//       >
//         {label}
//       </label>

//       <select
//         id={name}
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="h-11 w-full rounded-xl border border-black/15 bg-white px-3 text-sm outline-none transition focus:border-black"
//       >
//         {options.map((option) => (
//           <option
//             key={option}
//             value={option}
//           >
//             {option}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }
