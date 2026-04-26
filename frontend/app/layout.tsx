import type { Metadata } from "next";
import { ReactNode } from "react";

import { SessionProvider } from "@/components/dashboard/session-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "RateShield Dashboard",
  description: "A precise, production-oriented control surface for RateShield."
};

const themeScript = `
(() => {
  try {
    const stored = localStorage.getItem("rateshield-theme");
    const theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch (_) {
    document.documentElement.classList.add("dark");
  }
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-zinc-50 text-zinc-900 antialiased dark:bg-[#0A0A0A] dark:text-zinc-100">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
