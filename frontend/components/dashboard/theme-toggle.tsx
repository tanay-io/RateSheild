"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof document === "undefined") {
      return "dark";
    }

    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem("rateshield-theme", nextTheme);
    setTheme(nextTheme);
  }

  return (
    <Button variant="ghost" onClick={toggleTheme}>
      {theme === "dark" ? "Dark" : "Light"}
    </Button>
  );
}
