import Link from "next/link";
import CarForm from "@/components/admin/CarForm";

export default function NewCarPage() {
  return (
    <div className="mx-auto max-w-5xl md:pb-0 pb-20">
      <div className="mb-8">
        <Link
          href="/admin/cars"
          className="text-sm text-black/45 underline underline-offset-4 transition hover:text-black"
        >
          ← Back to inventory
        </Link>

        <div className="mt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/35">
            Inventory
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Add a car
          </h1>

          <p className="mt-2 text-sm leading-6 text-black/45">
            Add a vehicle to your dealerships online inventory.
          </p>
        </div>
      </div>

      <CarForm />
    </div>
  );
}