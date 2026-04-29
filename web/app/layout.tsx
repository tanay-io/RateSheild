import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RateShield",
  description: "API rate limiting infrastructure with real-time observability.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
