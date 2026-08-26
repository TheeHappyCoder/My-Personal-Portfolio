import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "MarkOS | Mark Steyn",
  description:
    "An interactive Windows-inspired portfolio for Mark Steyn, full-stack developer and building management systems integrator.",
  applicationName: "MarkOS",
  authors: [{ name: "Mark Steyn" }],
  keywords: [
    "Mark Steyn",
    "full-stack developer",
    "React",
    "TypeScript",
    "building management systems",
    "BACnet",
    "portfolio",
  ],
  openGraph: {
    title: "MarkOS | Mark Steyn",
    description: "Software for people. Systems for places.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#244e70",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
