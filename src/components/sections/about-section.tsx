"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { magneticHover } from "@/lib/animations-gsap";
import profilePhoto from "@/assets/profile/profile.jpg";

const skills = [
  "React", "Next.js", "TypeScript", "Tailwind CSS",
  "Node.js", "Python", "Flask", "FastAPI",
  "SQLite", "Supabase", "Firebase", "WebSockets",
  "BACnet", "Desigo CC", "FIN Framework", "KNX",
];

const timeline = [
  { year: "2020", title: "System Integrator", company: "Avantior Building Services" },
  { year: "2023", title: "Desigo CC Certified", company: "Siemens" },
  { year: "2021", title: "FIN Framework Trained", company: "J2 Innovations" },
];

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const cvBtnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      const heading = sectionRef.current!.querySelector(".about-heading");
      if (heading) {
        gsap.from(heading, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      const bioTexts = sectionRef.current!.querySelectorAll(".bio-text");
      if (bioTexts.length) {
        gsap.from(bioTexts, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bioTexts[0],
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      const skillItems = sectionRef.current!.querySelectorAll(".skill-item");
      if (skillItems.length) {
        gsap.from(skillItems, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.03,
          ease: "power2.out",
          scrollTrigger: {
            trigger: skillItems[0],
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      const timelineItems = sectionRef.current!.querySelectorAll(".timeline-item");
      if (timelineItems.length) {
        gsap.from(timelineItems, {
          x: -30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: timelineItems[0],
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      if (cvBtnRef.current) {
        return magneticHover(cvBtnRef.current, 0.3);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative overflow-hidden py-32 md:py-48">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
          About
        </p>

        <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <div ref={imageRef} className="absolute inset-[-10%]">
                <Image
                  src={profilePhoto}
                  alt="Mark Steyn"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>

            <div className="mt-12 space-y-6 border-l border-border/30 pl-6">
              {timeline.map((item, i) => (
                <div key={i} className="timeline-item relative">
                  <div className="absolute -left-[25px] top-1.5 h-1.5 w-1.5 rounded-full bg-foreground/40" />
                  <p className="text-xs uppercase tracking-widest text-muted-foreground/50">
                    {item.year}
                  </p>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground/60">{item.company}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-12">
            <h2 className="about-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Building systems{" "}
              <span className="text-muted-foreground/40">that matter</span>
            </h2>

            <div className="space-y-6">
              <p className="bio-text text-lg leading-relaxed text-muted-foreground">
                I&apos;m a full-stack developer with 5+ years of experience building
                modern web applications and intelligent building automation systems.
              </p>
              <p className="bio-text text-lg leading-relaxed text-muted-foreground/70">
                Based in Pretoria, South Africa, I work as a System Integrator at
                Avantior Building Services where I develop custom BMS solutions
                integrating BACnet, KNX, and Siemens Desigo CC platforms.
              </p>
            </div>

            <div>
              <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">
                Technologies
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="skill-item rounded-full border border-border/30 px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-300 hover:border-foreground/30 hover:text-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <a
              ref={cvBtnRef}
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 text-sm font-medium tracking-wider text-foreground transition-colors hover:text-primary"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 transition-all duration-300 group-hover:border-primary group-hover:bg-primary">
                <Download className="h-4 w-4 transition-colors group-hover:text-primary-foreground" />
              </span>
              DOWNLOAD CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
