"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid login details.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#090909] text-white flex items-center justify-center px-5">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <p className="text-yellow-500 uppercase tracking-[0.3em] text-xs font-bold">
            Lydia's Fashion Hub
          </p>

          <h1 className="text-4xl font-black mt-3">
            Admin Portal
          </h1>

          <p className="text-gray-400 mt-2">
            Secure store management
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-gradient-to-br from-[#1a1815] to-[#0f0f0f] border border-yellow-600/20 rounded-3xl p-7 shadow-2xl"
        >
          <div className="grid gap-5">

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Admin Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                required
                className="w-full bg-black border border-gray-700 rounded-xl p-4 outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full bg-black border border-gray-700 rounded-xl p-4 outline-none focus:border-yellow-500"
              />
            </div>

            {error && (
              <div className="bg-red-950/40 border border-red-500/30 text-red-300 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#d4af37] via-[#f5d76e] to-[#c9a227] text-black rounded-xl p-4 font-black hover:scale-[1.01] transition disabled:opacity-50"
            >
              {loading
                ? "Signing in..."
                : "Enter Dashboard 🔐"}
            </button>

          </div>
        </form>

        <p className="text-center text-gray-600 text-xs mt-6">
          Lydia's Fashion Hub • Admin Access
        </p>

      </div>
    </main>
  );
}