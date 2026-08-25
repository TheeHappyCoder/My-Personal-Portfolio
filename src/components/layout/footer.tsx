"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { footerAnimation } from "@/lib/animations";

const socialLinks = [
  {
    href: "https://github.com/marksteyn",
    icon: Github,
    label: "GitHub",
  },
  {
    href: "https://www.linkedin.com/in/mark-steyn-b71894139/",
    icon: Linkedin,
    label: "LinkedIn",
  },
  {
    href: "mailto:marksteyn1001@gmail.com",
    icon: Mail,
    label: "Email",
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      variants={footerAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="border-t border-border bg-background"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            {currentYear} Mark Steyn. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-accent"
                aria-label={link.label}
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          {/* Location */}
          <p className="text-sm text-muted-foreground">
            Pretoria, South Africa
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
