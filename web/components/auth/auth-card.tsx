"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ShieldLogo } from "@/components/shield-logo";
import { Button } from "@/components/button";
import { api } from "@/lib/api";
import { saveSession } from "@/lib/auth";

type AuthCardProps = {
  mode: "login" | "register";
};

export function AuthCard({ mode }: AuthCardProps) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "").trim();

    try {
      const session = isRegister ? await api.register({ name, email, password }) : await api.login({ email, password });
      saveSession(session);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dot-grid flex min-h-screen items-center justify-center bg-page px-4">
      <form onSubmit={submit} className="w-full max-w-[400px] rounded-xl border border-white/[0.08] bg-sidebar p-8 shadow-2xl motion-safe:animate-[authIn_250ms_ease-out]">
        <div className="text-center">
          <div className="inline-flex justify-center">
            <ShieldLogo />
          </div>
          <p className="mt-1 text-[13px] text-white/40">Rate limiting infrastructure</p>
        </div>
        <div className="mt-7 space-y-4">
          {isRegister ? <Field name="name" label="Name" autoComplete="name" required /> : null}
          <Field name="email" label="Email" type="email" autoComplete="email" required />
          <Field name="password" label="Password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} required minLength={6} />
          {error ? <div className="rounded-md border border-red/20 bg-red/10 px-3 py-2 text-xs text-red">{error}</div> : null}
          <Button type="submit" variant="primary" isLoading={loading} className="w-full">
            {loading ? (isRegister ? "Creating..." : "Signing in...") : isRegister ? "Create account" : "Sign in"}
          </Button>
        </div>
        <p className="mt-5 text-center text-[13px] text-white/40">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link className="text-white transition hover:text-white/70" href={isRegister ? "/login" : "/register"}>
            {isRegister ? "Sign in" : "Register"}
          </Link>
        </p>
      </form>
      <style>{`@keyframes authIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-white/50">{label}</span>
      <input
        className="h-10 w-full rounded-md border border-white/[0.12] bg-transparent px-3 text-sm text-white transition duration-100 placeholder:text-white/25 focus:border-white/30 focus:outline-none"
        {...props}
      />
    </label>
  );
}
