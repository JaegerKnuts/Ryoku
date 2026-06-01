"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CreditCard, Truck, Shield, Loader2, MapPin, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";

const FREE_SHIPPING_THRESHOLD = 60;
const SHIPPING_COST = 4.99;

interface Address {
  name: string;
  surname: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, total: subtotal, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"info" | "payment">("info");
  const [address, setAddress] = useState<Address>({
    name: session?.user?.name?.split(" ")[0] || "",
    surname: session?.user?.name?.split(" ").slice(1).join(" ") || "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    phone: "",
  });

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/carrito");
    }
  }, [items, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const isAddressValid = () => {
    return address.name && address.surname && address.address && 
           address.city && address.province && address.postalCode;
  };

  const handleContinue = () => {
    if (isAddressValid()) {
      setStep("payment");
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          address,
          subtotal,
          shipping,
          total,
        }),
      });

      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error al iniciar el pago. Inténtalo de nuevo.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Error al procesar el pago. Inténtalo de nuevo.");
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/carrito"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al carrito
        </Link>
        <h1 className="text-3xl font-bold mt-4">Finalizar compra</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Forms */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Progress */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step === "info" ? "text-[var(--brand)]" : "text-[var(--text-secondary)]"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === "info" ? "bg-[var(--brand)] text-black" : "bg-[var(--surface)]"}`}>
                1
              </div>
              <span className="text-sm font-medium">Envío</span>
            </div>
            <div className="flex-1 h-px bg-[var(--border)]" />
            <div className={`flex items-center gap-2 ${step === "payment" ? "text-[var(--brand)]" : "text-[var(--text-secondary)]"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === "payment" ? "bg-[var(--brand)] text-black" : "bg-[var(--surface)]"}`}>
                2
              </div>
              <span className="text-sm font-medium">Pago</span>
            </div>
          </div>

          {step === "info" ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-5 h-5 text-[var(--brand)]" />
                <h2 className="text-lg font-semibold">Dirección de envío</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase text-[var(--text-secondary)] mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={address.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm focus:border-[var(--brand)] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase text-[var(--text-secondary)] mb-2">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    name="surname"
                    value={address.surname}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm focus:border-[var(--brand)] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase text-[var(--text-secondary)] mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  name="address"
                  value={address.address}
                  onChange={handleInputChange}
                  placeholder="Calle, número, piso, puerta"
                  className="w-full px-4 py-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm focus:border-[var(--brand)] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase text-[var(--text-secondary)] mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm focus:border-[var(--brand)] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase text-[var(--text-secondary)] mb-2">
                    Provincia *
                  </label>
                  <input
                    type="text"
                    name="province"
                    value={address.province}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm focus:border-[var(--brand)] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase text-[var(--text-secondary)] mb-2">
                    Código postal *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm focus:border-[var(--brand)] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase text-[var(--text-secondary)] mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={address.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm focus:border-[var(--brand)] focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={!isAddressValid()}
                className="w-full py-4 bg-[var(--brand)] text-black font-semibold rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar al pago
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-5 h-5 text-[var(--brand)]" />
                <h2 className="text-lg font-semibold">Método de pago</h2>
              </div>

              <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">VISA</span>
                  </div>
                  <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-red-500">MC</span>
                  </div>
                  <span className="text-sm text-[var(--text-secondary)]">Tarjeta de crédito/débito</span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  Serás redirigido a Stripe para completar el pago de forma segura.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <h3 className="text-sm font-medium mb-3">Resumen de envío</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {address.name} {address.surname}<br />
                  {address.address}<br />
                  {address.postalCode} {address.city}, {address.province}<br />
                  {address.phone && <>{address.phone}</>}
                </p>
                <button
                  onClick={() => setStep("info")}
                  className="text-xs text-[var(--brand)] mt-2 hover:underline"
                >
                  Editar dirección
                </button>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-4 bg-[var(--brand)] text-black font-semibold rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Procesando...</>
                ) : (
                  <><CreditCard className="w-5 h-5" /> Pagar {total.toFixed(2)} €</>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>Pago seguro</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  <span>Envío rápido</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Right column - Order summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="sticky top-28 p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6">
              Tu pedido ({items.reduce((s, i) => s + i.qty, 0)} artículos)
            </h3>

            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.id}-${item.variantId || 'no-variant'}-${item.size}-${item.color}`} className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[var(--bg)] flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    {(item.size || item.color) && (
                      <p className="text-xs text-[var(--text-muted)]">{[item.color, item.size].filter(Boolean).join(" / ")}</p>
                    )}
                    <p className="text-xs text-[var(--text-muted)]">{item.qty} x {item.price.toFixed(2)} €</p>
                  </div>
                  <p className="text-sm font-semibold">{(item.price * item.qty).toFixed(2)} €</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm border-t border-[var(--border)] pt-4">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Envío</span>
                <span>{shipping === 0 ? "Gratis" : `${shipping.toFixed(2)} €`}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-3 border-t border-[var(--border)]">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>

            {shipping > 0 && (
              <p className="text-xs text-[var(--text-muted)] mt-4">
                Te faltan {(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} € para envío gratis
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
