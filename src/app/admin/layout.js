import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";
export default function AdminLayout({
  children,
}) {
  return (
    <div className="min-h-screen bg-[#f5f5f3] text-black">
      <AdminSidebar />

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-black/10 bg-white/90 px-5 backdrop-blur md:px-8">
          <div>
            <p className="text-sm font-semibold">
              Dealership Management
            </p>

            <p className="text-xs text-black/40">
              Admin Panel
            </p>
          </div>

          <Link
            href="/"
            className="rounded-full border border-black/10 px-4 py-2.5 text-sm font-medium transition hover:bg-black hover:text-white"
          >
            Website
          </Link>
        </header>

        <main className="p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}