"use client";

import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsuarios() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/usuarios")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1
        className="text-4xl uppercase tracking-tight mb-8"
        style={{ fontFamily: "var(--font-bebas), Impact, sans-serif" }}
      >
        Usuarios
      </h1>

      <div className="bg-[var(--bg)] rounded-lg border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
              <th className="text-left p-4 font-semibold">Nombre</th>
              <th className="text-left p-4 font-semibold">Email</th>
              <th className="text-center p-4 font-semibold">Rol</th>
              <th className="text-right p-4 font-semibold">Registro</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-[var(--text-muted)]">Cargando...</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-[var(--text-secondary)]">{user.email}</td>
                  <td className="p-4 text-center">
                    <span
                      className="inline-block px-2 py-0.5 text-xs font-bold uppercase rounded"
                      style={{
                        background: user.role === "ADMIN" ? "rgba(212,25,32,0.1)" : "rgba(99,102,241,0.1)",
                        color: user.role === "ADMIN" ? "var(--brand)" : "#6366F1",
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-right text-[var(--text-secondary)]">
                    {new Date(user.createdAt).toLocaleDateString("es-ES")}
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
