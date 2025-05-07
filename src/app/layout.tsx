import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/Header";
import { ProgressBar } from "@/components/loading-bar";
import { BodyWrapper } from "@/components/body-wrapper";
import { Toaster } from 'sonner';
import BackToTopButton from "@/components/scroll-top";
import MobileSpacer from "@/components/mobile-spacer";
import { Analytics } from '@vercel/analytics/react'; 
import LenisProvider from "@/components/lenis-provider";

export const metadata: Metadata = {
  title: "Mark Steyn's Portfolio",
  description: "Created by Mark Steyn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <BodyWrapper>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LenisProvider /> 
          <ProgressBar />
          <Header />
          <main>
            {children}
          </main>
          <MobileSpacer />
          <BackToTopButton />
          <Toaster position="top-right" />
          <Analytics />
        </ThemeProvider>
      </BodyWrapper>
    </html>
  );
}
