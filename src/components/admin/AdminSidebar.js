import Link from "next/link";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin",
  },
  // {
  //   label: "Businesses",
  //   href: "/admin/businesses",
  // },
  // {
  //   label: "Users",
  //   href: "/admin/users",
  // },
  {
    label: "Cars",
    href: "/admin/cars",
  },
  {
    label: "Inquiries",
    href: "/admin/inquiries",
  },
  {
    label: "Test Drives",
    href: "/admin/test-drives",
  },
  {
    label: "Settings",
    href: "/admin/settings",
  },
];

export default function AdminSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-black/10 bg-white lg:flex lg:flex-col">
      <div className="flex h-20 items-center border-b border-black/10 px-6">
        <Link
          href="/admin"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
            A
          </div>

          <div>
            <p className="text-sm font-semibold tracking-tight">
              Admin Panel
            </p>

            <p className="text-xs text-black/40">
              Car Dealership
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
          Management
        </p>

        <div className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex h-11 items-center rounded-xl px-3 text-sm font-medium text-black/60 transition hover:bg-black/[0.04] hover:text-black"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="border-t border-black/10 p-4">
        <Link
          href="/"
          className="flex h-11 items-center rounded-xl px-3 text-sm font-medium text-black/50 transition hover:bg-black/[0.04] hover:text-black"
        >
          View Website
        </Link>
      </div>
    </aside>
  );
}