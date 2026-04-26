"use client";

import { FormEvent, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useSession } from "@/components/dashboard/session-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { login, register } from "@/lib/api/client";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { setSession } = useSession();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        const response =
          mode === "login"
            ? await login(email, password)
            : await register(name, email, password);
        setSession({ token: response.token, user: response.user });
        router.replace("/dashboard");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Authentication failed");
      }
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500 dark:text-zinc-400">
            Authentication
          </p>
          <h1 className="mt-1 text-[16px] font-medium">
            {mode === "login" ? "Sign in to RateShield" : "Create an operator account"}
          </h1>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={onSubmit}>
            {mode === "register" ? (
              <Input placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
            ) : null}
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {error ? <p className="text-[12px] text-red-600 dark:text-red-400">{error}</p> : null}
            <div className="flex items-center justify-between">
              <Button type="submit" disabled={isPending}>
                {mode === "login" ? "Login" : "Register"}
              </Button>
              <Link
                href={mode === "login" ? "/register" : "/login"}
                className="text-[13px] text-zinc-500 dark:text-zinc-400"
              >
                {mode === "login" ? "Need an account?" : "Use existing account"}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
