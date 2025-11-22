import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PPP Reality Dashboard",
  description:
    "Benchmark $1 USD across global markets using PPP-adjusted purchasing power.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistMono.variable} bg-night-950 text-slate-100 antialiased`}
      >
        <div className="relative isolate min-h-screen bg-night-950">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night-900/90 via-night-950 to-night-950" />
          <div className="pointer-events-none absolute inset-0 bg-grid-night bg-grid opacity-25" />
          <div className="pointer-events-none absolute inset-x-0 top-[-10%] h-96 rotate-12 bg-brand-pink/20 blur-[140px]" />
          <div className="relative z-10 flex min-h-screen flex-col">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
