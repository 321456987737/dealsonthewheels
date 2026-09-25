import Link from "next/link";

export default function CarCard({ car }) {
  const image = car.images?.[0];

  const formattedPrice = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(car.price);

  const formattedMileage = new Intl.NumberFormat("en-US").format(
    car.mileage || 0
  );

  return (
    <article className="group overflow-hidden rounded-2xl border border-black/10 bg-white">
      <Link href={`/cars/${car._id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
          {image?.url ? (
            <img
              src={image.url}
              alt={image.alt || `${car.make} ${car.model}`}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-black/40">
              No image available
            </div>
          )}

          <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black shadow-sm">
            {car.condition}
          </div>

          {car.isFeatured && (
            <div className="absolute right-4 top-4 rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white">
              Featured
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <Link href={`/cars/${car._id}`}>
              <h3 className="text-lg font-semibold tracking-tight text-black transition group-hover:text-black/60">
                {car.make} {car.model}
              </h3>
            </Link>

            <p className="mt-1 text-sm text-black/50">
              {car.year} · {formattedMileage} {car.mileageUnit}
            </p>
          </div>

          <p className="shrink-0 text-base font-semibold text-black">
            {car.currency} {formattedPrice}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-black/10 pt-4 text-xs text-black/55">
          <span>{car.transmission}</span>
          <span>{car.fuelType}</span>
          <span>{car.bodyType}</span>
        </div>
      </div>
    </article>
  );
}