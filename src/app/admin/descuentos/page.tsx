"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Discount {
  id: number;
  code: string;
  percent: number;
  active: boolean;
  usageCount: number;
  usageLimit: number | null;
  expiresAt: string | null;
}

export default function AdminDescuentos() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", percent: "", usageLimit: "", expiresAt: "" });

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = () => {
    fetch("/api/admin/descuentos")
      .then((res) => res.json())
      .then((data) => {
        setDiscounts(data.discounts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/descuentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code.toUpperCase(),
        percent: parseFloat(form.percent),
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        expiresAt: form.expiresAt || null,
      }),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ code: "", percent: "", usageLimit: "", expiresAt: "" });
      fetchDiscounts();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este descuento?")) return;
    await fetch(`/api/admin/descuentos/${id}`, { method: "DELETE" });
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-4xl uppercase tracking-tight"
          style={{ fontFamily: "var(--font-bebas), Impact, sans-serif" }}
        >
          Descuentos
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold uppercase tracking-wider transition-all"
          style={{ background: "var(--brand)", borderRadius: "var(--radius)" }}
        >
          <Plus className="w-4 h-4" /> Nuevo
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-[var(--bg)] p-6 rounded-lg border border-[var(--border)] mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-2">Código</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              required
              placeholder="VERANO20"
              className="w-full px-3 py-2 border border-[var(--border)] rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-2">% Descuento</label>
            <input
              type="number"
              value={form.percent}
              onChange={(e) => setForm({ ...form, percent: e.target.value })}
              required
              placeholder="15"
              className="w-full px-3 py-2 border border-[var(--border)] rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-2">Límite usos</label>
            <input
              type="number"
              value={form.usageLimit}
              onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
              placeholder="100"
              className="w-full px-3 py-2 border border-[var(--border)] rounded-md text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-white text-sm font-semibold uppercase"
            style={{ background: "var(--brand)", borderRadius: "var(--radius)" }}
          >
            Crear
          </button>
        </form>
      )}

      <div className="bg-[var(--bg)] rounded-lg border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
              <th className="text-left p-4 font-semibold">Código</th>
              <th className="text-center p-4 font-semibold">Descuento</th>
              <th className="text-center p-4 font-semibold">Usos</th>
              <th className="text-center p-4 font-semibold">Estado</th>
              <th className="text-right p-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-[var(--text-muted)]">Cargando...</td></tr>
            ) : discounts.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-[var(--text-muted)]">No hay descuentos</td></tr>
            ) : (
              discounts.map((d) => (
                <tr key={d.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                  <td className="p-4 font-mono font-bold">{d.code}</td>
                  <td className="p-4 text-center">{Number(d.percent)}%</td>
                  <td className="p-4 text-center">{d.usageCount}{d.usageLimit ? ` / ${d.usageLimit}` : ""}</td>
                  <td className="p-4 text-center">
                    <span
                      className="inline-block px-2 py-0.5 text-xs font-bold uppercase rounded"
                      style={{
                        background: d.active ? "rgba(45,139,78,0.1)" : "rgba(212,25,32,0.1)",
                        color: d.active ? "#2D8B4E" : "var(--brand)",
                      }}
                    >
                      {d.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(d.id)} className="p-2 rounded hover:bg-red-50 text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
