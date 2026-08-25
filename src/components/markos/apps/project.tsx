"use client";

import Image from "next/image";
import { FolderOpen, ImageIcon } from "lucide-react";
import { useState } from "react";
import { getPortfolioProject } from "@/data/portfolio";

export function ProjectApp({ slug }: { slug: string }) {
  const project = getPortfolioProject(slug);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!project) return <div className="empty-app"><FolderOpen size={36} /><h2>Project moved</h2><p>This shortcut points somewhere mysterious.</p></div>;

  return (
    <div className="project-app">
      <div className="project-app-hero" style={{ backgroundColor: project.accent }}>
        <Image src={project.gallery[selectedImage]} alt={`${project.title} interface`} fill sizes="(max-width: 900px) 100vw, 70vw" />
        <div className="project-app-hero-overlay" />
        <div className="project-app-heading"><span>{project.status}</span><h2>{project.title}</h2><p>{project.eyebrow}</p></div>
      </div>

      <div className="project-app-layout">
        <section className="project-app-story">
          <div className="project-meta"><span><b>Role</b>{project.role}</span><span><b>Timeline</b>{project.year}</span></div>
          <p className="project-lede">{project.summary}</p>
          <div className="problem-solution-grid">
            <article><span>01</span><h3>Problem</h3><p>{project.problem}</p></article>
            <article><span>02</span><h3>Response</h3><p>{project.solution}</p></article>
          </div>
          <div className="project-tech"><h3>Built with</h3><div>{project.tech.map((tech) => <span key={tech}>{tech}</span>)}</div></div>
        </section>

        <aside className="project-gallery-strip" aria-label={`${project.title} screenshots`}>
          <div className="project-gallery-label"><ImageIcon size={15} /> Gallery <span>{selectedImage + 1}/{project.gallery.length}</span></div>
          {project.gallery.map((image, index) => (
            <button className={selectedImage === index ? "selected" : ""} key={image} type="button" onClick={() => setSelectedImage(index)} aria-label={`Show screenshot ${index + 1}`}>
              <Image src={image} alt="" fill sizes="160px" />
            </button>
          ))}
        </aside>
      </div>
    </div>
  );
}
