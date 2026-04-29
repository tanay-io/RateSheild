import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ShieldLogo } from "@/components/shield-logo";

export function LandingNavbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-[52px] items-center justify-between border-b border-white/[0.08] px-5 md:px-8">
      <Link href="/" aria-label="RateShield home">
        <ShieldLogo />
      </Link>
      <nav className="hidden items-center gap-8 text-sm text-white/60 md:flex">
        {["Product", "Features", "Docs", "Pricing"].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} className="transition duration-150 hover:text-white">
            {item}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm text-white/60 transition hover:text-white">
          Sign in
        </Link>
        <Link href="/register" className="hidden items-center gap-2 rounded-md bg-white px-4 py-2 text-[13px] font-medium text-black transition hover:opacity-90 sm:flex">
          Get started <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </header>
  );
}
