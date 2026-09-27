"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
export default function AdminDashboardPage() {
 

  const [data, setData] = useState(null);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/admin/dashboard",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load dashboard"
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message ||
              "Failed to load dashboard"
          );
        }

        setData(result.data);
      } catch (dashboardError) {
        console.error(
          dashboardError
        );

        setError(
          "We couldn't load the dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const stats = data?.stats;

  return (
    <div className="mx-auto max-w-7xl md:pb-0 pb-20">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/35">
          Overview
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-black/45">
          Manage your dealership website and inventory.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Main Stats */}
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Cars"
          value={
            loading ? "—" : stats?.totalCars ?? 0
          }
          href="/admin/cars"
        />

        <StatCard
          title="Available"
          value={
            loading
              ? "—"
              : stats?.availableCars ?? 0
          }
          href="/admin/cars?status=Available"
        />

        <StatCard
          title="Sold"
          value={
            loading ? "—" : stats?.soldCars ?? 0
          }
          href="/admin/cars?status=Sold"
        />

        <StatCard
          title="New Inquiries"
          value={
            loading
              ? "—"
              : stats?.newInquiries ?? 0
          }
          href="/admin/inquiries?status=New"
        />
      </div>

      {/* Secondary Stats */}
      <div className="mt-4 grid gap-4 grid-cols-2 xl:grid-cols-4">
        <MiniStat
          title="Reserved Cars"
          value={
            loading
              ? "—"
              : stats?.reservedCars ?? 0
          }
        />

        <MiniStat
          title="Total Inquiries"
          value={
            loading
              ? "—"
              : stats?.totalInquiries ?? 0
          }
        />

        <MiniStat
          title="Pending Test Drives"
          value={
            loading
              ? "—"
              : stats?.pendingTestDrives ?? 0
          }
        />

        <MiniStat
          title="Confirmed Test Drives"
          value={
            loading
              ? "—"
              : stats?.confirmedTestDrives ?? 0
          }
        />
      </div>

      {/* Quick Actions */}
      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            Quick actions
          </h2>
        </div>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <QuickAction
            href="/admin/cars/new"
            title="Add Car"
            description="Add a new vehicle to your inventory."
          />

          <QuickAction
            href="/admin/inquiries"
            title="View Inquiries"
            description="See customers interested in your vehicles."
          />

          <QuickAction
            href="/admin/test-drives"
            title="Test Drives"
            description="Manage upcoming test-drive requests."
          />

          <QuickAction
            href="/admin/businesses"
            title="Business Profile"
            description="Update dealership information."
          />
        </div>
      </section>

      {/* Recent Content */}
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <RecentCars
          cars={data?.recentCars || []}
          loading={loading}
        />

        <RecentInquiries
          inquiries={
            data?.recentInquiries || []
          }
          loading={loading}
        />
      </div>

      <div className="mt-6">
        <RecentTestDrives
          testDrives={
            data?.recentTestDrives || []
          }
          loading={loading}
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  href,
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-black/10 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-sm"
    >
      <p className="text-sm text-black/45">
        {title}
      </p>

      <p className="mt-3 text-3xl font-semibold tracking-tight">
        {value}
      </p>

      <p className="mt-4 text-xs font-medium text-black/35">
        View details →
      </p>
    </Link>
  );
}

function MiniStat({
  title,
  value,
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <p className="text-xs uppercase tracking-[0.12em] text-black/35">
        {title}
      </p>

      <p className="mt-2 text-xl font-semibold">
        {value}
      </p>
    </div>
  );
}

function QuickAction({
  href,
  title,
  description,
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-black/10 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-sm"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-sm font-semibold text-white">
        +
      </div>

      <h3 className="mt-5 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-black/45">
        {description}
      </p>
    </Link>
  );
}

function RecentCars({
  cars,
  loading,
}) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white">
      <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
        <div>
          <h2 className="font-semibold">
            Recent Cars
          </h2>

          <p className="mt-1 text-xs text-black/40">
            Recently added vehicles
          </p>
        </div>

        <Link
          href="/admin/cars"
          className="text-xs font-semibold underline underline-offset-4"
        >
          View all
        </Link>
      </div>

      <div className="divide-y divide-black/10">
        {loading ? (
          <LoadingRows />
        ) : cars.length > 0 ? (
          cars.map((car) => (
            <div
              key={car._id}
              className="flex items-center gap-4 px-6 py-4"
            >
              <div className="h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-black/[0.05]">
                {car.images?.[0]?.url && (
                  <img
                    src={car.images[0].url}
                    alt={`${car.make} ${car.model}`}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {car.make} {car.model}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {car.year} ·{" "}
                  {car.currency}{" "}
                  {formatNumber(car.price)}
                </p>
              </div>

              <StatusBadge
                status={car.status}
              />
            </div>
          ))
        ) : (
          <EmptyRow text="No cars added yet." />
        )}
      </div>
    </section>
  );
}

function RecentInquiries({
  inquiries,
  loading,
}) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white">
      <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
        <div>
          <h2 className="font-semibold">
            Recent Inquiries
          </h2>

          <p className="mt-1 text-xs text-black/40">
            Latest customer messages
          </p>
        </div>

        <Link
          href="/admin/inquiries"
          className="text-xs font-semibold underline underline-offset-4"
        >
          View all
        </Link>
      </div>

      <div className="divide-y divide-black/10">
        {loading ? (
          <LoadingRows />
        ) : inquiries.length > 0 ? (
          inquiries.map((inquiry) => (
            <div
              key={inquiry._id}
              className="px-6 py-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {inquiry.customerName}
                  </p>

                  <p className="mt-1 text-xs text-black/40">
                    {inquiry.phone}
                  </p>

                  {inquiry.carId && (
                    <p className="mt-2 truncate text-xs text-black/55">
                      Interested in{" "}
                      <span className="font-medium">
                        {inquiry.carId.make}{" "}
                        {inquiry.carId.model}
                      </span>
                    </p>
                  )}
                </div>

                <StatusBadge
                  status={inquiry.status}
                />
              </div>
            </div>
          ))
        ) : (
          <EmptyRow text="No inquiries yet." />
        )}
      </div>
    </section>
  );
}

function RecentTestDrives({
  testDrives,
  loading,
}) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white">
      <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
        <div>
          <h2 className="font-semibold">
            Recent Test Drives
          </h2>

          <p className="mt-1 text-xs text-black/40">
            Latest test-drive requests
          </p>
        </div>

        <Link
          href="/admin/test-drives"
          className="text-xs font-semibold underline underline-offset-4"
        >
          View all
        </Link>
      </div>

      <div className="divide-y divide-black/10">
        {loading ? (
          <LoadingRows />
        ) : testDrives.length > 0 ? (
          testDrives.map((testDrive) => (
            <div
              key={testDrive._id}
              className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold">
                  {testDrive.customerName}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {testDrive.phone}
                </p>

                {testDrive.carId && (
                  <p className="mt-2 text-xs text-black/55">
                    {testDrive.carId.make}{" "}
                    {testDrive.carId.model} ·{" "}
                    {testDrive.date} ·{" "}
                    {testDrive.time}
                  </p>
                )}
              </div>

              <StatusBadge
                status={testDrive.status}
              />
            </div>
          ))
        ) : (
          <EmptyRow text="No test-drive requests yet." />
        )}
      </div>
    </section>
  );
}

function StatusBadge({
  status,
}) {
  return (
    <span className="shrink-0 rounded-full bg-black/[0.05] px-3 py-1.5 text-[11px] font-semibold text-black/60">
      {status}
    </span>
  );
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 4 }).map(
        (_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-6 py-5"
          >
            <div className="h-12 w-16 animate-pulse rounded-xl bg-black/[0.05]" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 animate-pulse rounded bg-black/[0.05]" />
              <div className="h-3 w-24 animate-pulse rounded bg-black/[0.05]" />
            </div>
          </div>
        )
      )}
    </>
  );
}

function EmptyRow({ text }) {
  return (
    <div className="px-6 py-10 text-center text-sm text-black/40">
      {text}
    </div>
  );
}

function formatNumber(value) {
  return new Intl.NumberFormat(
    "en-US",
    {
      maximumFractionDigits: 0,
    }
  ).format(value || 0);
}