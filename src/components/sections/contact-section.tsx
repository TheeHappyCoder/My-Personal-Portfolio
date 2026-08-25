"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Mail, Linkedin, MapPin, Send, Check, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { gsap } from "@/lib/gsap";
import { magneticHover } from "@/lib/animations-gsap";

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    value: "marksteyn1001@gmail.com",
    href: "mailto:marksteyn1001@gmail.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "Mark Steyn",
    href: "https://www.linkedin.com/in/mark-steyn-b71894139/",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Pretoria, South Africa",
    href: null,
  },
];

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const heading = sectionRef.current!.querySelector(".contact-heading");
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

      const subtitle = sectionRef.current!.querySelector(".contact-subtitle");
      if (subtitle) {
        gsap.from(subtitle, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          delay: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: subtitle,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      const fields = sectionRef.current!.querySelectorAll(".form-field");
      if (fields.length) {
        gsap.from(fields, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: fields[0],
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      const links = sectionRef.current!.querySelectorAll(".contact-link");
      if (links.length) {
        gsap.from(links, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: links[0],
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      if (submitBtnRef.current) {
        return magneticHover(submitBtnRef.current, 0.2);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error("Network error");

      setSubmitted(true);
      toast.success("Message sent. I'll get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} id="contact" className="relative overflow-hidden py-32 md:py-48">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
          Contact
        </p>

        <h2 className="contact-heading mb-4 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
          Let&apos;s talk
        </h2>
        <p className="contact-subtitle mb-20 max-w-lg text-lg text-muted-foreground/60">
          Have a project in mind or want to collaborate? I&apos;d love to hear from you.
        </p>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="form-field">
              <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground/50">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border-b border-border/50 bg-transparent py-3 text-foreground outline-none transition-colors duration-300 placeholder:text-muted-foreground/30 focus:border-foreground"
                placeholder="Your name"
              />
            </div>

            <div className="form-field">
              <label htmlFor="contact-email" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground/50">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-b border-border/50 bg-transparent py-3 text-foreground outline-none transition-colors duration-300 placeholder:text-muted-foreground/30 focus:border-foreground"
                placeholder="your@email.com"
              />
            </div>

            <div className="form-field">
              <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground/50">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full resize-none border-b border-border/50 bg-transparent py-3 text-foreground outline-none transition-colors duration-300 placeholder:text-muted-foreground/30 focus:border-foreground"
                placeholder="Tell me about your project..."
              />
            </div>

            <div className="form-field pt-4">
              <button
                ref={submitBtnRef}
                type="submit"
                disabled={submitting}
                className="group inline-flex items-center gap-3 text-sm font-medium tracking-wider text-foreground transition-colors hover:text-primary disabled:opacity-50"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border/50 transition-all duration-300 group-hover:border-primary group-hover:bg-primary">
                  {submitted ? (
                    <Check className="h-5 w-5 transition-colors group-hover:text-primary-foreground" />
                  ) : (
                    <Send className="h-4 w-4 transition-colors group-hover:text-primary-foreground" />
                  )}
                </span>
                {submitting ? "SENDING..." : submitted ? "SENT" : "SEND MESSAGE"}
              </button>
            </div>
          </form>

          <div className="space-y-6 lg:pt-8">
            {contactLinks.map((item) => (
              <div key={item.label} className="contact-link">
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-center justify-between border-b border-border/20 pb-4 transition-colors hover:border-foreground/30"
                  >
                    <div>
                      <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground/40">
                        {item.label}
                      </p>
                      <p className="text-lg font-medium">{item.value}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/30 transition-all group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ) : (
                  <div className="border-b border-border/20 pb-4">
                    <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground/40">
                      {item.label}
                    </p>
                    <p className="text-lg font-medium">{item.value}</p>
                  </div>
                )}
              </div>
            ))}

            <div className="mt-12 flex items-center gap-3 pt-4">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-green-500" />
              </div>
              <span className="text-sm text-muted-foreground/60">
                Available for freelance &amp; full-time
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
