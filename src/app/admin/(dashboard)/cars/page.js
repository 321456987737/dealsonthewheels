
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminCarsPage() {
  const [cars, setCars] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [condition, setCondition] = useState("");
  const [sort, setSort] = useState("newest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);

  async function loadCars(page = 1) {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (status) {
        params.set("status", status);
      }

      if (condition) {
        params.set("condition", condition);
      }

      params.set("sort", sort);
      params.set("page", String(page));
      params.set("limit", "15");

      const response = await fetch(
        `/api/admin/cars?${params.toString()}`,
        {
          cache: "no-store",
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load inventory",
        );
      }

      setCars(result.data.cars);
      setPagination(result.data.pagination);
    } catch (loadError) {
      console.error(loadError);

      setError(
        loadError.message || "Failed to load inventory",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadCars(1);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [status, condition, sort]);

  async function handleSearch(event) {
    event.preventDefault();
    await loadCars(1);
  }

  async function updateStatus(carId, nextStatus) {
    try {
      setActionId(carId);
      setError("");

      const response = await fetch(
        `/api/admin/cars/${carId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update status",
        );
      }

      setCars((current) =>
        current.map((car) =>
          car._id === carId
            ? {
                ...car,
                status: nextStatus,
              }
            : car,
        ),
      );
    } catch (updateError) {
      console.error(updateError);

      setError(
        updateError.message ||
          "Failed to update status",
      );
    } finally {
      setActionId(null);
    }
  }

  async function toggleFeatured(car) {
    try {
      setActionId(car._id);
      setError("");

      const response = await fetch(
        `/api/admin/cars/${car._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isFeatured: !car.isFeatured,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to update featured status",
        );
      }

      setCars((current) =>
        current.map((item) =>
          item._id === car._id
            ? {
                ...item,
                isFeatured: !item.isFeatured,
              }
            : item,
        ),
      );
    } catch (toggleError) {
      console.error(toggleError);

      setError(
        toggleError.message ||
          "Failed to update featured status",
      );
    } finally {
      setActionId(null);
    }
  }

  async function deleteCar(carId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(carId);
      setError("");

      const response = await fetch(
        `/api/admin/cars/${carId}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to delete car",
        );
      }

      setCars((current) =>
        current.filter((car) => car._id !== carId),
      );

      setPagination((current) => ({
        ...current,
        total: Math.max(current.total - 1, 0),
      }));
    } catch (deleteError) {
      console.error(deleteError);

      setError(
        deleteError.message || "Failed to delete car",
      );
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl min-w-0 md:pb-0 pb-20">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-6 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/35">
            Inventory
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Cars
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-black/45">
            Manage every vehicle on the dealership website.
          </p>
        </div>

        <Link
          href="/admin/cars/new"
          className="inline-flex w-full shrink-0 items-center justify-center rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-black/80 active:scale-[0.98] sm:w-auto"
        >
          + Add Car
        </Link>
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700 sm:p-5">
          {error}
        </div>
      )}

      {/* =====================================================
          FILTERS
      ====================================================== */}

      <section className="rounded-2xl border border-black/10 bg-white p-3 sm:p-5">
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1fr)_160px_160px_180px_auto]"
        >
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search make, model or stock number"
            className="h-11 w-full min-w-0 rounded-xl border border-black/15 px-4 text-sm outline-none placeholder:text-black/30 focus:border-black"
          />

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="h-11 w-full min-w-0 rounded-xl border border-black/15 bg-white px-3 text-sm outline-none focus:border-black"
          >
            <option value="">All statuses</option>
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Sold">Sold</option>
          </select>

          <select
            value={condition}
            onChange={(event) =>
              setCondition(event.target.value)
            }
            className="h-11 w-full min-w-0 rounded-xl border border-black/15 bg-white px-3 text-sm outline-none focus:border-black"
          >
            <option value="">All conditions</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>

          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value)
            }
            className="h-11 w-full min-w-0 rounded-xl border border-black/15 bg-white px-3 text-sm outline-none focus:border-black"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="price-low">
              Price: Low to High
            </option>
            <option value="price-high">
              Price: High to Low
            </option>
            <option value="year-new">Newest year</option>
            <option value="year-old">Oldest year</option>
          </select>

          <button
            type="submit"
            className="h-11 w-full rounded-xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/80 active:scale-[0.98] sm:col-span-2 lg:col-span-1"
          >
            Search
          </button>
        </form>
      </section>

      {/* =====================================================
          INVENTORY
      ====================================================== */}

      <section className="mt-5 overflow-hidden rounded-2xl border border-black/10 bg-white sm:mt-6">
        {/* Inventory Header */}

        <div className="flex items-center justify-between border-b border-black/10 px-4 py-4 sm:px-6 sm:py-5">
          <div>
            <h2 className="font-semibold">Inventory</h2>

            <p className="mt-1 text-xs text-black/40">
              {pagination.total}{" "}
              {pagination.total === 1
                ? "vehicle"
                : "vehicles"}
            </p>
          </div>
        </div>

        {/* Loading */}

        {loading ? (
          <>
            <div className="hidden md:block">
              <LoadingTable />
            </div>

            <div className="md:hidden">
              <LoadingCards />
            </div>
          </>
        ) : cars.length === 0 ? (
          <EmptyInventory />
        ) : (
          <>
            {/* =================================================
                DESKTOP TABLE
            ================================================== */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="border-b border-black/10 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
                      Vehicle
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
                      Price
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
                      Mileage
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
                      Featured
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {cars.map((car) => {
                    const busy = actionId === car._id;

                    return (
                      <tr
                        key={car._id}
                        className="border-b border-black/10 last:border-0"
                      >
                        {/* Vehicle */}

                        <td className="px-6 py-5">
                          <VehicleInfo car={car} />
                        </td>

                        {/* Price */}

                        <td className="px-6 py-5">
                          <p className="text-sm font-semibold">
                            {car.currency}{" "}
                            {formatNumber(car.price)}
                          </p>
                        </td>

                        {/* Mileage */}

                        <td className="px-6 py-5">
                          <p className="text-sm text-black/55">
                            {formatNumber(car.mileage)}{" "}
                            {car.mileageUnit}
                          </p>
                        </td>

                        {/* Status */}

                        <td className="px-6 py-5">
                          <StatusSelect
                            value={car.status}
                            disabled={busy}
                            onChange={(value) =>
                              updateStatus(
                                car._id,
                                value,
                              )
                            }
                          />
                        </td>

                        {/* Featured */}

                        <td className="px-6 py-5">
                          <FeaturedButton
                            featured={car.isFeatured}
                            disabled={busy}
                            onClick={() =>
                              toggleFeatured(car)
                            }
                          />
                        </td>

                        {/* Actions */}

                        <td className="px-6 py-5">
                          <CarActions
                            car={car}
                            busy={busy}
                            onDelete={deleteCar}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* =================================================
                MOBILE / TABLET CARDS
            ================================================== */}

            <div className="divide-y divide-black/10 md:hidden">
              {cars.map((car) => {
                const busy = actionId === car._id;

                return (
                  <div
                    key={car._id}
                    className="p-4 sm:p-5"
                  >
                    {/* Top */}

                    <div className="flex gap-3">
                      <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-black/[0.05] sm:h-24 sm:w-32">
                        {car.images?.[0]?.url ? (
                          <img
                            src={car.images[0].url}
                            alt={`${car.make} ${car.model}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] font-medium uppercase tracking-wider text-black/25">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold sm:text-base">
                              {car.make} {car.model}
                            </p>

                            <p className="mt-1 text-xs text-black/40">
                              {car.year} · {car.condition}
                            </p>

                            {car.stockNumber && (
                              <p className="mt-1 text-[11px] text-black/35">
                                #{car.stockNumber}
                              </p>
                            )}
                          </div>

                          {car.isFeatured && (
                            <span className="shrink-0 rounded-full bg-black px-2.5 py-1 text-[10px] font-semibold text-white">
                              Featured
                            </span>
                          )}
                        </div>

                        <p className="mt-3 text-sm font-semibold">
                          {car.currency}{" "}
                          {formatNumber(car.price)}
                        </p>
                      </div>
                    </div>

                    {/* Details */}

                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      <div className="rounded-xl bg-black/[0.035] px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-wider text-black/35">
                          Mileage
                        </p>

                        <p className="mt-1 text-xs font-semibold">
                          {formatNumber(car.mileage)}{" "}
                          {car.mileageUnit}
                        </p>
                      </div>

                      <div className="rounded-xl bg-black/[0.035] px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-wider text-black/35">
                          Status
                        </p>

                        <div className="mt-1">
                          <StatusSelect
                            value={car.status}
                            disabled={busy}
                            onChange={(value) =>
                              updateStatus(
                                car._id,
                                value,
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="col-span-2 rounded-xl bg-black/[0.035] px-3 py-2.5 sm:col-span-1">
                        <p className="text-[10px] uppercase tracking-wider text-black/35">
                          Featured
                        </p>

                        <div className="mt-1">
                          <FeaturedButton
                            featured={car.isFeatured}
                            disabled={busy}
                            onClick={() =>
                              toggleFeatured(car)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Link
                        href={`/admin/cars/${car._id}/edit`}
                        className="flex h-10 items-center justify-center rounded-xl border border-black/10 text-xs font-semibold transition hover:bg-black hover:text-white active:scale-[0.98]"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          deleteCar(car._id)
                        }
                        className="h-10 rounded-xl border border-red-200 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
                      >
                        {busy ? "Working..." : "Delete"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* =====================================================
          PAGINATION
      ====================================================== */}

      {!loading && pagination.totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2 sm:mt-6 sm:gap-3">
          <button
            type="button"
            disabled={!pagination.hasPreviousPage}
            onClick={() =>
              loadCars(pagination.page - 1)
            }
            className="rounded-full border border-black/10 bg-white px-3.5 py-2.5 text-xs font-medium transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-35 sm:px-5 sm:py-3 sm:text-sm"
          >
            Previous
          </button>

          <div className="rounded-full bg-black px-3.5 py-2.5 text-xs font-semibold text-white sm:px-4 sm:py-3 sm:text-sm">
            {pagination.page} / {pagination.totalPages}
          </div>

          <button
            type="button"
            disabled={!pagination.hasNextPage}
            onClick={() =>
              loadCars(pagination.page + 1)
            }
            className="rounded-full border border-black/10 bg-white px-3.5 py-2.5 text-xs font-medium transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-35 sm:px-5 sm:py-3 sm:text-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   VEHICLE INFO
========================================================= */

function VehicleInfo({ car }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-black/[0.05]">
        {car.images?.[0]?.url ? (
          <img
            src={car.images[0].url}
            alt={`${car.make} ${car.model}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[9px] uppercase tracking-wider text-black/25">
            No image
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="font-semibold">
          {car.make} {car.model}
        </p>

        <p className="mt-1 text-xs text-black/40">
          {car.year} · {car.condition}
          {car.stockNumber
            ? ` · #${car.stockNumber}`
            : ""}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   STATUS
========================================================= */

function StatusSelect({
  value,
  disabled,
  onChange,
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(event) =>
        onChange(event.target.value)
      }
      className="rounded-lg border border-black/10 bg-white px-2.5 py-2 text-xs font-semibold outline-none focus:border-black disabled:opacity-40"
    >
      <option value="Available">Available</option>
      <option value="Reserved">Reserved</option>
      <option value="Sold">Sold</option>
    </select>
  );
}

/* =========================================================
   FEATURED BUTTON
========================================================= */

function FeaturedButton({
  featured,
  disabled,
  onClick,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
        featured
          ? "bg-black text-white"
          : "bg-black/[0.05] text-black/50 hover:bg-black/[0.1]"
      }`}
    >
      {featured ? "Featured" : "Feature"}
    </button>
  );
}

/* =========================================================
   DESKTOP ACTIONS
========================================================= */

function CarActions({
  car,
  busy,
  onDelete,
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/admin/cars/${car._id}/edit`}
        className="rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold transition hover:bg-black hover:text-white"
      >
        Edit
      </Link>

      <button
        type="button"
        disabled={busy}
        onClick={() => onDelete(car._id)}
        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? "Working..." : "Delete"}
      </button>
    </div>
  );
}

/* =========================================================
   DESKTOP LOADING
========================================================= */

function LoadingTable() {
  return (
    <div className="divide-y divide-black/10">
      {Array.from({ length: 6 }).map(
        (_, index) => (
          <div
            key={index}
            className="flex items-center gap-5 px-6 py-5"
          >
            <div className="h-16 w-20 animate-pulse rounded-xl bg-black/[0.05]" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 animate-pulse rounded bg-black/[0.05]" />

              <div className="h-3 w-32 animate-pulse rounded bg-black/[0.05]" />
            </div>

            <div className="h-9 w-24 animate-pulse rounded-lg bg-black/[0.05]" />
          </div>
        ),
      )}
    </div>
  );
}

/* =========================================================
   MOBILE LOADING
========================================================= */

function LoadingCards() {
  return (
    <div className="divide-y divide-black/10">
      {Array.from({ length: 5 }).map(
        (_, index) => (
          <div
            key={index}
            className="p-4 sm:p-5"
          >
            <div className="flex gap-3">
              <div className="h-20 w-24 animate-pulse rounded-xl bg-black/[0.05] sm:h-24 sm:w-32" />

              <div className="flex-1 space-y-3">
                <div className="h-4 w-32 animate-pulse rounded bg-black/[0.05]" />

                <div className="h-3 w-20 animate-pulse rounded bg-black/[0.05]" />

                <div className="h-4 w-24 animate-pulse rounded bg-black/[0.05]" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="h-14 animate-pulse rounded-xl bg-black/[0.05]" />
              <div className="h-14 animate-pulse rounded-xl bg-black/[0.05]" />
            </div>
          </div>
        ),
      )}
    </div>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function EmptyInventory() {
  return (
    <div className="px-5 py-16 text-center sm:px-6 sm:py-20">
      <h3 className="text-lg font-semibold">
        No vehicles found
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-black/45">
        Add your first vehicle to start building
        your dealership inventory.
      </p>

      <Link
        href="/admin/cars/new"
        className="mt-6 inline-flex rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-black/80"
      >
        + Add Car
      </Link>
    </div>
  );
}

/* =========================================================
   NUMBER FORMAT
========================================================= */

function formatNumber(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value || 0);
}

// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";

// export default function AdminCarsPage() {
//   const [cars, setCars] = useState([]);
//   const [pagination, setPagination] =
//     useState({
//       page: 1,
//       limit: 15,
//       total: 0,
//       totalPages: 0,
//       hasNextPage: false,
//       hasPreviousPage: false,
//     });

//   const [search, setSearch] =
//     useState("");

//   const [status, setStatus] =
//     useState("");

//   const [condition, setCondition] =
//     useState("");

//   const [sort, setSort] =
//     useState("newest");

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState("");

//   const [actionId, setActionId] =
//     useState(null);

//   async function loadCars(page = 1) {
//     try {
//       setLoading(true);
//       setError("");

//       const params = new URLSearchParams();

//       if (search.trim()) {
//         params.set(
//           "search",
//           search.trim()
//         );
//       }

//       if (status) {
//         params.set("status", status);
//       }

//       if (condition) {
//         params.set("condition", condition);
//       }

//       params.set("sort", sort);
//       params.set("page", String(page));
//       params.set("limit", "15");

//       const response = await fetch(
//         `/api/admin/cars?${params.toString()}`,
//         {
//           cache: "no-store",
//         }
//       );

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message ||
//             "Failed to load inventory"
//         );
//       }

//       setCars(result.data.cars);
//       setPagination(
//         result.data.pagination
//       );
//     } catch (loadError) {
//       console.error(loadError);

//       setError(
//         loadError.message ||
//           "Failed to load inventory"
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     const timeoutId = window.setTimeout(() => {
//       loadCars(1);
//     }, 0);

//     return () => window.clearTimeout(timeoutId);
//   }, [status, condition, sort]);

//   async function handleSearch(event) {
//     event.preventDefault();

//     await loadCars(1);
//   }

//   async function updateStatus(
//     carId,
//     nextStatus
//   ) {
//     try {
//       setActionId(carId);
//       setError("");

//       const response = await fetch(
//         `/api/admin/cars/${carId}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             status: nextStatus,
//           }),
//         }
//       );

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message ||
//             "Failed to update status"
//         );
//       }

//       setCars((current) =>
//         current.map((car) =>
//           car._id === carId
//             ? {
//                 ...car,
//                 status: nextStatus,
//               }
//             : car
//         )
//       );
//     } catch (updateError) {
//       console.error(updateError);

//       setError(
//         updateError.message ||
//           "Failed to update status"
//       );
//     } finally {
//       setActionId(null);
//     }
//   }

//   async function toggleFeatured(car) {
//     try {
//       setActionId(car._id);
//       setError("");

//       const response = await fetch(
//         `/api/admin/cars/${car._id}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             isFeatured: !car.isFeatured,
//           }),
//         }
//       );

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message ||
//             "Failed to update featured status"
//         );
//       }

//       setCars((current) =>
//         current.map((item) =>
//           item._id === car._id
//             ? {
//                 ...item,
//                 isFeatured:
//                   !item.isFeatured,
//               }
//             : item
//         )
//       );
//     } catch (toggleError) {
//       console.error(toggleError);

//       setError(
//         toggleError.message ||
//           "Failed to update featured status"
//       );
//     } finally {
//       setActionId(null);
//     }
//   }

//   async function deleteCar(carId) {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this vehicle? This action cannot be undone."
//     );

//     if (!confirmed) {
//       return;
//     }

//     try {
//       setActionId(carId);
//       setError("");

//       const response = await fetch(
//         `/api/admin/cars/${carId}`,
//         {
//           method: "DELETE",
//         }
//       );

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message ||
//             "Failed to delete car"
//         );
//       }

//       setCars((current) =>
//         current.filter(
//           (car) => car._id !== carId
//         )
//       );

//       setPagination((current) => ({
//         ...current,
//         total: Math.max(
//           current.total - 1,
//           0
//         ),
//       }));
//     } catch (deleteError) {
//       console.error(deleteError);

//       setError(
//         deleteError.message ||
//           "Failed to delete car"
//       );
//     } finally {
//       setActionId(null);
//     }
//   }

//   return (
//     <div className="mx-auto max-w-7xl">
//       <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
//         <div>
//           <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/35">
//             Inventory
//           </p>

//           <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
//             Cars
//           </h1>

//           <p className="mt-2 text-sm text-black/45">
//             Manage every vehicle on the dealership website.
//           </p>
//         </div>

//         <Link
//           href="/admin/cars/new"
//           className="inline-flex w-fit rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-black/80"
//         >
//           + Add Car
//         </Link>
//       </div>

//       {error && (
//         <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       {/* Filters */}
//       <section className="rounded-2xl border border-black/10 bg-white p-5">
//         <form
//           onSubmit={handleSearch}
//           className="grid gap-3 lg:grid-cols-[1fr_180px_180px_200px_auto]"
//         >
//           <input
//             type="text"
//             value={search}
//             onChange={(event) =>
//               setSearch(event.target.value)
//             }
//             placeholder="Search make, model or stock number"
//             className="h-11 rounded-xl border border-black/15 px-4 text-sm outline-none placeholder:text-black/30 focus:border-black"
//           />

//           <select
//             value={status}
//             onChange={(event) =>
//               setStatus(event.target.value)
//             }
//             className="h-11 rounded-xl border border-black/15 bg-white px-3 text-sm outline-none focus:border-black"
//           >
//             <option value="">
//               All statuses
//             </option>

//             <option value="Available">
//               Available
//             </option>

//             <option value="Reserved">
//               Reserved
//             </option>

//             <option value="Sold">
//               Sold
//             </option>
//           </select>

//           <select
//             value={condition}
//             onChange={(event) =>
//               setCondition(
//                 event.target.value
//               )
//             }
//             className="h-11 rounded-xl border border-black/15 bg-white px-3 text-sm outline-none focus:border-black"
//           >
//             <option value="">
//               All conditions
//             </option>

//             <option value="New">
//               New
//             </option>

//             <option value="Used">
//               Used
//             </option>
//           </select>

//           <select
//             value={sort}
//             onChange={(event) =>
//               setSort(event.target.value)
//             }
//             className="h-11 rounded-xl border border-black/15 bg-white px-3 text-sm outline-none focus:border-black"
//           >
//             <option value="newest">
//               Newest first
//             </option>

//             <option value="oldest">
//               Oldest first
//             </option>

//             <option value="price-low">
//               Price: Low to High
//             </option>

//             <option value="price-high">
//               Price: High to Low
//             </option>

//             <option value="year-new">
//               Newest year
//             </option>

//             <option value="year-old">
//               Oldest year
//             </option>
//           </select>

//           <button
//             type="submit"
//             className="h-11 rounded-xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/80"
//           >
//             Search
//           </button>
//         </form>
//       </section>

//       {/* Inventory */}
//       <section className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white">
//         <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
//           <div>
//             <h2 className="font-semibold">
//               Inventory
//             </h2>

//             <p className="mt-1 text-xs text-black/40">
//               {pagination.total}{" "}
//               {pagination.total === 1
//                 ? "vehicle"
//                 : "vehicles"}
//             </p>
//           </div>
//         </div>

//         {loading ? (
//           <LoadingTable />
//         ) : cars.length === 0 ? (
//           <EmptyInventory />
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[900px] border-collapse">
//               <thead>
//                 <tr className="border-b border-black/10 text-left">
//                   <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
//                     Vehicle
//                   </th>

//                   <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
//                     Price
//                   </th>

//                   <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
//                     Mileage
//                   </th>

//                   <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
//                     Status
//                   </th>

//                   <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
//                     Featured
//                   </th>

//                   <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {cars.map((car) => {
//                   const busy =
//                     actionId === car._id;

//                   return (
//                     <tr
//                       key={car._id}
//                       className="border-b border-black/10 last:border-0"
//                     >
//                       <td className="px-6 py-5">
//                         <div className="flex items-center gap-4">
//                           <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-black/[0.05]">
//                             {car.images?.[0]
//                               ?.url && (
//                               <img
//                                 src={
//                                   car.images[0]
//                                     .url
//                                 }
//                                 alt={`${car.make} ${car.model}`}
//                                 className="h-full w-full object-cover"
//                               />
//                             )}
//                           </div>

//                           <div>
//                             <p className="font-semibold">
//                               {car.make}{" "}
//                               {car.model}
//                             </p>

//                             <p className="mt-1 text-xs text-black/40">
//                               {car.year} ·{" "}
//                               {car.condition}
//                               {car.stockNumber
//                                 ? ` · #${car.stockNumber}`
//                                 : ""}
//                             </p>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="px-6 py-5">
//                         <p className="text-sm font-semibold">
//                           {car.currency}{" "}
//                           {formatNumber(
//                             car.price
//                           )}
//                         </p>
//                       </td>

//                       <td className="px-6 py-5">
//                         <p className="text-sm text-black/55">
//                           {formatNumber(
//                             car.mileage
//                           )}{" "}
//                           {car.mileageUnit}
//                         </p>
//                       </td>

//                       <td className="px-6 py-5">
//                         <StatusSelect
//                           value={car.status}
//                           disabled={busy}
//                           onChange={(value) =>
//                             updateStatus(
//                               car._id,
//                               value
//                             )
//                           }
//                         />
//                       </td>

//                       <td className="px-6 py-5">
//                         <button
//                           type="button"
//                           disabled={busy}
//                           onClick={() =>
//                             toggleFeatured(
//                               car
//                             )
//                           }
//                           className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
//                             car.isFeatured
//                               ? "bg-black text-white"
//                               : "bg-black/[0.05] text-black/50 hover:bg-black/[0.1]"
//                           }`}
//                         >
//                           {car.isFeatured
//                             ? "Featured"
//                             : "Feature"}
//                         </button>
//                       </td>

//                       <td className="px-6 py-5">
//                         <div className="flex items-center justify-end gap-2">
//                           <Link
//                             href={`/admin/cars/${car._id}/edit`}
//                             className="rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold transition hover:bg-black hover:text-white"
//                           >
//                             Edit
//                           </Link>

//                           <button
//                             type="button"
//                             disabled={busy}
//                             onClick={() =>
//                               deleteCar(
//                                 car._id
//                               )
//                             }
//                             className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-40"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section>

//       {/* Pagination */}
//       {!loading &&
//         pagination.totalPages > 1 && (
//           <div className="mt-6 flex items-center justify-center gap-3">
//             <button
//               type="button"
//               disabled={
//                 !pagination.hasPreviousPage
//               }
//               onClick={() =>
//                 loadCars(
//                   pagination.page - 1
//                 )
//               }
//               className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-35"
//             >
//               Previous
//             </button>

//             <div className="rounded-full bg-black px-4 py-3 text-sm font-semibold text-white">
//               {pagination.page} /{" "}
//               {pagination.totalPages}
//             </div>

//             <button
//               type="button"
//               disabled={
//                 !pagination.hasNextPage
//               }
//               onClick={() =>
//                 loadCars(
//                   pagination.page + 1
//                 )
//               }
//               className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-35"
//             >
//               Next
//             </button>
//           </div>
//         )}
//     </div>
//   );
// }

// function StatusSelect({
//   value,
//   disabled,
//   onChange,
// }) {
//   return (
//     <select
//       value={value}
//       disabled={disabled}
//       onChange={(event) =>
//         onChange(event.target.value)
//       }
//       className="rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-black disabled:opacity-40"
//     >
//       <option value="Available">
//         Available
//       </option>

//       <option value="Reserved">
//         Reserved
//       </option>

//       <option value="Sold">
//         Sold
//       </option>
//     </select>
//   );
// }

// function LoadingTable() {
//   return (
//     <div className="divide-y divide-black/10">
//       {Array.from({ length: 6 }).map(
//         (_, index) => (
//           <div
//             key={index}
//             className="flex items-center gap-5 px-6 py-5"
//           >
//             <div className="h-16 w-20 animate-pulse rounded-xl bg-black/[0.05]" />

//             <div className="flex-1 space-y-2">
//               <div className="h-4 w-48 animate-pulse rounded bg-black/[0.05]" />

//               <div className="h-3 w-32 animate-pulse rounded bg-black/[0.05]" />
//             </div>

//             <div className="h-9 w-24 animate-pulse rounded-lg bg-black/[0.05]" />
//           </div>
//         )
//       )}
//     </div>
//   );
// }

// function EmptyInventory() {
//   return (
//     <div className="px-6 py-20 text-center">
//       <h3 className="text-lg font-semibold">
//         No vehicles found
//       </h3>

//       <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-black/45">
//         Add your first vehicle to start building
//         your dealership inventory.
//       </p>

//       <Link
//         href="/admin/cars/new"
//         className="mt-6 inline-flex rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white"
//       >
//         + Add Car
//       </Link>
//     </div>
//   );
// }

// function formatNumber(value) {
//   return new Intl.NumberFormat(
//     "en-US",
//     {
//       maximumFractionDigits: 0,
//     }
//   ).format(value || 0);
// }