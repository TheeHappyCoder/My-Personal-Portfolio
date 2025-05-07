'use client';

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home, User, Folder, Mail, Sun, Moon } from "lucide-react";
import regionIcon from '@/assets/icon/south-africa.png';
  
export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    setTime(new Date());

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    const onScroll = () => {
      setScrolled(window.scrollY > 10); // threshold
    };
    window.addEventListener("scroll", onScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!mounted) return null;

  return (
    <header
      className={`
        fixed left-0 right-0 z-50 flex items-center justify-center px-8
        transition-all duration-600
        bottom-6
        md:bottom-auto
        ${scrolled ? 'md:top-3' : 'md:top-6'}
      `}
    >
      {/* Left Side */}
      <div className="hidden md:flex absolute left-8 items-center gap-2 transition-all duration-300">
        <Image
          src={regionIcon}
          alt="South Africa"
          width={20}
          height={20}
          className="transition-all duration-300"
        />
        <span className="text-sm font-medium transition-all duration-300">
          Pretoria, South Africa
        </span>
      </div>

      {/* Center Menu */}
      <div className="flex items-center rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md p-2 shadow-lg border border-white/20 transition-all duration-300">
        {/* Home */}
        <Link href="/">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/10
              ${pathname === "/" ? "bg-black/10 dark:bg-white/10" : ""}
            `}
          >
            <Home className="h-5 w-5" />
          </Button>
        </Link>

        <div className="mx-2 h-6 w-px bg-black/20 dark:bg-white/30 shrink-0 transition-all duration-300" />

        {/* About / Projects / Contact */}
        <div className="flex items-center gap-2">
          <Link href="/about">
            <Button
              variant="ghost"
              className={`flex items-center gap-2 rounded-full px-2 md:px-3 py-2 transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/10
                ${pathname === "/about" ? "bg-black/10 dark:bg-white/10" : ""}
              `}
            >
              <User className="h-4 w-4" />
              <span className="hidden md:inline text-sm transition-all duration-300 transform scale-90 opacity-0 md:scale-100 md:opacity-100">
                About
              </span>
            </Button>
          </Link>

          <Link href="/projects">
            <Button
              variant="ghost"
              className={`flex items-center gap-2 rounded-full px-2 md:px-3 py-2 transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/10
                ${pathname === "/projects" ? "bg-black/10 dark:bg-white/10" : ""}
              `}
            >
              <Folder className="h-4 w-4" />
              <span className="hidden md:inline text-sm transition-all duration-300 transform scale-90 opacity-0 md:scale-100 md:opacity-100">
                Projects
              </span>
            </Button>
          </Link>

          <Link href="/contact">
            <Button
              variant="ghost"
              className={`flex items-center gap-2 rounded-full px-2 md:px-3 py-2 transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/10
                ${pathname === "/contact" ? "bg-black/10 dark:bg-white/10" : ""}
              `}
            >
              <Mail className="h-4 w-4" />
              <span className="hidden md:inline text-sm transition-all duration-300 transform scale-90 opacity-0 md:scale-100 md:opacity-100">
                Contact
              </span>
            </Button>
          </Link>
        </div>

        <div className="mx-2 h-6 w-px bg-black/20 dark:bg-white/30 shrink-0 transition-all duration-300" />

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/10"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <div className="relative flex items-center justify-center h-5 w-5">
            <Sun
              className={`absolute h-5 w-5 transition-all duration-300 ${
                theme === "dark"
                  ? "rotate-90 scale-0 opacity-0"
                  : "rotate-0 scale-100 opacity-100"
              }`}
            />
            <Moon
              className={`absolute h-5 w-5 transition-all duration-300 ${
                theme === "dark"
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-0 opacity-0"
              }`}
            />
          </div>
        </Button>
      </div>

      {/* Right Side Clock */}
      <div className="hidden md:flex absolute right-8 items-center font-mono text-sm transition-all duration-300">
        {time &&
          time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })}
      </div>
    </header>
  );
}
