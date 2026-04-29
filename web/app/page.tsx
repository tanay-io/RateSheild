"use client";

import Link from "next/link";
import { ArrowRight, Github, Gauge, Globe2, Radio } from "lucide-react";
import { motion } from "framer-motion";
import { LandingNavbar } from "@/components/landing/navbar";
import { ParticleGlobe } from "@/components/landing/particle-globe";

const fade = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-page text-white">
      <LandingNavbar />
      <section id="product" className="relative h-screen min-h-[680px]">
        <ParticleGlobe />
        <div className="absolute left-0 top-[150px] z-10 max-w-[650px] px-6 md:left-20 md:top-[180px] md:px-0">
          <motion.div initial="hidden" animate="visible" transition={{ delay: 0.1, duration: 0.4 }} variants={fade} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5 font-mono text-xs text-white/65">
            <span className="h-1.5 w-1.5 rounded-full bg-green" />
            v1.0 -- production ready
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" transition={{ delay: 0.2, duration: 0.5 }} variants={fade} className="text-[52px] font-bold leading-[1.06] tracking-normal md:text-[78px]">
            Rate limiting
            <span className="block text-white/35">that doesn&apos;t break.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.4 }} className="mt-6 max-w-[460px] text-base leading-[1.6] text-white/50">
            Redis-backed request control, API key management, live observability, and production-grade enforcement through one clean service.
          </motion.p>
          <motion.div initial="hidden" animate="visible" transition={{ delay: 0.6, duration: 0.4 }} variants={fade} className="mt-8 flex flex-wrap gap-3">
            <Link href="/register" className="inline-flex h-12 items-center gap-2 rounded-md bg-white px-6 text-sm font-medium text-black transition hover:opacity-90">
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="https://github.com/tanay-io/RateSheild" className="inline-flex h-12 items-center gap-2 rounded-md border border-white/20 px-6 text-sm text-white/80 transition hover:border-white/40">
              <Github className="h-4 w-4" /> View GitHub
            </a>
          </motion.div>
        </div>
        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-scrollPulse font-mono text-[10px] tracking-[0.2em] text-white/30">SCROLL</div>
      </section>
      <Ticker />
      <StatsGrid />
      <WhySection />
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h2 className="text-[48px] font-bold leading-[1.08] md:text-[70px]">
          Stop guessing.
          <span className="block text-white/35">Start measuring.</span>
        </h2>
        <p className="mt-4 text-sm text-white/50">Free for the first 100k requests/month. No card required.</p>
        <Link href="/register" className="mt-8 rounded-lg border border-white/15 bg-white/[0.08] px-8 py-3.5 text-sm text-white transition hover:border-white/25 hover:bg-white/[0.12]">
          Get your API key
        </Link>
      </section>
      <footer className="flex h-[60px] items-center justify-between border-t border-white/[0.06] px-6 text-xs text-white/30 md:px-8">
        <span>RateShield 2026</span>
        <div className="flex gap-6">
          <a className="transition hover:text-white/70" href="#docs">Docs</a>
          <a className="transition hover:text-white/70" href="#privacy">Privacy</a>
          <a className="transition hover:text-white/70" href="#terms">Terms</a>
        </div>
      </footer>
    </main>
  );
}

function Ticker() {
  const items = ["FIXED WINDOW", "SLIDING WINDOW", "TOKEN BUCKET", "REDIS-BACKED", "EDGE-READY", "OPEN SOURCE", "<1MS", "GLOBALLY CONSISTENT"];
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div className="h-10 overflow-hidden border-y border-white/[0.06] bg-white/[0.03]">
      <div className="flex h-full w-max animate-ticker items-center whitespace-nowrap hover:[animation-play-state:paused]">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-white/40">
            {item}<span className="mx-5 text-white/20">.</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function StatsGrid() {
  const stats = [
    ["<1ms", "MEDIAN LATENCY"],
    ["99.99%", "AVAILABILITY"],
    ["12k+", "CHECKS / SEC / NODE"],
    ["3", "ALGORITHMS"]
  ];
  return (
    <section id="pricing" className="mx-auto max-w-[1200px] px-6 py-20 md:px-8">
      <div className="mb-6 text-[12px] font-medium uppercase tracking-[0.1em] text-white/30">WHY RATESHIELD</div>
      <div className="grid gap-px md:grid-cols-4">
        {stats.map(([value, label], index) => (
          <div key={label} className="border-white/[0.08] py-8 md:border-r md:px-10 md:last:border-r-0">
            <div className="text-5xl font-bold">{value}</div>
            <div className="mt-2 text-[11px] font-medium uppercase tracking-[0.08em] text-white/35">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhySection() {
  const features = [
    [Gauge, "Three algorithms, one API", "Fixed window, sliding window, and token bucket. Pick per route."],
    [Globe2, "Distributed by default", "Backed by Redis. No race conditions. Globally consistent counters."],
    [Radio, "Live observability", "Every check is logged. Every block is visible. No black boxes."]
  ];
  return (
    <section id="features" className="mx-auto grid max-w-[1200px] gap-12 px-6 py-24 md:grid-cols-2 md:px-8">
      <div>
        <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.1em] text-white/30">WHY RATESHIELD</div>
        <h2 className="text-4xl font-bold leading-tight">Built like infrastructure.<br />Designed like a tool.</h2>
        <div className="mt-8 space-y-6">
          {features.map(([Icon, title, body]) => (
            <div key={title as string} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/[0.08]">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium">{title as string}</div>
                <p className="mt-1 text-[13px] leading-6 text-white/50">{body as string}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CodeBlock />
    </section>
  );
}

function CodeBlock() {
  return (
    <div id="docs" className="h-max rounded-xl border border-white/[0.08] bg-[#111111]">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-4">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28CA42]" />
        <span className="ml-3 font-mono text-[13px] text-white/40">checkout.ts</span>
      </div>
      <pre className="overflow-x-auto p-6 font-mono text-[13px] leading-7 text-[#EEFFFF]">
        <code>{`import { rateshield } from "@rateshield/sdk";

const rs = rateshield({ key: process.env.RSH_KEY });

app.post("/api/checkout", async (req, res) => {
  const { allowed, reset } = await rs.check({
    route: "/api/checkout",
    keyBy: "user",
    userId: req.user.id,
  });

  if (!allowed) return res.status(429).json({ resetAt: reset });

  // ... handle request
});`}</code>
      </pre>
    </div>
  );
}
