'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {


  return (
    <>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] overflow-hidden">
        <main className="flex flex-col gap-2 row-start-2 items-center text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            Mark Steyn
          </h1>
          <p className="text-lg sm:text-2xl max-w-md text-muted-foreground">
            Developer by trade, Arsenal fan by bad life choices.
          </p>

          <Link href={"/projects"}>
          <Button variant="default" size="lg" className="mt-6 cursor-pointer">
            See My Work
          </Button>
          </Link>
        </main>
      </div>
    </>
  );
}

