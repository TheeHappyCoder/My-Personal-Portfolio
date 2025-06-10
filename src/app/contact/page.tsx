// app/contact/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Phone, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MagicCard } from "@/components/magicui/magic-card";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const myEmail = "marksteyn1001@gmail.com";
  const myPhone = "+27 64 904 5968";
  const [emailCopied, setEmailCopied] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
  
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback: Copy command failed', err);
    }
  
    document.body.removeChild(textArea);
  };
    
  const handleEmailCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(myEmail);
      } else {
        fallbackCopyTextToClipboard(myEmail);
      }
      setEmailCopied(true);
      toast.success("Email copied!");
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed: ", err);
      fallbackCopyTextToClipboard(myEmail); // fallback if navigator.clipboard fails
      setEmailCopied(true);
      toast.success("Email copied!");
      setTimeout(() => setEmailCopied(false), 2000);
    }
  };
  
  const handlePhoneCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(myPhone);
      } else {
        fallbackCopyTextToClipboard(myPhone);
      }
      setPhoneCopied(true);
      toast.success("Phone number copied!");
      setTimeout(() => setPhoneCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed: ", err);
      fallbackCopyTextToClipboard(myPhone); // fallback if navigator.clipboard fails
      setPhoneCopied(true);
      toast.success("Phone number copied!");
      setTimeout(() => setPhoneCopied(false), 2000);
    }
  };
  
  
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

      // 🎉 success toast
      toast.success("Thanks for reaching out! I’ll get back to you soon.");

      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      // ❌ error toast
      toast.error("Oops! Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-8 pb-20 gap-16 overflow-hidden font-[family-name:var(--font-geist-sans)] sm:grid sm:grid-rows-[20px_1fr_20px] sm:items-center sm:justify-items-center sm:p-20">
      <main className="flex flex-col gap-6 items-center text-center w-full max-w-xl sm:row-start-2">

        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-6xl font-bold tracking-tight"
        > 
          Contact Me
        </motion.h1>

        {/* Intro Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg sm:text-2xl max-w-md text-muted-foreground"
        >
          Got a question, project idea or just want to say hi? Drop me a line below—I'd love to connect.
        </motion.p>

        {/* Form Card */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="w-full"
        >
          <MagicCard >
            <CardContent className="p-6 flex flex-col gap-4">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label htmlFor="name" className="mb-1 font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="email" className="mb-1 font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="message" className="mb-1 font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What’s on your mind?"
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" disabled={submitting} className="mt-2">
                  {submitting ? "Sending…" : "Send Message"}
                </Button>

                {status === "success" && (
                  <p className="text-green-400 mt-2 text-sm">
                    Thanks for reaching out! I’ll get back to you soon.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-red-400 mt-2 text-sm">
                    Oops! Something went wrong. Please try again later.
                  </p>
                )}
              </form>

              <Separator className="my-4" />

              {/* Social / Mail Icons */}
              <div className="flex justify-center gap-6">
              <Popover>
  <PopoverTrigger asChild>
    <Button
      variant="ghost"
      size="icon"
      aria-label="Phone details"
      className="p-0"
    >
      <Phone className="h-6 w-6 hover:text-primary transition" />
    </Button>
  </PopoverTrigger>
  <PopoverContent side="top" align="center" className="w-auto">
    <div className="flex items-center gap-2">
      <span className="text-sm">{myPhone}</span>
      <Button
        size="icon"
        variant="ghost"
        onClick={handlePhoneCopy}
        aria-label={phoneCopied ? "Copied" : "Copy phone"}
      >
        {phoneCopied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  </PopoverContent>
</Popover>

<Popover>
  <PopoverTrigger asChild>
    <Button
      variant="ghost"
      size="icon"
      aria-label="Email details"
      className="p-0"
    >
      <Mail className="h-6 w-6 hover:text-primary transition" />
    </Button>
  </PopoverTrigger>
  <PopoverContent side="top" align="center" className="w-auto">
    <div className="flex items-center gap-2">
      <span className="text-sm">{myEmail}</span>
      <Button
        size="icon"
        variant="ghost"
        onClick={handleEmailCopy}
        aria-label={emailCopied ? "Copied" : "Copy email"}
      >
        {emailCopied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  </PopoverContent>
</Popover>

<Popover>
  <PopoverTrigger asChild>
    <Button
      variant="ghost"
      size="icon"
      aria-label="LinkedIn profile"
      className="p-0"
    >
      <Linkedin className="h-6 w-6 hover:text-primary transition" />
    </Button>
  </PopoverTrigger>
  <PopoverContent side="top" align="center" className="w-auto">
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm">View my LinkedIn</span>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => window.open("https://www.linkedin.com/in/mark-steyn-b71894139/", "_blank")}
      >
        Visit Profile
      </Button>
    </div>
  </PopoverContent>
</Popover>
            </div>  
            </CardContent>
          </MagicCard>
        </motion.div>
      </main>
    </div>
  );
}
