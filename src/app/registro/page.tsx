"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordChecks = [
    { label: "Mínimo 8 caracteres", valid: form.password.length >= 8 },
    { label: "Una mayúscula", valid: /[A-Z]/.test(form.password) },
    { label: "Un número", valid: /[0-9]/.test(form.password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!passwordChecks.every((c) => c.valid)) {
      setError("La contraseña no cumple los requisitos.");
      return;
    }

    setLoading(true);
    // TODO: Integrate with API route
    setTimeout(() => {
      setLoading(false);
      setError("Funcionalidad en desarrollo.");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Image src="/logo.jpg" alt="Ryoku" width={40} height={40} className="rounded-full" />
          </Link>
          <h1 className="text-2xl font-bold">Crear cuenta</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Únete a la comunidad Ryoku
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono tracking-[0.15em] uppercase text-[var(--text-muted)] mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Tu nombre"
              className="w-full px-4 py-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand)] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono tracking-[0.15em] uppercase text-[var(--text-muted)] mb-2">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="tu@email.com"
              className="w-full px-4 py-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand)] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono tracking-[0.15em] uppercase text-[var(--text-muted)] mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand)] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Password strength */}
            {form.password && (
              <div className="mt-2 space-y-1">
                {passwordChecks.map((check) => (
                  <div key={check.label} className="flex items-center gap-2">
                    <Check className={`w-3 h-3 ${check.valid ? "text-[var(--brand)]" : "text-[var(--text-muted)]"}`} />
                    <span className={`text-[10px] ${check.valid ? "text-[var(--brand)]" : "text-[var(--text-muted)]"}`}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono tracking-[0.15em] uppercase text-[var(--text-muted)] mb-2">
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand)] transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--brand)] text-black font-semibold text-sm rounded-lg hover:bg-[var(--brand-hover)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-[var(--brand)] font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
