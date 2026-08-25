import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

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
  themeColor: "#0c5db5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
