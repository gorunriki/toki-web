"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      router.push("/dashboard");
    } catch (err: any) {
      alert(
        err?.response?.data?.error || "login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow"
      >
        <h1 className="mb-6 text-center text-2xl font-bold">
          TOKI WMS
        </h1>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border p-3"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border p-3"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </div>

        <button
          disabled={loading}
          className="w-full rounded-lg bg-black p-3 text-white"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}