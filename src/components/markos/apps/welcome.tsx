import Image from "next/image";
import { ChevronRight, Code2, FileText, FolderOpen, Mail, Sparkles, UserRound } from "lucide-react";
import profilePhoto from "@/assets/profile/profile.jpg";
import { profile } from "@/data/portfolio";
import type { OpenApp } from "./types";

export function WelcomeApp({ onOpenApp }: { onOpenApp: OpenApp }) {
  return (
    <div className="welcome-app">
      <div className="welcome-photo-panel">
        <Image src={profilePhoto} alt="Mark Steyn smiling" fill priority sizes="(max-width: 700px) 100vw, 38vw" />
        <div className="welcome-photo-shade" />
        <div className="welcome-photo-copy">
          <span className="status-pill"><span /> Available for good ideas</span>
          <p>Pretoria, South Africa</p>
        </div>
      </div>

      <div className="welcome-copy">
        <div className="welcome-kicker"><Sparkles size={15} /> Welcome to MarkOS</div>
        <h1>Software for people.<br />Systems for places.</h1>
        <p>{profile.intro}</p>

        <div className="welcome-actions">
          <button className="win-button primary" type="button" onClick={() => onOpenApp("explorer")}><FolderOpen size={16} /> Explore my work</button>
          <button className="win-button" type="button" onClick={() => onOpenApp("about")}><UserRound size={16} /> Meet Mark</button>
        </div>

        <div className="quick-route-grid">
          <button type="button" onClick={() => onOpenApp("skills")}><Code2 size={18} /><span><b>Skills</b><small>What I build with</small></span><ChevronRight size={15} /></button>
          <button type="button" onClick={() => onOpenApp("resume")}><FileText size={18} /><span><b>Resume</b><small>One-page version</small></span><ChevronRight size={15} /></button>
          <button type="button" onClick={() => onOpenApp("contact")}><Mail size={18} /><span><b>Contact</b><small>Start a conversation</small></span><ChevronRight size={15} /></button>
        </div>
      </div>
    </div>
  );
}
