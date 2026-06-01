"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email o contraseña incorrectos.");
    } else {
      router.push("/admin");
      router.refresh();
    }
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
          <h1 className="text-2xl font-bold">Iniciar sesión</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Accede a tu cuenta Ryoku
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono tracking-[0.15em] uppercase text-[var(--text-muted)] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--brand)] text-black font-semibold text-sm rounded-lg hover:bg-[var(--brand-hover)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Entrar"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-6 text-center space-y-3">
          <Link href="/recuperar-contrasena" className="text-xs text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors">
            ¿Olvidaste tu contraseña?
          </Link>
          <p className="text-sm text-[var(--text-secondary)]">
            ¿No tienes cuenta?{" "}
            <Link href="/registro" className="text-[var(--brand)] font-medium hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
