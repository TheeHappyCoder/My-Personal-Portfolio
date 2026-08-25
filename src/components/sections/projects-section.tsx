"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { gsap } from "@/lib/gsap";

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      projectRefs.current.forEach((project) => {
        if (!project) return;

        const image = project.querySelector(".project-image");
        const title = project.querySelector(".project-title");
        const details = project.querySelector(".project-details");
        const number = project.querySelector(".project-number");

        if (image) {
          gsap.from(image, {
            scale: 0.85,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: project,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          });

          gsap.to(image, {
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: project,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        if (number) {
          gsap.from(number, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: project,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          });
        }

        if (title) {
          gsap.from(title, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: project,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          });
        }

        if (details) {
          gsap.from(details.children, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: project,
              start: "top 65%",
              toggleActions: "play none none none",
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="relative py-32 md:py-48">
      <div className="mx-auto mb-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
          Selected Work
        </p>
      </div>

      <div className="space-y-32 md:space-y-48">
        {projects.map((project, index) => (
          <div
            key={project.slug}
            ref={(el) => { projectRefs.current[index] = el; }}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          >
            <Link href={`/projects/${project.slug}`} className="group block">
              <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-16">
                <div className={`overflow-hidden rounded-2xl ${index % 2 === 1 ? "md:order-2" : ""}`}>
                  <div className="project-image relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
                    <Image
                      src={project.images[0] || "/placeholder.webp"}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                  </div>
                </div>

                <div className={index % 2 === 1 ? "md:order-1" : ""}>
                  <span className="project-number mb-4 block font-mono text-sm text-muted-foreground/40">
                    0{index + 1}
                  </span>

                  <h3 className="project-title mb-4 text-4xl font-bold tracking-tight transition-colors group-hover:text-primary md:text-5xl lg:text-6xl">
                    {project.title}
                  </h3>

                  <div className="project-details">
                    <p className="mb-2 text-lg text-muted-foreground/80">
                      {project.subtitle}
                    </p>
                    <p className="mb-6 max-w-md text-muted-foreground/60">
                      {project.description}
                    </p>

                    <div className="mb-8 flex flex-wrap gap-2">
                      {project.tech.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-border/50 px-3 py-1 text-xs text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <span className="inline-flex items-center gap-2 text-sm font-medium tracking-wider text-foreground transition-colors group-hover:text-primary">
                      VIEW PROJECT
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {index < projects.length - 1 && (
              <div className="mx-auto mt-32 h-px w-16 bg-border/30 md:mt-48" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
