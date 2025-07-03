"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Carousel,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselContent,
} from "@/components/ui/carousel";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Maximize2 } from "lucide-react";

interface Project {
  category: "software-apps" | "branding" | "bms-integrations" | "websites";
  title: string;
  status: string;
  description: string;
  tech: string[];
  images?: string[];
  liveDemoLink?: string;
  repoLink?: string;
  confidential?: boolean;
}

const projects: Project[] = [
  // --- Software Apps (with carousels) ---
  {
    category: "software-apps",
    title: "BACnet Management System",
    status: "Completed",
    description:
      "Comprehensive building & smart-home automation using React, Node.js, Flask & Fabric.js. Features operational graphics, alarming, trending, scheduling & device management.",
    tech: ["React", "Node.js", "Flask", "Fabric.js"],
    images: [
      "/novacore/bannerNova.webp",
      "/novacore/1.png",
      "/novacore/2.png",
      "/novacore/3.png",
      "/novacore/4.png",
      "/novacore/5.png",
      "/novacore/6.png",
      "/novacore/7.png",
      "/novacore/8.png",
      "/novacore/9.png",
      "/novacore/10.png",
      "/novacore/11.png",
      "/novacore/12.png",
      "/novacore/13.png",
      "/novacore/14.png",
      "/novacore/15.png",
      "/novacore/16.png",
      "/novacore/17.png",
      "/novacore/18.png",
      "/novacore/19.png",
      "/novacore/20.png",
      "/novacore/21.png",
      "/novacore/22.png",
      "/novacore/23.png",
      "/novacore/24.png",
      "/novacore/25.png",
      "/novacore/26.png",
      "/novacore/27.png",
      "/novacore/28.png",
      "/novacore/29.png",
      "/novacore/30.png",
      "/novacore/31.png",
      "/novacore/32.png",
      "/novacore/33.png",
      "/novacore/34.png",
      "/novacore/35.png",
      "/novacore/36.png",
      "/novacore/37.png",
      "/novacore/38.png",
      "/novacore/39.png",
      "/novacore/40.png",
      "/novacore/41.png",
      "/novacore/42.png",
      "/novacore/43.png",
      "/novacore/44.png",
      "/novacore/45.png",
      "/novacore/46.png",
      "/novacore/47.png",
      "/novacore/48.png",
      "/novacore/49.png",
    ],
    
  },
  {
    category: "software-apps",
    title: "Law Firm Management System",
    status: "In Progress",
    description:
      "Case & client management portal built with React & Firebase. Includes client creation, case tracking, time-billing, invoice generation & financial statements.",
    tech: ["React", "Firebase"],
    images: [
      "/lawFirm/bannerLawFirm.webp",
      "/lawFirm/1.webp",
      "/lawFirm/2.webp",
      "/lawFirm/3.webp",
      "/lawFirm/4.webp",
      "/lawFirm/5.webp",
      "/lawFirm/6.webp",
      "/lawFirm/7.webp",
      "/lawFirm/8.webp",
      "/lawFirm/9.webp",
      "/lawFirm/10.webp",
      "/lawFirm/11.webp",
      "/lawFirm/12.webp",
      "/lawFirm/13.webp",
      "/lawFirm/14.webp",
      "/lawFirm/15.webp",
    ],
  },
  {
    category: "software-apps",
    title: "Droplet – Local File Transfer",
    status: "In Progress",
    description:
      "Secure P2P file-transfer tool leveraging Firebase Auth + QR tokens. Google-login on desktop/mobile, scan to send/receive files seamlessly.",
    tech: ["Firebase Auth", "QR Tokens"],
    images: [
      "/droplet/background.jpg",
      "/droplet/1.png",
      "/droplet/2.png",
      "/droplet/2.1.png",
      "/droplet/3.png",
      "/droplet/4.png",
      "/droplet/4.1.png",
      "/droplet/5.png",
      "/droplet/5.1.png",
    ],
  },

  // --- Branding & BMS Integrations (no carousel) ---
  {
    category: "branding",
    title: "Branding (Confidential)",
    status: "Completed",
    description:
      "Logo design, email signatures & letterhead. Details available on request.",
    tech: [],
    confidential: true,
  },
  {
    category: "bms-integrations",
    title: "BMS Integrations (Confidential)",
    status: "Completed",
    description:
      "Building Management System integration work. Details available on request.",
    tech: [],
    confidential: true,
  },

  // --- Websites (with carousels) ---
  {
    category: "websites",
    title: "Tagon",
    status: "Live",
    description: "Company site built with HTML, SCSS, JavaScript & jQuery.",
    tech: ["HTML", "SCSS", "JavaScript", "jQuery"],
    liveDemoLink: "https://tagon.tech/",
    images: ["/websites/tagon.png"],
  },
  {
    category: "websites",
    title: "ABT",
    status: "Production",
    description: "Landing page using Next.js, TypeScript & shadcn/ui.",
    tech: ["Next.js", "TypeScript", "shadcn/ui"],
    liveDemoLink: "https://abt-coral.vercel.app/",
    images: ["/websites/abt.png"],
  },
];

export default function ProjectsPage() {

  const categories = [
        {
          value: "software-apps",
          label: "Apps",
          shortLabel: "Apps",
        },
        {
          value: "branding",
          label: "Branding",
          shortLabel: "Branding",
        },
        {
          value: "bms-integrations",
          label: "BMS Integrations",
          shortLabel: "BMS",
        },
        {
          value: "websites",
          label: "Websites",
          shortLabel: "Websites",
        },
      ] as const;
      
  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] mt-0 md:mt-20">
      <main className="mx-auto max-w-5xl">
      <motion.h1
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-4xl sm:text-6xl font-bold tracking-tight mb-4 text-center"
  >
    Projects
  </motion.h1>

  {/* Animated intro, narrow so it wraps in two lines */}
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2, duration: 0.6 }}
    className="text-lg sm:text-2xl max-w-md px-4 mx-auto text-center text-muted-foreground mb-12"
  >
    Explore my software, web & branding projects below.
  </motion.p>

  <Tabs defaultValue="software-apps" className="w-full">
  <TabsList className="grid-cols-4">
    {categories.map((cat) => (
      <TabsTrigger key={cat.value} value={cat.value}>
        <span className="inline sm:hidden">{cat.shortLabel}</span>
        <span className="hidden sm:inline">{cat.label}</span>
      </TabsTrigger>
    ))}
  </TabsList>

  {categories.map((cat) => (
    <TabsContent key={cat.value} value={cat.value}>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {projects
          .filter((p) => p.category === cat.value)
          .map((project, idx) => (
            <Card
              key={idx}
              className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg flex flex-col overflow-hidden"
            >
              <CardHeader className="flex justify-between items-center px-4 pt-4">
                <CardTitle>{project.title}</CardTitle>
                <Badge
                  variant={
                    project.status === "Completed"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {project.status}
                </Badge>
              </CardHeader>

              {project.images && project.images.length > 0 && (
                <div className="flex flex-col">
                  {/* Carousel */}
                  <div className="relative overflow-hidden">
                    <Carousel>
                      <CarouselContent className="flex">
                        {project.images.map((src, i) => (
                          <CarouselItem
                            key={i}
                            className="w-full flex-none h-48 sm:h-56 snap-center"
                          >
                            <div className="relative w-full h-full">
                              <Image
                                src={src}
                                alt={`${project.title} screenshot ${i + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  </div>

                  {/* Fullscreen Button placed outside the image */}
                  <div className="flex justify-center p-2 sm:p-2">
                  <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex gap-2 items-center"
                        >
                          <Maximize2 className="w-4 h-4" />
                          Fullscreen
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-w-6xl w-full">
                      <VisuallyHidden>
                        <DialogTitle>My Dialog Title</DialogTitle>
                      </VisuallyHidden>
                        <div className="relative w-full h-[80vh]">
                          <Carousel>
                            <CarouselPrevious
                              className="absolute top-1/2 -left-10 -translate-y-1/2 z-20
                                bg-black/50 dark:bg-white/30
                                text-white dark:text-black
                                hover:bg-black/70 dark:hover:bg-white/50
                                hover:text-white dark:hover:text-black
                                rounded-full p-3 shadow-xl transition-all"
                            />
                            <CarouselNext
                              className="absolute top-1/2 -right-10 -translate-y-1/2 z-20
                                bg-black/50 dark:bg-white/30
                                text-white dark:text-black
                                hover:bg-black/70 dark:hover:bg-white/50
                                hover:text-white dark:hover:text-black
                                rounded-full p-3 shadow-xl transition-all"
                            />
                            <CarouselContent className="flex">
                              {project.images.map((src, i) => (
                                <CarouselItem
                                  key={i}
                                  className="w-full flex-none h-full snap-center"
                                >
                                  <div className="relative w-full h-[80vh]">
                                    <Image
                                      src={src}
                                      alt={`${project.title} fullscreen screenshot ${i + 1}`}
                                      fill
                                      className="object-contain"
                                      sizes="(max-width: 768px) 100vw, 80vw"
                                    />
                                  </div>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                          </Carousel>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              )}

              <CardContent className="flex flex-col gap-4 px-4 pb-4 flex-1">
                <p className="text-muted-foreground text-sm">
                  {project.description}
                </p>

                {project.tech.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t, i) => (
                      <Badge key={i} variant="outline">
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="mt-auto flex flex-wrap gap-2">
                  {project.liveDemoLink && (
                    <Link
                      href={project.liveDemoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" variant="outline">
                        View Live
                      </Button>
                    </Link>
                  )}
                  {project.repoLink && (
                    <Link
                      href={project.repoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" variant="outline">
                        View Repo
                      </Button>
                    </Link>
                  )}
                  {project.confidential && (
                    <Link href="/contact">
                      <Button size="sm" variant="secondary">
                        Details on Request
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </TabsContent>
  ))}
</Tabs>

      </main>
    </div>
  );
}
