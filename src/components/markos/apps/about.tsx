import Image from "next/image";
import { BriefcaseBusiness, FileText, GraduationCap, Mail, MapPin, Wifi } from "lucide-react";
import profilePhoto from "@/assets/profile/profile.jpg";
import { education, experience, profile } from "@/data/portfolio";
import type { OpenApp } from "./types";

export function AboutApp({ onOpenApp }: { onOpenApp: OpenApp }) {
  return (
    <div className="about-app">
      <header className="about-profile-card">
        <div className="about-avatar"><Image src={profilePhoto} alt="Mark Steyn" fill sizes="180px" /></div>
        <div><span>System profile</span><h2>{profile.name}</h2><p>{profile.title}</p><div className="about-meta"><span><MapPin size={14} /> {profile.location}</span><span><Wifi size={14} /> {profile.availability}</span></div></div>
      </header>

      <div className="about-app-grid">
        <section>
          <div className="section-label"><BriefcaseBusiness size={16} /> Experience</div>
          <div className="timeline-list">
            {experience.map((item) => (
              <article key={`${item.period}-${item.role}`}><span>{item.period}</span><div><h3>{item.role}</h3><b>{item.company}</b><p>{item.detail}</p></div></article>
            ))}
          </div>
        </section>

        <aside>
          <div className="about-quote">“Make the complicated thing feel obvious.”</div>
          <div className="section-label"><GraduationCap size={16} /> Education</div>
          <ul className="education-list">{education.map((item) => <li key={item}>{item}</li>)}</ul>
          <div className="about-action-stack">
            <button className="win-button primary" type="button" onClick={() => onOpenApp("contact")}><Mail size={15} /> Contact Mark</button>
            <button className="win-button" type="button" onClick={() => onOpenApp("resume")}><FileText size={15} /> Open resume</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
