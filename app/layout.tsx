import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", weight: ["300", "400", "500", "600", "700"] });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Basement Unlock",
  description: "Find out whether your Salt Lake City basement can legally become an apartment, and what to ask the city.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${space.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
