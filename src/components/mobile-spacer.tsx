// src/components/MobileSpacer.tsx
"use client";

import { usePathname } from "next/navigation";

export default function MobileSpacer() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  if (isHomePage) return null;

  return <div className="block md:hidden h-24" />;
}
