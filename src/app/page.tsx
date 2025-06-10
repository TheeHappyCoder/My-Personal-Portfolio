'use client';

import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const name = "Mark Steyn".split("");

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] overflow-hidden"
      >
        <main className="flex flex-col gap-4 row-start-2 items-center text-center">
          {/* FANCY NAME ANIMATION */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
            className="text-4xl sm:text-6xl font-bold tracking-tight flex flex-wrap justify-center"
          >
            {name.map((char, index) => (
              <motion.span
  key={index}
  variants={{
    hidden: { opacity: 0, y: 40, scale: 0.8 },
    visible: { opacity: 1, y: 0, scale: 1 },
  }}
  whileHover={{
    scale: 1.3,
    cursor: "default",
  }}
  transition={{
    type: "spring",
    stiffness: 500,
    damping: 30,
  }}
  className="inline-block cursor-pointer text-black dark:text-white transition-colors duration-300"
>
  {char === " " ? "\u00A0" : char}
</motion.span>

            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-lg sm:text-2xl max-w-md text-muted-foreground"
          >
            Developer by trade, Arsenal fan by bad life choices.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <Link href={"/projects"}>
              <motion.div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 2.5,
                  ease: "easeInOut",
                }}
              >
                <ShimmerButton className="shadow-2xl">
                  <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                    See my work
                  </span>
                </ShimmerButton>
              </motion.div>
            </Link>
          </motion.div>
        </main>
      </motion.div>
    </>
  );
}
