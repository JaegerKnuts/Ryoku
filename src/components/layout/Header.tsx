"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ShoppingBag, Menu, X, Search, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "Nosotros" },
];

export function Header() {
  const { data: session } = useSession();
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "glass py-3 shadow-sm"
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/logo.jpg"
                alt="Ryoku"
                width={36}
                height={36}
                className="rounded-full"
              />
            </motion.div>
            <span className="text-xl font-bold tracking-[0.15em] uppercase">
              RYOKU
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="link-underline text-sm font-medium tracking-wide uppercase text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              aria-label="Buscar"
              className="hidden md:flex w-9 h-9 items-center justify-center rounded-full hover:bg-[var(--surface)] transition-colors"
            >
              <Search className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
            {session ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/admin"
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--surface)] transition-colors"
                  title="Admin"
                >
                  <User className="w-4 h-4 text-[var(--brand)]" />
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--surface)] transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4 text-[var(--text-secondary)]" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex w-9 h-9 items-center justify-center rounded-full hover:bg-[var(--surface)] transition-colors"
              >
                <User className="w-4 h-4 text-[var(--text-secondary)]" />
              </Link>
            )}
            <Link
              href="/carrito"
              className="relative flex w-9 h-9 items-center justify-center rounded-full hover:bg-[var(--surface)] transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-[var(--text-secondary)]" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--brand)] rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {count > 99 ? "99" : count}
                </span>
              )}
            </Link>

            {/* Mobile toggle */}
            <button
              aria-label="Abrir menú"
              className="md:hidden w-9 h-9 flex items-center justify-center"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[var(--bg)]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-4xl font-bold tracking-wide uppercase hover:text-[var(--brand)] transition-colors"
                  style={{ fontFamily: 'var(--font-bebas), Impact, sans-serif' }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-6 mt-8"
            >
              <Link href={session ? "/admin" : "/login"} onClick={() => setMobileOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text)]">
                <User className="w-6 h-6" />
              </Link>
              <Link href="/carrito" onClick={() => setMobileOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text)]">
                <ShoppingBag className="w-6 h-6" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
