"use client";

import { Check, ChevronRight, ExternalLink, Linkedin, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { profile } from "@/data/portfolio";

export function ContactApp() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard?.writeText(profile.email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="contact-app">
      <div className="contact-hero">
        <span>Start something useful</span>
        <h2>Good systems begin with a clear conversation.</h2>
        <p>Product build, interface overhaul, automation challenge, or weird idea with real potential.</p>
        <a className="win-button primary" href={`mailto:${profile.email}?subject=Project%20idea%20for%20Mark`}><Mail size={16} /> Email Mark</a>
      </div>
      <div className="contact-options">
        <button type="button" onClick={copyEmail}><span className="contact-icon blue">{copied ? <Check /> : <Mail />}</span><div><small>Email</small><b>{copied ? "Copied to clipboard" : profile.email}</b></div><ChevronRight /></button>
        <a href={profile.linkedin} target="_blank" rel="noreferrer"><span className="contact-icon linkedin"><Linkedin /></span><div><small>LinkedIn</small><b>Connect with Mark</b></div><ExternalLink /></a>
        <div><span className="contact-icon map"><MapPin /></span><div><small>Based in</small><b>{profile.location}</b></div></div>
      </div>
      <div className="contact-footer-note"><span /><p>{profile.availability}</p></div>
    </div>
  );
}
