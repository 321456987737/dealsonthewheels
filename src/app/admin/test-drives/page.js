"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STATUS_OPTIONS = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

export default function AdminTestDrivesPage() {
  const [testDrives, setTestDrives] =
    useState([]);

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 15,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [date, setDate] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actionId, setActionId] =
    useState(null);

  const [selectedTestDrive, setSelectedTestDrive] =
    useState(null);

  async function loadTestDrives(page = 1) {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set(
          "search",
          search.trim()
        );
      }

      if (status) {
        params.set("status", status);
      }

      if (date) {
        params.set("date", date);
      }

      params.set("page", String(page));
      params.set("limit", "15");

      const response = await fetch(
        `/api/admin/test-drives?${params.toString()}`,
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
            "Failed to load test drives"
        );
      }

      setTestDrives(
        result.data.testDrives
      );

      setPagination(
        result.data.pagination
      );
    } catch (loadError) {
      console.error(loadError);

      setError(
        loadError.message ||
          "Failed to load test drives"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTestDrives(1);
  }, [status, date]);

  async function handleSearch(event) {
    event.preventDefault();

    await loadTestDrives(1);
  }

  async function updateStatus(
    testDriveId,
    nextStatus
  ) {
    try {
      setActionId(testDriveId);
      setError("");

      const response = await fetch(
        `/api/admin/test-drives/${testDriveId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
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
            "Failed to update status"
        );
      }

      setTestDrives((current) =>
        current.map((testDrive) =>
          testDrive._id === testDriveId
            ? {
                ...testDrive,
                status: nextStatus,
              }
            : testDrive
        )
      );

      setSelectedTestDrive(
        (current) =>
          current?._id === testDriveId
            ? {
                ...current,
                status: nextStatus,
              }
            : current
      );
    } catch (updateError) {
      console.error(updateError);

      setError(
        updateError.message ||
          "Failed to update status"
      );
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/35">
          Appointments
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Test Drives
        </h1>

        <p className="mt-2 text-sm text-black/45">
          Manage customer test-drive requests and appointments.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <form
          onSubmit={handleSearch}
          className="grid gap-3 md:grid-cols-[1fr_190px_190px_auto]"
        >
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search customer, phone or email"
            className="h-11 rounded-xl border border-black/15 px-4 text-sm outline-none placeholder:text-black/30 focus:border-black"
          />

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value
              )
            }
            className="h-11 rounded-xl border border-black/15 bg-white px-3 text-sm outline-none focus:border-black"
          >
            <option value="">
              All statuses
            </option>

            {STATUS_OPTIONS.map(
              (option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              )
            )}
          </select>

          <input
            type="date"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
            }
            className="h-11 rounded-xl border border-black/15 bg-white px-3 text-sm outline-none focus:border-black"
          />

          <button
            type="submit"
            className="h-11 rounded-xl bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/80"
          >
            Search
          </button>
        </form>
      </section>

      {/* List */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white">
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <div>
            <h2 className="font-semibold">
              Test-drive requests
            </h2>

            <p className="mt-1 text-xs text-black/40">
              {pagination.total}{" "}
              {pagination.total === 1
                ? "request"
                : "requests"}
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingRows />
        ) : testDrives.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse">
              <thead>
                <tr className="border-b border-black/10 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
                    Vehicle
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
                    Appointment
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
                {testDrives.map(
                  (testDrive) => {
                    const busy =
                      actionId ===
                      testDrive._id;

                    return (
                      <tr
                        key={
                          testDrive._id
                        }
                        className="border-b border-black/10 last:border-0"
                      >
                        <td className="px-6 py-5">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedTestDrive(
                                testDrive
                              )
                            }
                            className="text-left"
                          >
                            <p className="font-semibold transition hover:text-black/55">
                              {
                                testDrive.customerName
                              }
                            </p>

                            <p className="mt-1 text-xs text-black/45">
                              {
                                testDrive.phone
                              }
                            </p>

                            {testDrive.email && (
                              <p className="mt-1 max-w-[220px] truncate text-xs text-black/35">
                                {
                                  testDrive.email
                                }
                              </p>
                            )}
                          </button>
                        </td>

                        <td className="px-6 py-5">
                          {testDrive.carId ? (
                            <Link
                              href={`/cars/${testDrive.carId._id}`}
                              target="_blank"
                              className="flex items-center gap-3"
                            >
                              <div className="h-12 w-14 shrink-0 overflow-hidden rounded-lg bg-black/[0.05]">
                                {testDrive
                                  .carId
                                  .images?.[0]
                                  ?.url && (
                                  <img
                                    src={
                                      testDrive
                                        .carId
                                        .images[0]
                                        .url
                                    }
                                    alt={`${testDrive.carId.make} ${testDrive.carId.model}`}
                                    className="h-full w-full object-cover"
                                  />
                                )}
                              </div>

                              <div>
                                <p className="text-sm font-semibold hover:underline">
                                  {
                                    testDrive
                                      .carId
                                      .make
                                  }{" "}
                                  {
                                    testDrive
                                      .carId
                                      .model
                                  }
                                </p>

                                <p className="mt-1 text-xs text-black/40">
                                  {
                                    testDrive
                                      .carId
                                      .year
                                  }
                                </p>
                              </div>
                            </Link>
                          ) : (
                            <span className="text-sm text-black/40">
                              Vehicle unavailable
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm font-semibold">
                            {formatDateOnly(
                              testDrive.date
                            )}
                          </p>

                          <p className="mt-1 text-xs text-black/45">
                            {formatTime(
                              testDrive.time
                            )}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <StatusSelect
                            value={
                              testDrive.status
                            }
                            disabled={busy}
                            onChange={(
                              value
                            ) =>
                              updateStatus(
                                testDrive._id,
                                value
                              )
                            }
                          />
                        </td>

                        <td className="px-6 py-5 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedTestDrive(
                                testDrive
                              )
                            }
                            className="rounded-lg border border-black/10 px-4 py-2 text-xs font-semibold transition hover:bg-black hover:text-white"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Pagination */}
      {!loading &&
        pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={
                !pagination.hasPreviousPage
              }
              onClick={() =>
                loadTestDrives(
                  pagination.page - 1
                )
              }
              className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-35"
            >
              Previous
            </button>

            <div className="rounded-full bg-black px-4 py-3 text-sm font-semibold text-white">
              {pagination.page} /{" "}
              {pagination.totalPages}
            </div>

            <button
              type="button"
              disabled={
                !pagination.hasNextPage
              }
              onClick={() =>
                loadTestDrives(
                  pagination.page + 1
                )
              }
              className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-35"
            >
              Next
            </button>
          </div>
        )}

      {selectedTestDrive && (
        <TestDriveModal
          testDrive={selectedTestDrive}
          actionId={actionId}
          onClose={() =>
            setSelectedTestDrive(null)
          }
          onStatusChange={(
            nextStatus
          ) =>
            updateStatus(
              selectedTestDrive._id,
              nextStatus
            )
          }
        />
      )}
    </div>
  );
}

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
      className="rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-black disabled:opacity-40"
    >
      {STATUS_OPTIONS.map(
        (status) => (
          <option
            key={status}
            value={status}
          >
            {status}
          </option>
        )
      )}
    </select>
  );
}

function TestDriveModal({
  testDrive,
  actionId,
  onClose,
  onStatusChange,
}) {
  const busy =
    actionId === testDrive._id;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-5"
      onMouseDown={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl md:p-8"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/35">
              Test-drive request
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              {testDrive.customerName}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-sm transition hover:bg-black hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <InfoBlock
            label="Phone"
            value={testDrive.phone}
          />

          <InfoBlock
            label="Email"
            value={
              testDrive.email ||
              "Not provided"
            }
          />

          <InfoBlock
            label="Date"
            value={formatDateOnly(
              testDrive.date
            )}
          />

          <InfoBlock
            label="Time"
            value={formatTime(
              testDrive.time
            )}
          />
        </div>

        {testDrive.carId && (
          <div className="mt-6 rounded-2xl bg-black/[0.035] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/35">
              Vehicle
            </p>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {testDrive.carId
                  .images?.[0]?.url ? (
                  <img
                    src={
                      testDrive.carId
                        .images[0].url
                    }
                    alt={`${testDrive.carId.make} ${testDrive.carId.model}`}
                    className="h-16 w-20 rounded-xl object-cover"
                  />
                ) : (
                  <div className="h-16 w-20 rounded-xl bg-black/[0.05]" />
                )}

                <div>
                  <p className="font-semibold">
                    {testDrive.carId.make}{" "}
                    {testDrive.carId.model}
                  </p>

                  <p className="mt-1 text-sm text-black/45">
                    {testDrive.carId.year}
                  </p>
                </div>
              </div>

              <Link
                href={`/cars/${testDrive.carId._id}`}
                target="_blank"
                className="rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold transition hover:bg-black hover:text-white"
              >
                View
              </Link>
            </div>
          </div>
        )}

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/35">
            Customer message
          </p>

          <div className="mt-3 rounded-2xl border border-black/10 p-5">
            <p className="whitespace-pre-line text-sm leading-7 text-black/60">
              {testDrive.message ||
                "No additional message."}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-black/35">
            Status
          </p>

          <StatusSelect
            value={testDrive.status}
            disabled={busy}
            onChange={onStatusChange}
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-black/10 pt-6">
          <a
            href={`tel:${testDrive.phone}`}
            className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/80"
          >
            Call customer
          </a>

          {testDrive.email && (
            <a
              href={`mailto:${testDrive.email}`}
              className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold transition hover:bg-black hover:text-white"
            >
              Email customer
            </a>
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-black/10 p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-black/35">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-medium">
        {value}
      </p>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="divide-y divide-black/10">
      {Array.from({ length: 6 }).map(
        (_, index) => (
          <div
            key={index}
            className="flex items-center gap-5 px-6 py-5"
          >
            <div className="h-12 w-12 animate-pulse rounded-xl bg-black/[0.05]" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 animate-pulse rounded bg-black/[0.05]" />

              <div className="h-3 w-28 animate-pulse rounded bg-black/[0.05]" />
            </div>

            <div className="h-9 w-24 animate-pulse rounded-lg bg-black/[0.05]" />
          </div>
        )
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-20 text-center">
      <h3 className="text-lg font-semibold">
        No test-drive requests found
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-black/45">
        Customer test-drive requests will appear here when they submit the form.
      </p>
    </div>
  );
}

function formatDateOnly(value) {
  if (!value) {
    return "—";
  }

  const [year, month, day] =
    value.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  ).format(
    new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    )
  );
}

function formatTime(value) {
  if (!value) {
    return "—";
  }

  const [hour, minute] =
    value.split(":");

  const numericHour = Number(hour);

  if (
    !Number.isInteger(numericHour) ||
    !minute
  ) {
    return value;
  }

  const period =
    numericHour >= 12
      ? "PM"
      : "AM";

  const displayHour =
    numericHour % 12 || 12;

  return `${displayHour}:${minute} ${period}`;
}