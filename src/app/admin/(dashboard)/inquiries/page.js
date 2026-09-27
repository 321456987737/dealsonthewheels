"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STATUS_OPTIONS = ["New", "Contacted", "In Progress", "Closed"];

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);

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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);

  const [selectedInquiry, setSelectedInquiry] = useState(null);

  async function loadInquiries(page = 1) {
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

      params.set("page", String(page));
      params.set("limit", "15");

      const response = await fetch(
        `/api/admin/inquiries?${params.toString()}`,
        {
          cache: "no-store",
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load inquiries");
      }

      setInquiries(result.data.inquiries);

      setPagination(result.data.pagination);
    } catch (loadError) {
      console.error(loadError);

      setError(loadError.message || "Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  }

  /*
   * Deferred initial/status fetch.
   *
   * This avoids calling state-updating code
   * synchronously inside the effect.
   */

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadInquiries(1);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [status]);

  async function handleSearch(event) {
    event.preventDefault();

    await loadInquiries(1);
  }

  async function updateStatus(inquiryId, nextStatus) {
    try {
      setActionId(inquiryId);
      setError("");

      const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update status");
      }

      setInquiries((current) =>
        current.map((inquiry) =>
          inquiry._id === inquiryId
            ? {
                ...inquiry,
                status: nextStatus,
              }
            : inquiry,
        ),
      );

      setSelectedInquiry((current) =>
        current?._id === inquiryId
          ? {
              ...current,
              status: nextStatus,
            }
          : current,
      );
    } catch (updateError) {
      console.error(updateError);

      setError(updateError.message || "Failed to update status");
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl min-w-0 pb-20 md:pb-0">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-6 sm:mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/35">
          Customer leads
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Inquiries
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/45">
          Manage messages from customers interested in your vehicles.
        </p>
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700 sm:mb-6 sm:p-5">
          {error}
        </div>
      )}

      {/* =====================================================
          SEARCH / FILTERS
      ====================================================== */}

      <section className="rounded-2xl border border-black/10 bg-white p-3 sm:p-5">
        <form
          onSubmit={handleSearch}
          className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1fr)_200px_auto]"
        >
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search customer, phone, email or message"
            className="h-11 w-full min-w-0 rounded-xl border border-black/15 px-4 text-sm outline-none placeholder:text-black/30 focus:border-black"
          />

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-11 w-full min-w-0 rounded-xl border border-black/15 bg-white px-3 text-sm outline-none focus:border-black"
          >
            <option value="">All statuses</option>

            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="h-11 w-full rounded-xl bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/80 active:scale-[0.98] sm:col-span-2 lg:col-span-1"
          >
            Search
          </button>
        </form>
      </section>

      {/* =====================================================
          INQUIRY LIST
      ====================================================== */}

      <section className="mt-5 overflow-hidden rounded-2xl border border-black/10 bg-white sm:mt-6">
        {/* Section header */}

        <div className="flex items-center justify-between border-b border-black/10 px-4 py-4 sm:px-6 sm:py-5">
          <div>
            <h2 className="font-semibold">Customer inquiries</h2>

            <p className="mt-1 text-xs text-black/40">
              {pagination.total}{" "}
              {pagination.total === 1 ? "inquiry" : "inquiries"}
            </p>
          </div>
        </div>

        {/* ===================================================
            LOADING
        ==================================================== */}

        {loading ? (
          <>
            <div className="hidden md:block">
              <LoadingRows />
            </div>

            <div className="md:hidden">
              <LoadingCards />
            </div>
          </>
        ) : inquiries.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* =================================================
                DESKTOP TABLE
            ================================================== */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[1000px] border-collapse">
                <thead>
                  <tr className="border-b border-black/10 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
                      Vehicle
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
                      Message
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {inquiries.map((inquiry) => {
                    const busy = actionId === inquiry._id;

                    return (
                      <tr
                        key={inquiry._id}
                        className="border-b border-black/10 last:border-0"
                      >
                        {/* Customer */}

                        <td className="px-6 py-5">
                          <button
                            type="button"
                            onClick={() => setSelectedInquiry(inquiry)}
                            className="text-left"
                          >
                            <p className="font-semibold transition hover:text-black/55">
                              {inquiry.customerName}
                            </p>

                            <p className="mt-1 text-xs text-black/45">
                              {inquiry.phone}
                            </p>

                            {inquiry.email && (
                              <p className="mt-1 max-w-[220px] truncate text-xs text-black/35">
                                {inquiry.email}
                              </p>
                            )}
                          </button>
                        </td>

                        {/* Vehicle */}

                        <td className="px-6 py-5">
                          {inquiry.carId ? (
                            <Link
                              href={`/cars/${inquiry.carId._id}`}
                              target="_blank"
                              className="group flex items-center gap-3"
                            >
                              <div className="h-12 w-14 shrink-0 overflow-hidden rounded-lg bg-black/[0.05]">
                                {inquiry.carId.images?.[0]?.url ? (
                                  <img
                                    src={inquiry.carId.images[0].url}
                                    alt={`${inquiry.carId.make} ${inquiry.carId.model}`}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-[9px] uppercase tracking-wider text-black/25">
                                    No image
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold group-hover:underline">
                                  {inquiry.carId.make} {inquiry.carId.model}
                                </p>

                                <p className="mt-1 text-xs text-black/40">
                                  {inquiry.carId.year}
                                </p>
                              </div>
                            </Link>
                          ) : (
                            <span className="text-sm text-black/40">
                              General inquiry
                            </span>
                          )}
                        </td>

                        {/* Message */}

                        <td className="max-w-[300px] px-6 py-5">
                          <button
                            type="button"
                            onClick={() => setSelectedInquiry(inquiry)}
                            className="text-left"
                          >
                            <p className="line-clamp-2 text-sm leading-6 text-black/55">
                              {inquiry.message}
                            </p>
                          </button>
                        </td>

                        {/* Status */}

                        <td className="px-6 py-5">
                          <StatusSelect
                            value={inquiry.status}
                            disabled={busy}
                            onChange={(value) =>
                              updateStatus(inquiry._id, value)
                            }
                          />
                        </td>

                        {/* Action */}

                        <td className="px-6 py-5 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedInquiry(inquiry)}
                            className="rounded-lg border border-black/10 px-4 py-2 text-xs font-semibold transition hover:bg-black hover:text-white"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* =================================================
                MOBILE CARDS
            ================================================== */}

            <div className="divide-y divide-black/10 md:hidden">
              {inquiries.map((inquiry) => {
                const busy = actionId === inquiry._id;

                return (
                  <article key={inquiry._id} className="p-4 sm:p-5">
                    {/* Customer */}

                    <button
                      type="button"
                      onClick={() => setSelectedInquiry(inquiry)}
                      className="block w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold sm:text-base">
                            {inquiry.customerName}
                          </p>

                          <p className="mt-1 text-xs text-black/45">
                            {inquiry.phone}
                          </p>

                          {inquiry.email && (
                            <p className="mt-1 truncate text-xs text-black/35">
                              {inquiry.email}
                            </p>
                          )}
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            inquiry.status === "New"
                              ? "bg-black text-white"
                              : "bg-black/[0.05] text-black/55"
                          }`}
                        >
                          {inquiry.status}
                        </span>
                      </div>
                    </button>

                    {/* Vehicle */}

                    {inquiry.carId ? (
                      <Link
                        href={`/cars/${inquiry.carId._id}`}
                        target="_blank"
                        className="mt-4 flex min-w-0 items-center gap-3 rounded-xl bg-black/[0.035] p-3"
                      >
                        <div className="h-14 w-18 shrink-0 overflow-hidden rounded-lg bg-black/[0.05]">
                          {inquiry.carId.images?.[0]?.url ? (
                            <img
                              src={inquiry.carId.images[0].url}
                              alt={`${inquiry.carId.make} ${inquiry.carId.model}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[8px] uppercase text-black/25">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold">
                            {inquiry.carId.make} {inquiry.carId.model}
                          </p>

                          <p className="mt-1 text-[11px] text-black/40">
                            {inquiry.carId.year}
                          </p>
                        </div>
                      </Link>
                    ) : (
                      <div className="mt-4 rounded-xl bg-black/[0.035] px-3 py-2.5 text-xs text-black/45">
                        General inquiry
                      </div>
                    )}

                    {/* Message */}

                    <button
                      type="button"
                      onClick={() => setSelectedInquiry(inquiry)}
                      className="mt-4 block w-full rounded-xl border border-black/10 bg-white p-3 text-left"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/30">
                        Message
                      </p>

                      <p className="mt-1 line-clamp-3 text-xs leading-5 text-black/60">
                        {inquiry.message}
                      </p>
                    </button>

                    {/* Bottom actions */}

                    <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                      <StatusSelect
                        value={inquiry.status}
                        disabled={busy}
                        onChange={(value) => updateStatus(inquiry._id, value)}
                        fullWidth
                      />

                      <button
                        type="button"
                        onClick={() => setSelectedInquiry(inquiry)}
                        className="h-10 rounded-xl border border-black/10 px-4 text-xs font-semibold transition hover:bg-black hover:text-white"
                      >
                        View
                      </button>
                    </div>
                  </article>
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
            onClick={() => loadInquiries(pagination.page - 1)}
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
            onClick={() => loadInquiries(pagination.page + 1)}
            className="rounded-full border border-black/10 bg-white px-3.5 py-2.5 text-xs font-medium transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-35 sm:px-5 sm:py-3 sm:text-sm"
          >
            Next
          </button>
        </div>
      )}

      {/* =====================================================
          MODAL
      ====================================================== */}

      {selectedInquiry && (
        <InquiryModal
          inquiry={selectedInquiry}
          actionId={actionId}
          onClose={() => setSelectedInquiry(null)}
          onStatusChange={(nextStatus) =>
            updateStatus(selectedInquiry._id, nextStatus)
          }
        />
      )}
    </div>
  );
}

/* =========================================================
   STATUS SELECT
========================================================= */

function StatusSelect({ value, disabled, onChange, fullWidth = false }) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className={`h-10 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-black disabled:opacity-40 ${
        fullWidth ? "w-full" : ""
      }`}
    >
      {STATUS_OPTIONS.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}

/* =========================================================
   MODAL
========================================================= */

function InquiryModal({ inquiry, actionId, onClose, onStatusChange }) {
  const busy = actionId === inquiry._id;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4"
      onMouseDown={onClose}
    >
      <div
        className="max-h-[94dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-h-[90vh] sm:max-w-2xl sm:rounded-3xl sm:p-6 md:p-8"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/35 sm:text-xs">
              Customer inquiry
            </p>

            <h2 className="mt-2 truncate text-xl font-semibold tracking-tight sm:text-2xl">
              {inquiry.customerName}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 text-sm transition hover:bg-black hover:text-white"
            aria-label="Close inquiry"
          >
            ×
          </button>
        </div>

        {/* Info */}

        <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
          <InfoBlock label="Phone" value={inquiry.phone} />

          <InfoBlock label="Email" value={inquiry.email || "Not provided"} />

          <InfoBlock label="Source" value={inquiry.source} />

          <InfoBlock label="Received" value={formatDate(inquiry.createdAt)} />
        </div>

        {/* Vehicle */}

        {inquiry.carId && (
          <div className="mt-5 rounded-2xl bg-black/[0.035] p-4 sm:mt-6 sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/35 sm:text-xs">
              Vehicle
            </p>

            <div className="mt-3 flex min-w-0 items-center justify-between gap-3 sm:mt-4 sm:gap-4">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                {inquiry.carId.images?.[0]?.url ? (
                  <img
                    src={inquiry.carId.images[0].url}
                    alt={`${inquiry.carId.make} ${inquiry.carId.model}`}
                    className="h-14 w-18 shrink-0 rounded-xl object-cover sm:h-16 sm:w-20"
                  />
                ) : (
                  <div className="h-14 w-18 shrink-0 rounded-xl bg-black/[0.05] sm:h-16 sm:w-20" />
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {inquiry.carId.make} {inquiry.carId.model}
                  </p>

                  <p className="mt-1 text-xs text-black/45">
                    {inquiry.carId.year}
                  </p>
                </div>
              </div>

              <Link
                href={`/cars/${inquiry.carId._id}`}
                target="_blank"
                className="shrink-0 rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold transition hover:bg-black hover:text-white"
              >
                View
              </Link>
            </div>
          </div>
        )}

        {/* Message */}

        <div className="mt-5 sm:mt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/35 sm:text-xs">
            Message
          </p>

          <div className="mt-3 rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
            <p className="whitespace-pre-line break-words text-sm leading-6 text-black/65 sm:leading-7">
              {inquiry.message}
            </p>
          </div>
        </div>

        {/* Status */}

        <div className="mt-5 sm:mt-6">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-black/35 sm:text-xs">
            Status
          </p>

          <StatusSelect
            value={inquiry.status}
            disabled={busy}
            onChange={onStatusChange}
            fullWidth
          />
        </div>

        {/* Actions */}

        <div className="mt-6 flex flex-col gap-2 border-t border-black/10 pt-5 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3 sm:pt-6">
          <a
            href={`tel:${inquiry.phone}`}
            className="flex h-11 items-center justify-center rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/80"
          >
            Call customer
          </a>

          {inquiry.email && (
            <a
              href={`mailto:${inquiry.email}`}
              className="flex h-11 items-center justify-center rounded-full border border-black/10 px-5 text-sm font-semibold transition hover:bg-black hover:text-white"
            >
              Email customer
            </a>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 items-center justify-center rounded-full border border-black/10 px-5 text-sm font-semibold transition hover:bg-black hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INFO BLOCK
========================================================= */

function InfoBlock({ label, value }) {
  return (
    <div className="min-w-0 rounded-xl border border-black/10 bg-white p-3.5 sm:p-4">
      <p className="text-[10px] uppercase tracking-[0.12em] text-black/35 sm:text-xs">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-medium">{value || "—"}</p>
    </div>
  );
}

/* =========================================================
   DESKTOP LOADING
========================================================= */

function LoadingRows() {
  return (
    <div className="divide-y divide-black/10">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex items-center gap-5 px-6 py-5">
          <div className="h-12 w-12 animate-pulse rounded-xl bg-black/[0.05]" />

          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 animate-pulse rounded bg-black/[0.05]" />

            <div className="h-3 w-28 animate-pulse rounded bg-black/[0.05]" />
          </div>

          <div className="h-9 w-24 animate-pulse rounded-lg bg-black/[0.05]" />
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   MOBILE LOADING
========================================================= */

function LoadingCards() {
  return (
    <div className="divide-y divide-black/10">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-black/[0.05]" />

              <div className="h-3 w-24 animate-pulse rounded bg-black/[0.05]" />
            </div>

            <div className="h-6 w-16 animate-pulse rounded-full bg-black/[0.05]" />
          </div>

          <div className="mt-4 h-16 animate-pulse rounded-xl bg-black/[0.05]" />

          <div className="mt-3 h-20 animate-pulse rounded-xl bg-black/[0.05]" />

          <div className="mt-3 h-10 animate-pulse rounded-xl bg-black/[0.05]" />
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function EmptyState() {
  return (
    <div className="px-5 py-16 text-center sm:px-6 sm:py-20">
      <h3 className="text-lg font-semibold">No inquiries found</h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-black/45">
        Customer inquiries will appear here when someone contacts the
        dealership.
      </p>
    </div>
  );
}

/* =========================================================
   DATE
========================================================= */

function formatDate(value) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";

// const STATUS_OPTIONS = [
//   "New",
//   "Contacted",
//   "In Progress",
//   "Closed",
// ];

// export default function AdminInquiriesPage() {
//   const [inquiries, setInquiries] =
//     useState([]);

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

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState("");

//   const [actionId, setActionId] =
//     useState(null);

//   const [selectedInquiry, setSelectedInquiry] =
//     useState(null);

//   async function loadInquiries(page = 1) {
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

//       params.set("page", String(page));
//       params.set("limit", "15");

//       const response = await fetch(
//         `/api/admin/inquiries?${params.toString()}`,
//         {
//           cache: "no-store",
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
//             "Failed to load inquiries"
//         );
//       }

//       setInquiries(
//         result.data.inquiries
//       );

//       setPagination(
//         result.data.pagination
//       );
//     } catch (loadError) {
//       console.error(loadError);

//       setError(
//         loadError.message ||
//           "Failed to load inquiries"
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadInquiries(1);
//   }, [status]);

//   async function handleSearch(event) {
//     event.preventDefault();

//     await loadInquiries(1);
//   }

//   async function updateStatus(
//     inquiryId,
//     nextStatus
//   ) {
//     try {
//       setActionId(inquiryId);
//       setError("");

//       const response = await fetch(
//         `/api/admin/inquiries/${inquiryId}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type":
//               "application/json",
//           },
//           body: JSON.stringify({
//             status: nextStatus,
//           }),
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
//             "Failed to update status"
//         );
//       }

//       setInquiries((current) =>
//         current.map((inquiry) =>
//           inquiry._id === inquiryId
//             ? {
//                 ...inquiry,
//                 status: nextStatus,
//               }
//             : inquiry
//         )
//       );

//       setSelectedInquiry((current) =>
//         current?._id === inquiryId
//           ? {
//               ...current,
//               status: nextStatus,
//             }
//           : current
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

//   return (
//     <div className="mx-auto max-w-7xl">
//       <div className="mb-8">
//         <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/35">
//           Customer leads
//         </p>

//         <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
//           Inquiries
//         </h1>

//         <p className="mt-2 text-sm text-black/45">
//           Manage messages from customers interested in your vehicles.
//         </p>
//       </div>

//       {error && (
//         <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       {/* Search and filter */}
//       <section className="rounded-2xl border border-black/10 bg-white p-5">
//         <form
//           onSubmit={handleSearch}
//           className="grid gap-3 md:grid-cols-[1fr_200px_auto]"
//         >
//           <input
//             type="text"
//             value={search}
//             onChange={(event) =>
//               setSearch(
//                 event.target.value
//               )
//             }
//             placeholder="Search customer, phone, email or message"
//             className="h-11 rounded-xl border border-black/15 px-4 text-sm outline-none placeholder:text-black/30 focus:border-black"
//           />

//           <select
//             value={status}
//             onChange={(event) =>
//               setStatus(
//                 event.target.value
//               )
//             }
//             className="h-11 rounded-xl border border-black/15 bg-white px-3 text-sm outline-none focus:border-black"
//           >
//             <option value="">
//               All statuses
//             </option>

//             {STATUS_OPTIONS.map(
//               (option) => (
//                 <option
//                   key={option}
//                   value={option}
//                 >
//                   {option}
//                 </option>
//               )
//             )}
//           </select>

//           <button
//             type="submit"
//             className="h-11 rounded-xl bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/80"
//           >
//             Search
//           </button>
//         </form>
//       </section>

//       {/* Inquiry list */}
//       <section className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white">
//         <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
//           <div>
//             <h2 className="font-semibold">
//               Customer inquiries
//             </h2>

//             <p className="mt-1 text-xs text-black/40">
//               {pagination.total}{" "}
//               {pagination.total === 1
//                 ? "inquiry"
//                 : "inquiries"}
//             </p>
//           </div>
//         </div>

//         {loading ? (
//           <LoadingRows />
//         ) : inquiries.length === 0 ? (
//           <EmptyState />
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[1000px] border-collapse">
//               <thead>
//                 <tr className="border-b border-black/10 text-left">
//                   <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
//                     Customer
//                   </th>

//                   <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
//                     Vehicle
//                   </th>

//                   <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
//                     Message
//                   </th>

//                   <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
//                     Status
//                   </th>

//                   <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
//                     Action
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {inquiries.map(
//                   (inquiry) => {
//                     const busy =
//                       actionId ===
//                       inquiry._id;

//                     return (
//                       <tr
//                         key={
//                           inquiry._id
//                         }
//                         className="border-b border-black/10 last:border-0"
//                       >
//                         <td className="px-6 py-5">
//                           <button
//                             type="button"
//                             onClick={() =>
//                               setSelectedInquiry(
//                                 inquiry
//                               )
//                             }
//                             className="text-left"
//                           >
//                             <p className="font-semibold transition hover:text-black/55">
//                               {
//                                 inquiry.customerName
//                               }
//                             </p>

//                             <p className="mt-1 text-xs text-black/45">
//                               {
//                                 inquiry.phone
//                               }
//                             </p>

//                             {inquiry.email && (
//                               <p className="mt-1 max-w-[220px] truncate text-xs text-black/35">
//                                 {
//                                   inquiry.email
//                                 }
//                               </p>
//                             )}
//                           </button>
//                         </td>

//                         <td className="px-6 py-5">
//                           {inquiry.carId ? (
//                             <Link
//                               href={`/cars/${inquiry.carId._id}`}
//                               target="_blank"
//                               className="group flex items-center gap-3"
//                             >
//                               <div className="h-12 w-14 shrink-0 overflow-hidden rounded-lg bg-black/[0.05]">
//                                 {inquiry
//                                   .carId
//                                   .images?.[0]
//                                   ?.url && (
//                                   <img
//                                     src={
//                                       inquiry
//                                         .carId
//                                         .images[0]
//                                         .url
//                                     }
//                                     alt={`${inquiry.carId.make} ${inquiry.carId.model}`}
//                                     className="h-full w-full object-cover"
//                                   />
//                                 )}
//                               </div>

//                               <div>
//                                 <p className="text-sm font-semibold group-hover:underline">
//                                   {
//                                     inquiry
//                                       .carId
//                                       .make
//                                   }{" "}
//                                   {
//                                     inquiry
//                                       .carId
//                                       .model
//                                   }
//                                 </p>

//                                 <p className="mt-1 text-xs text-black/40">
//                                   {
//                                     inquiry
//                                       .carId
//                                       .year
//                                   }
//                                 </p>
//                               </div>
//                             </Link>
//                           ) : (
//                             <span className="text-sm text-black/40">
//                               General inquiry
//                             </span>
//                           )}
//                         </td>

//                         <td className="max-w-[300px] px-6 py-5">
//                           <button
//                             type="button"
//                             onClick={() =>
//                               setSelectedInquiry(
//                                 inquiry
//                               )
//                             }
//                             className="text-left"
//                           >
//                             <p className="line-clamp-2 text-sm leading-6 text-black/55">
//                               {
//                                 inquiry.message
//                               }
//                             </p>
//                           </button>
//                         </td>

//                         <td className="px-6 py-5">
//                           <StatusSelect
//                             value={
//                               inquiry.status
//                             }
//                             disabled={busy}
//                             onChange={(
//                               value
//                             ) =>
//                               updateStatus(
//                                 inquiry._id,
//                                 value
//                               )
//                             }
//                           />
//                         </td>

//                         <td className="px-6 py-5 text-right">
//                           <button
//                             type="button"
//                             onClick={() =>
//                               setSelectedInquiry(
//                                 inquiry
//                               )
//                             }
//                             className="rounded-lg border border-black/10 px-4 py-2 text-xs font-semibold transition hover:bg-black hover:text-white"
//                           >
//                             View
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   }
//                 )}
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
//                 loadInquiries(
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
//                 loadInquiries(
//                   pagination.page + 1
//                 )
//               }
//               className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-35"
//             >
//               Next
//             </button>
//           </div>
//         )}

//       {selectedInquiry && (
//         <InquiryModal
//           inquiry={selectedInquiry}
//           actionId={actionId}
//           onClose={() =>
//             setSelectedInquiry(null)
//           }
//           onStatusChange={(
//             nextStatus
//           ) =>
//             updateStatus(
//               selectedInquiry._id,
//               nextStatus
//             )
//           }
//         />
//       )}
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
//       {STATUS_OPTIONS.map(
//         (status) => (
//           <option
//             key={status}
//             value={status}
//           >
//             {status}
//           </option>
//         )
//       )}
//     </select>
//   );
// }

// function InquiryModal({
//   inquiry,
//   actionId,
//   onClose,
//   onStatusChange,
// }) {
//   const busy =
//     actionId === inquiry._id;

//   return (
//     <div
//       className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-5"
//       onMouseDown={onClose}
//     >
//       <div
//         className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl md:p-8"
//         onMouseDown={(event) =>
//           event.stopPropagation()
//         }
//       >
//         <div className="flex items-start justify-between gap-5">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/35">
//               Customer inquiry
//             </p>

//             <h2 className="mt-2 text-2xl font-semibold tracking-tight">
//               {inquiry.customerName}
//             </h2>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-sm transition hover:bg-black hover:text-white"
//           >
//             ×
//           </button>
//         </div>

//         <div className="mt-8 grid gap-4 sm:grid-cols-2">
//           <InfoBlock
//             label="Phone"
//             value={inquiry.phone}
//           />

//           <InfoBlock
//             label="Email"
//             value={
//               inquiry.email || "Not provided"
//             }
//           />

//           <InfoBlock
//             label="Source"
//             value={inquiry.source}
//           />

//           <InfoBlock
//             label="Received"
//             value={formatDate(
//               inquiry.createdAt
//             )}
//           />
//         </div>

//         {inquiry.carId && (
//           <div className="mt-6 rounded-2xl bg-black/[0.035] p-5">
//             <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/35">
//               Vehicle
//             </p>

//             <div className="mt-4 flex items-center justify-between gap-4">
//               <div className="flex items-center gap-4">
//                 {inquiry.carId
//                   .images?.[0]?.url ? (
//                   <img
//                     src={
//                       inquiry.carId
//                         .images[0].url
//                     }
//                     alt={`${inquiry.carId.make} ${inquiry.carId.model}`}
//                     className="h-16 w-20 rounded-xl object-cover"
//                   />
//                 ) : (
//                   <div className="h-16 w-20 rounded-xl bg-black/[0.05]" />
//                 )}

//                 <div>
//                   <p className="font-semibold">
//                     {inquiry.carId.make}{" "}
//                     {inquiry.carId.model}
//                   </p>

//                   <p className="mt-1 text-sm text-black/45">
//                     {inquiry.carId.year}
//                   </p>
//                 </div>
//               </div>

//               <Link
//                 href={`/cars/${inquiry.carId._id}`}
//                 target="_blank"
//                 className="rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold transition hover:bg-black hover:text-white"
//               >
//                 View
//               </Link>
//             </div>
//           </div>
//         )}

//         <div className="mt-6">
//           <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/35">
//             Message
//           </p>

//           <div className="mt-3 rounded-2xl border border-black/10 bg-white p-5">
//             <p className="whitespace-pre-line text-sm leading-7 text-black/65">
//               {inquiry.message}
//             </p>
//           </div>
//         </div>

//         <div className="mt-6">
//           <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-black/35">
//             Status
//           </p>

//           <StatusSelect
//             value={inquiry.status}
//             disabled={busy}
//             onChange={onStatusChange}
//           />
//         </div>

//         <div className="mt-8 flex flex-wrap gap-3 border-t border-black/10 pt-6">
//           <a
//             href={`tel:${inquiry.phone}`}
//             className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/80"
//           >
//             Call customer
//           </a>

//           {inquiry.email && (
//             <a
//               href={`mailto:${inquiry.email}`}
//               className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold transition hover:bg-black hover:text-white"
//             >
//               Email customer
//             </a>
//           )}

//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function InfoBlock({
//   label,
//   value,
// }) {
//   return (
//     <div className="rounded-xl border border-black/10 bg-white p-4">
//       <p className="text-xs uppercase tracking-[0.12em] text-black/35">
//         {label}
//       </p>

//       <p className="mt-2 break-words text-sm font-medium">
//         {value}
//       </p>
//     </div>
//   );
// }

// function LoadingRows() {
//   return (
//     <div className="divide-y divide-black/10">
//       {Array.from({ length: 6 }).map(
//         (_, index) => (
//           <div
//             key={index}
//             className="flex items-center gap-5 px-6 py-5"
//           >
//             <div className="h-12 w-12 animate-pulse rounded-xl bg-black/[0.05]" />

//             <div className="flex-1 space-y-2">
//               <div className="h-4 w-40 animate-pulse rounded bg-black/[0.05]" />

//               <div className="h-3 w-28 animate-pulse rounded bg-black/[0.05]" />
//             </div>

//             <div className="h-9 w-24 animate-pulse rounded-lg bg-black/[0.05]" />
//           </div>
//         )
//       )}
//     </div>
//   );
// }

// function EmptyState() {
//   return (
//     <div className="px-6 py-20 text-center">
//       <h3 className="text-lg font-semibold">
//         No inquiries found
//       </h3>

//       <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-black/45">
//         Customer inquiries will appear here when someone contacts the dealership.
//       </p>
//     </div>
//   );
// }

// function formatDate(value) {
//   if (!value) {
//     return "—";
//   }

//   return new Intl.DateTimeFormat(
//     "en-US",
//     {
//       dateStyle: "medium",
//       timeStyle: "short",
//     }
//   ).format(new Date(value));
// }
