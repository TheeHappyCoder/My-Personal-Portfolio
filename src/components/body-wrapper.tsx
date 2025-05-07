// src/components/BodyWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export function BodyWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const backgroundSize = isHomePage ? "cover" : "contain";

  return (
    <body
      style={{ backgroundSize }}
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        antialiased
        relative
        min-h-screen
        magicpattern
      `}
    >
      {children}
    </body>
  );
}
