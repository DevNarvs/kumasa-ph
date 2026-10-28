import type { Metadata } from "next";
import { Archivo, Noto_Sans_Tagalog } from "next/font/google";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { getSite } from "@/lib/content";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
});

const notoTagalog = Noto_Sans_Tagalog({
  variable: "--font-noto-tagalog",
  subsets: ["tagalog"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "KUMASA — Kuntaw Unified Martial Sports Advocates",
    template: "%s | KUMASA",
  },
  description: "KUMASA is a Filipino martial arts organization, founded in 2015.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = getSite();

  return (
    <html lang="en">
      <body className={`${archivo.variable} ${notoTagalog.variable} antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-[var(--ink)] focus:px-4 focus:py-2 focus:text-[var(--bg)]"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <Footer site={site} />
      </body>
    </html>
  );
}
