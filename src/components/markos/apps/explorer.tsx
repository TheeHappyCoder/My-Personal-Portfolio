"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ChevronRight, MoreHorizontal, RefreshCw } from "lucide-react";
import { useState } from "react";
import { labProjects, projects } from "@/data/portfolio";
import { WindowsAsset } from "../shared/windows-asset";
import type { PortfolioAppProps } from "./types";

export function ExplorerApp({ onOpenApp, onOpenProject }: PortfolioAppProps) {
  const [section, setSection] = useState<"projects" | "lab" | "documents">("projects");
  const title = section === "projects" ? "Selected work" : section === "lab" ? "The lab" : "Documents";

  return (
    <div className="explorer-app">
      <aside className="explorer-sidebar">
        <div className="explorer-sidebar-title"><WindowsAsset name="explorer" size={20} /> Mark&apos;s files</div>
        <nav aria-label="File Explorer folders">
          <button className={section === "projects" ? "selected" : ""} type="button" onClick={() => setSection("projects")}><WindowsAsset name="projects" size={18} /> Work</button>
          <button className={section === "lab" ? "selected" : ""} type="button" onClick={() => setSection("lab")}><WindowsAsset name="tools" size={18} /> The lab</button>
          <button className={section === "documents" ? "selected" : ""} type="button" onClick={() => setSection("documents")}><WindowsAsset name="documents" size={18} /> Documents</button>
        </nav>
        <div className="explorer-drive"><WindowsAsset name="windowsDrive" size={19} /><span><b>MarkOS (C:)</b><small>Curiosity mostly full</small></span></div>
      </aside>

      <main className="explorer-main">
        <div className="explorer-toolbar">
          <button type="button" aria-label="Back"><ArrowLeft size={16} /></button>
          <button type="button" aria-label="Forward"><ArrowRight size={16} /></button>
          <button type="button" aria-label="Refresh"><RefreshCw size={15} /></button>
          <div className="address-bar"><WindowsAsset name="pc" size={16} /><ChevronRight size={13} /><span>Mark</span><ChevronRight size={13} /><b>{title}</b></div>
          <button type="button" aria-label="More options"><MoreHorizontal size={17} /></button>
        </div>

        <div className="explorer-body">
          <div className="explorer-heading">
            <div><p>This PC / Mark</p><h2>{title}</h2></div>
            <span>{section === "projects" ? `${projects.length} items` : section === "lab" ? `${labProjects.length} items` : "3 items"}</span>
          </div>

          {section === "projects" ? (
            <div className="file-card-grid">
              {projects.map((project) => (
                <button className="project-file-card" type="button" key={project.slug} onDoubleClick={() => onOpenProject(project.slug)} onClick={() => onOpenProject(project.slug)}>
                  <div className="project-file-preview"><Image src={project.cover} alt="" fill sizes="260px" /><span>{project.status}</span></div>
                  <div className="project-file-copy"><b>{project.title}</b><small>{project.eyebrow}</small></div>
                </button>
              ))}
            </div>
          ) : null}

          {section === "lab" ? (
            <div className="details-list">
              {labProjects.map((project) => (
                <article key={project.title}>
                  <div className="file-type-icon lab"><WindowsAsset name="folder" size={29} /></div>
                  <div><b>{project.title}</b><small>{project.type}</small><p>{project.note}</p><div className="mini-tags">{project.tech.map((tech) => <span key={tech}>{tech}</span>)}</div></div>
                </article>
              ))}
              <article>
                <div className="file-type-icon"><WindowsAsset name="notepad" size={30} shortcut /></div>
                <div><b>more-ideas-than-weekends.txt</b><small>Text document</small><p>Open Notepad for prototypes, jokes, and suspiciously specific thoughts.</p><button className="text-action" type="button" onClick={() => onOpenApp("notepad")}>Open in Notepad</button></div>
              </article>
            </div>
          ) : null}

          {section === "documents" ? (
            <div className="documents-grid">
              <button type="button" onClick={() => onOpenApp("resume")}><div className="file-type-icon pdf"><WindowsAsset name="file" size={39} /></div><b>Mark-Steyn-CV.pdf</b><small>PDF document</small></button>
              <button type="button" onClick={() => onOpenApp("about")}><div className="file-type-icon"><WindowsAsset name="user" size={42} /></div><b>About Mark</b><small>File folder</small></button>
              <button type="button" onClick={() => onOpenApp("contact")}><div className="file-type-icon mail"><WindowsAsset name="network" size={40} shortcut /></div><b>Contact.url</b><small>Internet shortcut</small></button>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
