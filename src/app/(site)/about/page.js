import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  CarFront,
  Check,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

async function getBusiness() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/business`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();

    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const business = await getBusiness();

  const dealershipName = business?.name || "Our Dealership";

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-black">
      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative h-[40dvh] min-h-[320px] overflow-hidden bg-[#e8e8e5] md:min-h-[440px]">
        {business?.heroImage ? (
          <Image
            src={business.heroImage}
            alt={dealershipName}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <Image
            src="/images/cars/car1.jpg"
            alt="Luxury vehicle"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/25" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* HERO CONTENT */}
        <div className="relative z-10 mx-auto flex h-full max-w-[1800px] items-end px-6 pb-10 md:px-10 md:pb-14 lg:px-14">
          <div className="max-w-4xl">
            <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.3em] text-white/65 md:text-xs">
              About us
            </p>

            <h1 className="mt-3 font-bebas text-6xl leading-[0.9] tracking-wide text-white md:text-8xl lg:text-9xl">
              Built around
              <br />
              the right car.a
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
                Who we are
              </p>

              <h2 className="mt-5 max-w-4xl font-bebas text-5xl leading-[0.95] tracking-wide md:text-7xl lg:text-8xl">
                A dealership that keeps things simple.
              </h2>
            </div>

            <div className="flex items-end">
              <p className="max-w-xl font-montserrat text-sm leading-7 text-black/55 md:text-base md:leading-8">
                {business?.description ||
                  "We're a local dealership focused on offering quality vehicles and making the car buying experience simple, straightforward and personal."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          IMAGE + STORY
      ========================================================= */}

      <section className="bg-white">
        <div className="mx-auto max-w-[1800px] px-6 py-16 md:px-10 md:py-24 lg:px-14">
          <div className="grid overflow-hidden border border-black/10 lg:grid-cols-2">
            {/* IMAGE */}
            <div className="relative min-h-[380px] overflow-hidden bg-[#ededeb] md:min-h-[520px]">
              <Image
                src="/images/cars/car2.jpg"
                alt="Vehicle at the dealership"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/5" />

              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                <span className="font-montserrat text-[9px] font-medium uppercase tracking-[0.25em] text-white drop-shadow-md">
                  Our philosophy
                </span>
              </div>
            </div>

            {/* CONTENT */}
            <div className="flex flex-col justify-between bg-[#f3f3f1] p-8 md:p-12 lg:p-16">
              <div>
                <span className="font-bebas text-7xl leading-none text-black/[0.07] md:text-8xl">
                  01
                </span>

                <h2 className="mt-6 max-w-xl font-bebas text-5xl leading-[0.95] tracking-wide md:text-6xl lg:text-7xl">
                  Your search should feel easy.
                </h2>

                <div className="mt-8 max-w-xl space-y-5 font-montserrat text-sm leading-7 text-black/55">
                  <p>
                    Finding your next vehicle should not feel complicated.
                    That is why we focus on giving you the information you need
                    and making it easy to connect with our team.
                  </p>

                  <p>
                    Browse our current inventory, explore individual vehicles,
                    arrange a test drive and speak directly with our dealership
                    whenever you are ready.
                  </p>
                </div>
              </div>

              <div className="mt-12 flex items-center gap-3 border-t border-black/10 pt-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white">
                  <ArrowDownRight size={17} strokeWidth={1.5} />
                </div>

                <span className="font-montserrat text-[10px] font-medium uppercase tracking-[0.2em] text-black/45">
                  Simple by design
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          OUR APPROACH
      ========================================================= */}

      <section className="border-y border-black/10 bg-[#f7f7f5]">
        <div className="mx-auto max-w-[1800px] px-6 py-20 md:px-10 md:py-28 lg:px-14">
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            {/* LEFT */}
            <div>
              <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.3em] text-black/35 md:text-xs">
                Our approach
              </p>

              <h2 className="mt-5 font-bebas text-6xl leading-[0.9] tracking-wide md:text-8xl">
                What
                <br />
                matters.
              </h2>

              <p className="mt-7 max-w-sm font-montserrat text-sm leading-7 text-black/50">
                We believe a good dealership experience starts with clarity,
                honest communication and vehicles worth considering.
              </p>
            </div>

            {/* RIGHT */}
            <div className="grid border-t border-black/10 md:grid-cols-2">
              <AboutFeature
                number="01"
                icon={CarFront}
                title="Quality vehicles"
                description="We showcase vehicles currently available through our dealership with the details you need to make an informed decision."
              />

              <AboutFeature
                number="02"
                icon={ShieldCheck}
                title="Straightforward service"
                description="From your first question to your test drive, our goal is to keep the process clear and comfortable."
              />

              <AboutFeature
                number="03"
                icon={Users}
                title="Personal attention"
                description="Every customer has different needs. Our team is here to understand what you're looking for."
              />

              <AboutFeature
                number="04"
                icon={MapPin}
                title="Local dealership"
                description="Visit us in person, explore our vehicles and speak directly with our team."
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          VALUES
      ========================================================= */}

      <section className="bg-black text-white">
        <div className="mx-auto max-w-[1800px] px-6 py-20 md:px-10 md:py-28 lg:px-14">
          <div className="grid gap-16 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <div>
              <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.3em] text-white/35 md:text-xs">
                Why choose us
              </p>

              <h2 className="mt-5 max-w-lg font-bebas text-6xl leading-[0.9] tracking-wide md:text-8xl">
                Less
                <br />
                complication.
                <br />
                More clarity.
              </h2>
            </div>

            <div className="grid gap-10 sm:grid-cols-2">
              <ValueItem
                title="Transparent"
                description="Clear vehicle information and a straightforward way to get in touch."
              />

              <ValueItem
                title="Customer focused"
                description="We take the time to understand what you're actually looking for."
              />

              <ValueItem
                title="Convenient"
                description="Explore inventory online before making the trip to the dealership."
              />

              <ValueItem
                title="Local"
                description="A real dealership and a real team ready to help."
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}

      <section className="bg-[#f7f7f5] px-6 py-5 md:px-10 lg:px-14">
        <div className="mx-auto max-w-[1800px]">
          <div className="relative overflow-hidden bg-[#e9e9e6] px-7 py-16 md:px-12 md:py-20 lg:px-16 lg:py-24">
            {/* DECORATIVE NUMBER */}
            <span className="absolute -bottom-16 -right-4 font-bebas text-[18rem] leading-none tracking-[-0.08em] text-black/[0.035] md:text-[24rem]">
              04
            </span>

            <div className="relative z-10 max-w-3xl">
              <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.3em] text-black/35 md:text-xs">
                Find your next car
              </p>

              <h2 className="mt-5 font-bebas text-6xl leading-[0.9] tracking-wide md:text-8xl">
                Ready to find
                <br />
                your vehicle?
              </h2>

              <p className="mt-6 max-w-xl font-montserrat text-sm leading-7 text-black/50 md:text-base">
                Explore our current inventory and discover the vehicles
                available through {dealershipName}.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/cars"
                  className="group inline-flex items-center gap-4 bg-black px-6 py-4 font-montserrat text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-black/80"
                >
                  Browse inventory

                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.5}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>

                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-4 border border-black/15 bg-white px-6 py-4 font-montserrat text-[10px] font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:border-black/30"
                >
                  Contact us

                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.5}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   FEATURE
========================================================= */

function AboutFeature({
  number,
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="group border-b border-black/10 p-7 md:p-9 md:first:border-r md:nth-[2]:border-r">
      <div className="flex items-start justify-between gap-5">
        <span className="font-bebas text-4xl leading-none text-black/10">
          {number}
        </span>

        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white transition-all duration-500 group-hover:border-black/30 group-hover:scale-105">
          <Icon
            size={19}
            strokeWidth={1.3}
            className="text-black/60"
          />
        </div>
      </div>

      <h3 className="mt-12 font-bebas text-4xl tracking-wide md:text-5xl">
        {title}
      </h3>

      <p className="mt-4 font-montserrat text-sm leading-7 text-black/50">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   VALUE ITEM
========================================================= */

function ValueItem({ title, description }) {
  return (
    <div className="border-t border-white/10 pt-6">
      <div className="flex items-center gap-3">
        <Check
          size={17}
          strokeWidth={1.5}
          className="text-white/50"
        />

        <h3 className="font-bebas text-3xl tracking-wide md:text-4xl">
          {title}
        </h3>
      </div>

      <p className="mt-4 max-w-sm font-montserrat text-sm leading-7 text-white/45">
        {description}
      </p>
    </div>
  );
}