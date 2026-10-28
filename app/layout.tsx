import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getSite } from "@/lib/content";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
      <body className={`${oswald.variable} ${inter.variable} antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-gold focus:px-4 focus:py-2 focus:text-(--color-base)"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer site={site} />
      </body>
    </html>
  );
}
