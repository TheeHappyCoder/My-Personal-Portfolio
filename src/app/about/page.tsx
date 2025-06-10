"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import profilePhoto from "@/assets/profile/profile.jpg";
import { motion } from "framer-motion";
import { Hammer, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";

const timelineData = [
  {
    year: "2020 - Present",
    jobTitle: "System Integrator",
    company: "Avantior Building Services",
    description:
      "Setting up and configuring Building Management Systems (BMS), integrating graphics, mapping data points, and ensuring system functionality. Worked with Desigo CC and FIN Framework, obtaining certifications in both.",
  },
  {
    year: "2023",
    jobTitle: "Desigo Entry Level Training",
    company: "Siemens",
    description:
      "Completed training on Desigo CC, focusing on BMS integration, system configuration, and monitoring.",
  },
  {
    year: "2021",
    jobTitle: "FIN Framework BMS Training",
    company: "J2 Innovations (Siemens)",
    description:
      "Completed training on FIN Framework, covering system integration, data point mapping, and BMS visualization.",
  },
  {
    year: "2020 - 2021",
    jobTitle: "MCSD Software Development",
    company: "CTU Training Solutions",
    description: "Studied MCSD Software Development.",
  },
  {
    year: "2018 - 2019",
    jobTitle: "Floor Manager",
    company: "Interfit Gym",
    description:
      "Managed daily gym operations, assisted members, ensured equipment maintenance, and supervised staff to maintain a safe and welcoming environment.",
  },
  {
    year: "2016 - 2017",
    jobTitle: "Higher Certificate in Exercise Science",
    company: "Health and Fitness Professionals Association",
    description:
      "Completed coursework in exercise science, fitness training, and health principles, gaining knowledge in personal training, biomechanics, and client wellness.",
  },
  {
    year: "2015 - 2016",
    jobTitle: "Waiter",
    company: "Spur Steak Ranches",
    description:
      "Took orders, served food, and handled payments. Assisted customers with menu choices, coordinated with the kitchen staff, and maintained cleanliness in the dining area.",
  },
  {
    year: "2010 - 2014",
    jobTitle: "Completed Matric",
    company: "Pretoria Boys High (YA BRU)",
    description:
      "Completed high school education and participated in various activities.",
  },
];

const skills = [
  "React (TypeScript & JavaScript)",
  "Next.js",
  "TailwindCSS",
  "Ant Design, MUI, Chakra UI, Shadcn UI",
  "Node.js & Express.js (Backend APIs)",
  "Python (Flask, FastAPI, WebSockets)",
  "SQLite, InfluxDB, SQL",
  "Building Automation (Desigo CC, FIN Framework, BAC0)",
  "Fabric.js (Canvas UIs)",
  "Git, CLI, Microsoft Office",
];

const interests = [
  "Arsenal Fan (North London Forever)",
  "AI & Technology (ChatGPT abuser)",
  "Fitness (lifting heavyish)",
  "Music (rap head)",
  "TV Shows (Modern Family addict)",
];

export default function AboutPage() {
  const [isAscending, setIsAscending] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isSticky, setIsSticky] = useState(false);
  const topTriggerRef = useRef<HTMLDivElement>(null);
  const bottomTriggerRef = useRef<HTMLDivElement>(null);

  const displayData = useMemo(
    () => (isAscending ? [...timelineData].reverse() : [...timelineData]),
    [isAscending]
  );

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Top sentinel: start fixing
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    const top = topTriggerRef.current;
    if (top) observer.observe(top);
    return () => {
      if (top) observer.unobserve(top);
    };
  }, []);

  // Bottom sentinel: stop fixing
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setIsSticky(false);
      },
      { threshold: 0 }
    );
    const bottom = bottomTriggerRef.current;
    if (bottom) observer.observe(bottom);
    return () => {
      if (bottom) observer.unobserve(bottom);
    };
  }, []);

  return (
    <div className="relative min-h-screen font-[family-name:var(--font-geist-sans)] mt-0 md:mt-50 mb-50">
      {/* Small screen avatar */}
      <div className="flex lg:hidden flex-col items-center pt-8 mb-8">
        <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: 0.8 }}>
          <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-2">
              {showSkeleton ? (
                <Skeleton className="w-full h-full rounded-full animate-pulse" />
              ) : (
                <Image
                  src={profilePhoto}
                  alt="Mark Steyn"
                  fill
                  className="object-cover transition-opacity duration-500"
                />
              )}
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold">Mark Steyn</h2>
              <p className="text-muted-foreground mt-1">Developer | Arsenal Fan | Coffee Dependent</p>
            </div>
            <a
              href="/contact"
              className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
            >
              Contact Me
            </a>
          </Card>
        </motion.div>
      </div>
  
      {/* About content layout */}
      <div className="relative max-w-7xl mx-auto flex lg:flex-row gap-x-12 px-4 sm:px-6 lg:px-8">
        {/* Sticky avatar on large screens */}
        <div className="hidden lg:block w-[350px] flex-shrink-0">
        <div className="sticky top-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            whileInView={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            className="animate-float"
          >

              <Card className="p-8 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg flex flex-col items-center">
                <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4">
                  <Image src={profilePhoto} alt="Mark Steyn" fill className="object-cover" />
                </div>
                <div className="text-center">
                  <h2 className="text-3xl font-bold">Mark Steyn</h2>
                  <p className="text-muted-foreground mt-2">Developer | Arsenal Fan | Coffee Dependent</p>
                </div>
                <a
                  href="/contact"
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
                >
                  Contact Me
                </a>
              </Card>
            </motion.div>
          </div>
        </div>
  
        {/* Main content column */}
        <div className="w-full">
          <section className="w-full md:w-[90%] lg:w-full mx-auto flex flex-col gap-16">
            {/* Timeline */}
            <motion.div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-3xl font-bold">Timeline</h3>
                <Button size="sm" onClick={() => setIsAscending((p) => !p)}>
                  {isAscending ? "Show Newest First" : "Show Oldest First"}
                </Button>
              </div>
              <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                <CardContent className="p-6 flex flex-col gap-6">
                  {displayData.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="flex flex-col gap-1"
                    >
                      <h4 className="font-semibold">{item.year}</h4>
                      <p className="text-primary font-medium">
                        {item.jobTitle} — {item.company}
                      </p>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                      {idx < displayData.length - 1 && <Separator className="my-4" />}
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
  
            {/* Skills & Interests */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
              <h3 className="text-3xl font-bold mb-4">Skills &amp; Interests</h3>
              <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                <CardContent className="p-6 flex flex-col gap-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Hammer className="h-6 w-6 text-primary" />
                      <h4 className="text-2xl font-semibold">Skills</h4>
                    </div>
                    <ul className="list-disc list-inside space-y-2">
                      {skills.map((skill, i) => (
                        <li key={i} className="text-muted-foreground">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
  
                  <Separator />
  
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="h-6 w-6 text-primary" />
                      <h4 className="text-2xl font-semibold">Interests</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest, i) => (
                        <Badge key={i} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
  
            {/* CV Download */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-col gap-4"
            >
              <h3 className="text-3xl font-bold">CV</h3>
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition cursor-pointer">
                  Download CV
                </button>
              </a>
            </motion.div>
          </section>
        </div>
      </div>
    </div>
  );
  
}
