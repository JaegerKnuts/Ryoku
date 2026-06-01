"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Lock, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react";

function ResetContrasenaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Token no válido o expirado");
      setValidating(false);
      return;
    }

    // Validate token
    fetch(`/api/auth/verificar-token?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setTokenValid(true);
        } else {
          setError("El enlace ha expirado o no es válido");
        }
        setValidating(false);
      })
      .catch(() => {
        setError("Error al validar el token");
        setValidating(false);
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-contrasena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.error || "Error al restablecer contraseña");
      }
    } catch (err) {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand)] mx-auto" />
        <p className="text-sm text-[var(--text-muted)] mt-4">Validando enlace...</p>
      </div>
    );
  }

  if (!tokenValid && error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Link
          href="/recuperar-contrasena"
          className="inline-block px-6 py-2 bg-[var(--brand)] text-black font-semibold text-sm rounded-full hover:opacity-90 transition-opacity"
        >
          Solicitar nuevo enlace
        </Link>
      </div>
    );
  }

  return (
    <>
      {success ? (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">¡Contraseña actualizada!</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Tu contraseña ha sido restablecida correctamente. Serás redirigido al login...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-2">
              Nueva contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-10 pr-12 py-3 border border-[var(--border)] rounded-lg bg-[var(--surface)] text-sm focus:outline-none focus:border-[var(--brand)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-2">
              Confirmar contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repite la contraseña"
                className="w-full pl-10 pr-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--surface)] text-sm focus:outline-none focus:border-[var(--brand)]"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim() || !confirmPassword.trim()}
            className="w-full py-3 bg-[var(--brand)] text-black font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Guardando...</>
            ) : (
              "Restablecer contraseña"
            )}
          </button>
        </form>
      )}
    </>
  );
}

export default function ResetContrasenaPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al login
        </Link>

        <h1 className="text-3xl font-bold mb-2">Nueva contraseña</h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Introduce tu nueva contraseña.
        </p>

        <Suspense fallback={
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--brand)] mx-auto" />
          </div>
        }>
          <ResetContrasenaForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
