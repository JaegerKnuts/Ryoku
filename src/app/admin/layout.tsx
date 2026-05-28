"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  FileText,
  ShoppingCart,
  Users,
  Tag,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/descuentos", label: "Descuentos", icon: Tag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-[var(--surface)]">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--bg)] border-r border-[var(--border)] flex flex-col">
        <div className="p-6 border-b border-[var(--border)]">
          <h1
            className="text-2xl uppercase tracking-tight"
            style={{ fontFamily: "var(--font-bebas), Impact, sans-serif" }}
          >
            Ryoku <span style={{ color: "var(--brand)" }}>Admin</span>
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--brand)] text-white"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--border)]">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--brand)] transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
