import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, MapPin, MessageCircle, Phone } from "lucide-react";

async function getCar(id) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/cars/${id}`, {
      cache: "no-store",
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Failed to load car");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to load car");
    }

    return result.data;
  } catch (error) {
    console.error("Car details fetch error:", error);

    return null;
  }
}

/* ============================================================
   LATEST CARS
============================================================ */

async function getLatestCars(currentCarId) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/cars/latest`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to load latest cars");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to load latest cars");
    }

    const latestCars = Array.isArray(result.data) ? result.data : [];

    return latestCars
      .filter((car) => String(car._id) !== String(currentCarId))
      .slice(0, 8);
  } catch (error) {
    console.error("Latest cars fetch error:", error);

    return [];
  }
}

/* ============================================================
   PAGE
============================================================ */

export default async function CarDetailsPage({ params }) {
  const { id } = await params;

  const data = await getCar(id);

  if (!data) {
    notFound();
  }

  const { car, business } = data;

  const latestCars = await getLatestCars(car._id);

  const images = car.images || [];

  const formattedPrice = formatPrice(car.price, car.currency);

  const formattedMileage = new Intl.NumberFormat("en-US").format(
    car.mileage || 0,
  );

  const whatsappNumber = business?.whatsapp
    ? business.whatsapp.replace(/\D/g, "")
    : "";

  const whatsappMessage = encodeURIComponent(
    `Hello, I'm interested in the ${car.year} ${car.make} ${car.model}.`,
  );

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
    : null;

  return (
    <main className="min-h-screen bg-white text-black ">
      {/* ======================================================
          01 — BREADCRUMB
      ====================================================== */}
    <div className="bg-[#181818] h-20 w-full"/>
      <div className="border-b border-black/10">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between px-6 py-5 md:px-10 lg:px-14">
          <div className="flex items-center gap-2 font-montserrat text-[10px] uppercase tracking-[0.17em] text-black/35 md:text-[11px]">
            <Link
              href="/"
              className="transition-colors duration-300 hover:text-black"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              href="/cars"
              className="transition-colors duration-300 hover:text-black"
            >
              Cars
            </Link>

            <span>/</span>

            <span className="max-w-[180px] truncate text-black/55 md:max-w-none">
              {car.make} {car.model}
            </span>
          </div>

          <Link
            href="/cars"
            className="group hidden items-center gap-2 font-montserrat text-[9px] font-medium uppercase tracking-[0.18em] text-black/45 transition-colors duration-300 hover:text-black sm:flex md:text-[10px]"
          >
            Back to inventory
            <ArrowUpRight
              size={14}
              strokeWidth={1.2}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      {/* ======================================================
          02 — MAIN VEHICLE
      ====================================================== */}

      <section>
        <div className="mx-auto max-w-[1800px] px-6 py-8 md:px-10 md:py-12 lg:px-14 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16 xl:grid-cols-[1.4fr_0.6fr]">
            {/* ==================================================
                IMAGE GALLERY
            ================================================== */}
{/* ==================================================
    IMAGE GALLERY
================================================== */}

<div>
  {images.length > 0 ? (
    <div className="space-y-3">
      {/* MAIN IMAGE */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[#f1f1ef]">
        <img
          src={images[0].url}
          alt={
            images[0].alt ||
            `${car.make} ${car.model}`
          }
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.015]"
        />

        {/* CONDITION */}
        <div className="absolute left-4 top-4">
          <span className="bg-white px-3 py-2 font-montserrat text-[9px] font-medium uppercase tracking-[0.16em] text-black md:text-[10px]">
            {car.condition}
          </span>
        </div>

        {/* IMAGE COUNT */}
        {/* {images.length > 1 && (
          <div className="absolute bottom-4 right-4">
            <span className="bg-black/70 px-3 py-2 font-montserrat text-[9px] uppercase tracking-[0.16em] text-white backdrop-blur-sm md:text-[10px]">
              01 / {String(images.length).padStart(2, "0")}
            </span>
          </div>
        )} */}
      </div>

      {/* SMALL IMAGES */}
      {images.length > 1 && (
        <div className="grid grid-cols-2 gap-3">
          {images.slice(1).map((image, index) => (
            <div
              key={`${image.publicId}-${index + 1}`}
              className="relative aspect-[4/3] overflow-hidden bg-[#f1f1ef]"
            >
              <img
                src={image.url}
                alt={
                  image.alt ||
                  `${car.make} ${car.model} image ${index + 2}`
                }
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.025]"
              />

              {/* IMAGE NUMBER */}
              {/* <div className="absolute bottom-3 left-3">
                <span className="bg-black/60 px-2.5 py-1.5 font-montserrat text-[8px] tracking-[0.18em] text-white backdrop-blur-sm md:text-[9px]">
                  {String(index + 2).padStart(2, "0")}
                </span>
              </div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  ) : (
    <div className="flex aspect-[16/9] items-center justify-center bg-[#f1f1ef]">
      <span className="font-montserrat text-[10px] uppercase tracking-[0.22em] text-black/25 md:text-[11px]">
        No images available
      </span>
    </div>
  )}
</div>

            {/* ==================================================
                VEHICLE INFORMATION
            ================================================== */}

            <div className="lg:sticky lg:top-8 lg:h-fit">
              <div className="border-t border-black/10 pt-6">
                {/* CATEGORY */}

                <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.28em] text-black/35 md:text-[11px]">
                  {car.bodyType} · {car.condition}
                </p>

                {/* BRAND */}

                <p className="mt-7 font-montserrat text-[11px] font-medium uppercase tracking-[0.28em] text-black/40 md:text-xs">
                  {car.make}
                </p>

                {/* MODEL */}

                <h1 className="mt-2 font-bebas text-[clamp(4rem,7vw,7rem)] leading-[0.8] tracking-[-0.045em]">
                  {car.model}
                </h1>

                {/* DETAILS */}

                <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-montserrat text-[10px] uppercase tracking-[0.16em] text-black/40 md:text-[11px]">
                  <span>{car.year}</span>

                  <span className="h-[3px] w-[3px] rounded-full bg-black/20" />

                  <span>
                    {formattedMileage} {car.mileageUnit}
                  </span>

                  <span className="h-[3px] w-[3px] rounded-full bg-black/20" />

                  <span>{car.transmission}</span>
                </div>

                {/* PRICE */}

                <div className="mt-8 border-y border-black/10 py-6">
                  <p className="font-montserrat text-[9px] uppercase tracking-[0.22em] text-black/30 md:text-[10px]">
                    Asking price
                  </p>

                  <p className="mt-2 font-montserrat text-2xl font-medium tracking-[-0.02em] md:text-3xl lg:text-4xl">
                    {formattedPrice}
                  </p>
                </div>

                {/* ACTIONS */}

             {/* ACTIONS */}

<div className="mt-7 flex flex-col gap-3">
  {/* ENQUIRE */}

  <Link
    href={`/contact?car=${car._id}`}
    className="group flex items-center justify-center gap-3 bg-black px-6 py-4 font-montserrat text-[10px] font-medium uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-black/80 md:text-[11px]"
  >
    Enquire about this vehicle

    <ArrowUpRight
      size={15}
      strokeWidth={1.3}
      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
    />
  </Link>

  {/* TEST DRIVE */}

  <Link
    href={`/test-drive?car=${car._id}`}
    className="group flex items-center justify-center gap-3 border border-black/15 px-6 py-4 font-montserrat text-[10px] font-medium uppercase tracking-[0.18em] transition-all duration-300 hover:border-black hover:bg-black hover:text-white md:text-[11px]"
  >
    Book a test drive

    <ArrowUpRight
      size={15}
      strokeWidth={1.3}
      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
    />
  </Link>

  {/* CALL */}

  {business?.phone && (
    <a
      href={`tel:${business.phone}`}
      className="group flex items-center justify-center gap-3 border border-black/15 px-6 py-4 font-montserrat text-[10px] font-medium uppercase tracking-[0.18em] transition-all duration-300 hover:border-black md:text-[11px]"
    >
      <Phone size={14} strokeWidth={1.2} />

      Call dealership
    </a>
  )}

  {/* WHATSAPP */}

  {whatsappUrl && (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-center gap-3 border border-black/15 px-6 py-4 font-montserrat text-[10px] font-medium uppercase tracking-[0.18em] transition-all duration-300 hover:border-black md:text-[11px]"
    >
      <MessageCircle
        size={14}
        strokeWidth={1.2}
      />

      WhatsApp
    </a>
  )}
</div>

                {/* STOCK */}

                <div className="mt-6 flex items-center justify-between font-montserrat text-[9px] uppercase tracking-[0.18em] text-black/30 md:text-[10px]">
                  <span>Stock {car.stockNumber || "Available"}</span>

                  <span>{car.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          03 — DESCRIPTION + SPECS
      ====================================================== */}

      <section className="border-t border-black/10">
        <div className="mx-auto max-w-[1800px] px-6 py-16 md:px-10 md:py-20 lg:px-14 lg:py-24">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            {/* DESCRIPTION */}

            <div>
              <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.3em] text-black/30 md:text-[11px]">
                The vehicle
              </p>

              <h2 className="mt-3 font-bebas text-5xl leading-[0.85] tracking-[-0.035em] md:text-6xl">
                About this
                <br />
                vehicle
              </h2>

              <p className="mt-7 max-w-xl whitespace-pre-line font-montserrat text-[11px] leading-[1.9] tracking-[0.035em] text-black/45 md:text-[13px] md:leading-[1.85]">
                {car.description ||
                  "Contact our dealership for more information about this vehicle."}
              </p>
            </div>

            {/* SPECIFICATIONS */}

            <div className="border-t border-black/10">
              <SpecRow label="Make" value={car.make} />

              <SpecRow label="Model" value={car.model} />

              <SpecRow label="Year" value={car.year} />

              <SpecRow
                label="Mileage"
                value={`${formattedMileage} ${car.mileageUnit}`}
              />

              <SpecRow label="Transmission" value={car.transmission} />

              <SpecRow label="Fuel type" value={car.fuelType} />

              <SpecRow label="Body type" value={car.bodyType} />

              <SpecRow label="Exterior" value={car.exteriorColor || "—"} />

              <SpecRow label="Interior" value={car.interiorColor || "—"} />

              <SpecRow label="Engine" value={car.engine || "—"} />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          04 — FEATURES
      ====================================================== */}

      {car.features?.length > 0 && (
        <section className="border-t border-black/10">
          <div className="mx-auto max-w-[1800px] px-6 py-16 md:px-10 md:py-20 lg:px-14 lg:py-24">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.3em] text-black/30 md:text-[11px]">
                  Equipment
                </p>

                <h2 className="mt-3 font-bebas text-5xl leading-none tracking-[-0.03em] md:text-6xl">
                  Features
                </h2>
              </div>

              <span className="hidden font-montserrat text-[9px] uppercase tracking-[0.2em] text-black/25 sm:block md:text-[10px]">
                {car.features.length} items
              </span>
            </div>

            <div className="grid border-t border-black/10 sm:grid-cols-2 lg:grid-cols-4">
              {car.features.map((feature, index) => (
                <div
                  key={feature}
                  className="flex items-center gap-4 border-b border-black/10 px-1 py-5 sm:border-r sm:px-4 lg:px-5"
                >
                  <span className="font-montserrat text-[9px] tracking-[0.15em] text-black/20 md:text-[10px]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="font-montserrat text-[11px] tracking-[0.02em] text-black/65 md:text-[12px]">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          05 — DEALERSHIP
      ====================================================== */}

      <section className="bg-[#181818] text-white">
        <div className="mx-auto max-w-[1800px] px-6 py-16 md:px-10 md:py-20 lg:px-14 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.65fr] lg:items-end">
            <div>
              <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.3em] text-white/30 md:text-[11px]">
                The dealership
              </p>

              <h2 className="mt-4 max-w-4xl font-bebas text-[clamp(4rem,8vw,8rem)] leading-[0.8] tracking-[-0.045em]">
                Come see it
                <br />
                in person.
              </h2>

              <p className="mt-7 max-w-xl font-montserrat text-[11px] leading-[1.9] tracking-[0.035em] text-white/35 md:text-[13px] md:leading-[1.85]">
                Visit our showroom to experience the vehicle in person and speak
                with our team about ownership, financing, trade-ins, and test
                drives.
              </p>
            </div>

            <div className="border-t border-white/10 pt-7">
              <p className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-white/25 md:text-[11px]">
                {business?.name || "Our Showroom"}
              </p>

              {business?.address && (
                <div className="mt-5 flex gap-3">
                  <MapPin
                    size={16}
                    strokeWidth={1.2}
                    className="mt-0.5 shrink-0 text-white/40"
                  />

                  <p className="font-montserrat text-[11px] leading-[1.8] tracking-[0.04em] text-white/45 md:text-[12px]">
                    {business.address}
                    {business.city ? `, ${business.city}` : ""}
                    {business.country ? `, ${business.country}` : ""}
                  </p>
                </div>
              )}

              <div className="mt-7 flex flex-wrap gap-3">
                {business?.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    className="group inline-flex items-center gap-3 border border-white/20 px-5 py-3.5 font-montserrat text-[9px] font-medium uppercase tracking-[0.18em] transition-all duration-300 hover:border-white md:text-[10px]"
                  >
                    <Phone size={14} strokeWidth={1.2} />
                    Call us
                  </a>
                )}

                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-3 bg-white px-5 py-3.5 font-montserrat text-[9px] font-medium uppercase tracking-[0.18em] text-black transition-all duration-300 hover:bg-white/85 md:text-[10px]"
                >
                  Contact dealership
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.2}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          06 — LATEST ARRIVALS
      ====================================================== */}

      {latestCars.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-[1800px] px-6 py-16 md:px-10 md:py-20 lg:px-14 lg:py-24">
            {/* HEADER */}

            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.3em] text-black/30 md:text-[11px]">
                  Fresh to the collection
                </p>

                <h2 className="mt-3 font-bebas text-5xl leading-[0.85] tracking-[-0.035em] sm:text-6xl md:text-7xl">
                  Latest Arrivals
                </h2>
              </div>

              <Link
                href="/cars"
                className="group hidden items-center gap-2 border-b border-black/20 pb-2 font-montserrat text-[9px] font-medium uppercase tracking-[0.18em] text-black/50 transition-colors duration-300 hover:border-black hover:text-black sm:flex md:text-[10px]"
              >
                View all vehicles
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.2}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </div>

            {/* LATEST CARS */}

            <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {latestCars.map((latestCar, index) => (
                <LatestCarCard
                  key={latestCar._id}
                  car={latestCar}
                  index={index}
                />
              ))}
            </div>

            {/* MOBILE VIEW ALL */}

            <div className="mt-10 flex justify-center sm:hidden">
              <Link
                href="/cars"
                className="group inline-flex items-center gap-3 bg-black px-6 py-4 font-montserrat text-[9px] font-medium uppercase tracking-[0.2em] text-white"
              >
                View all vehicles
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.2}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

/* ============================================================
   SPEC ROW
============================================================ */

function SpecRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-8 border-b border-black/10 py-4">
      <span className="font-montserrat text-[9px] font-medium uppercase tracking-[0.2em] text-black/30 md:text-[10px]">
        {label}
      </span>

      <span className="text-right font-montserrat text-[11px] tracking-[0.02em] text-black/65 md:text-[12px]">
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   LATEST CAR CARD
============================================================ */

function LatestCarCard({ car, index }) {
  const image = car.images?.[0];

  const price = formatPrice(car.price, car.currency);

  const mileage = new Intl.NumberFormat("en-US").format(car.mileage || 0);

  return (
    <Link href={`/cars/${car._id}`} className="group block">
      {/* IMAGE */}

      <div className="relative aspect-[4/3] overflow-hidden bg-[#f1f1ef]">
        {image?.url ? (
          <img
            src={image.url}
            alt={image.alt || `${car.make} ${car.model}`}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-montserrat text-[10px] uppercase tracking-[0.2em] text-black/25">
            No image
          </div>
        )}

        {/* CONDITION */}

        <div className="absolute left-3 top-3">
          <span className="bg-white px-3 py-2 font-montserrat text-[8px] font-medium uppercase tracking-[0.15em] text-black md:text-[9px]">
            {car.condition}
          </span>
        </div>

        {/* NUMBER */}

        <div className="absolute bottom-3 left-3">
          <span className="font-montserrat text-[9px] tracking-[0.2em] text-white/70 md:text-[10px]">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* ARROW */}

        <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center bg-white text-black transition-all duration-300 group-hover:bg-black group-hover:text-white md:h-10 md:w-10">
          <ArrowUpRight
            size={15}
            strokeWidth={1.2}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
      </div>

      {/* INFO */}

      <div className="border-b border-black/10 py-5">
        <p className="font-montserrat text-[9px] font-medium uppercase tracking-[0.25em] text-black/35 md:text-[10px]">
          {car.make}
        </p>

        <div className="mt-2 flex items-start justify-between gap-4">
          <h3 className="font-bebas text-3xl leading-[0.9] tracking-[-0.025em] transition-opacity duration-300 group-hover:opacity-55 md:text-4xl">
            {car.model}
          </h3>

          <p className="shrink-0 pt-1 font-montserrat text-[11px] font-medium md:text-xs">
            {price}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-montserrat text-[9px] uppercase tracking-[0.16em] text-black/35 md:text-[10px]">
          <span>{car.year}</span>

          <span className="h-[3px] w-[3px] rounded-full bg-black/20" />

          <span>
            {mileage} {car.mileageUnit}
          </span>

          <span className="h-[3px] w-[3px] rounded-full bg-black/20" />

          <span>{car.bodyType}</span>
        </div>
      </div>
    </Link>
  );
}

/* ============================================================
   PRICE FORMATTER
============================================================ */

function formatPrice(price, currency) {
  if (typeof price !== "number") {
    return "";
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currency || "USD"} ${price.toLocaleString()}`;
  }
}
