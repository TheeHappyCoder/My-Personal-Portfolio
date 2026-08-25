"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FolderOpen,
  Images,
  Maximize2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type CSSProperties, type KeyboardEvent } from "react";
import { getPortfolioProject } from "@/data/portfolio";
import type { OpenApp } from "./types";

type DetailTab = "overview" | "scope" | "stack";

export function ProjectApp({ slug, onOpenApp }: { slug: string; onOpenApp: OpenApp }) {
  const project = getPortfolioProject(slug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!project) {
    return <div className="empty-app"><FolderOpen size={36} /><h2>Project moved</h2><p>This shortcut points somewhere mysterious.</p></div>;
  }

  const galleryLabel = project.galleryLabels?.[selectedImage] ?? `Screenshot ${selectedImage + 1}`;
  const changeImage = (direction: number) => {
    setSelectedImage((current) => (current + direction + project.gallery.length) % project.gallery.length);
  };
  const handleKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      changeImage(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      changeImage(1);
    }
    if (event.key === "Escape" && lightboxOpen) {
      event.preventDefault();
      setLightboxOpen(false);
    }
  };

  const style = { "--project-accent": project.accent } as CSSProperties;

  return (
    <div className="project-showcase-app" style={style} onKeyDown={handleKeys}>
      <header className="project-showcase-toolbar">
        <button type="button" onClick={() => onOpenApp("explorer")}><ArrowLeft size={15} /> All work</button>
        <div className="project-showcase-path"><span>Projects</span><ChevronRight size={12} /><b>{project.title}</b></div>
        <div className="project-showcase-actions">
          <Link href={`/projects/${project.slug}`} target="_blank">Full case study <ExternalLink size={13} /></Link>
          {project.liveUrl ? <a className="primary" href={project.liveUrl} target="_blank" rel="noreferrer">View live <ExternalLink size={13} /></a> : null}
        </div>
      </header>

      <div className="project-showcase-layout">
        <section className="project-media-panel" aria-label={`${project.title} visual showcase`}>
          <div className="project-media-stage" tabIndex={0} aria-label={`${galleryLabel}. Use left and right arrow keys to browse.`}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                className="project-media-frame"
                key={project.gallery[selectedImage]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
              >
                <Image src={project.gallery[selectedImage]} alt={`${project.title}: ${galleryLabel}`} fill loading="eager" sizes="(max-width: 680px) 100vw, 68vw" />
              </motion.div>
            </AnimatePresence>
            <div className="project-media-count"><Images size={14} /><span>{selectedImage + 1} / {project.gallery.length}</span></div>
            <button className="project-media-expand" type="button" onClick={() => setLightboxOpen(true)} aria-label="Open screenshot fullscreen"><Maximize2 size={16} /> Expand</button>
            {project.gallery.length > 1 ? (
              <div className="project-media-navigation">
                <button type="button" onClick={() => changeImage(-1)} aria-label="Previous screenshot"><ChevronLeft size={19} /></button>
                <button type="button" onClick={() => changeImage(1)} aria-label="Next screenshot"><ChevronRight size={19} /></button>
              </div>
            ) : null}
          </div>

          <div className="project-media-caption">
            <span><b>{String(selectedImage + 1).padStart(2, "0")}</b><span>{galleryLabel}</span></span>
            <small>Use arrow keys or select another frame</small>
          </div>

          <div className="project-thumbnail-rail" aria-label={`${project.title} screenshot gallery`}>
            {project.gallery.map((image, index) => {
              const label = project.galleryLabels?.[index] ?? `Screenshot ${index + 1}`;
              return (
                <button
                  className={selectedImage === index ? "selected" : ""}
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  aria-label={`Show ${label}`}
                  aria-pressed={selectedImage === index}
                  title={label}
                >
                  <Image src={image} alt="" fill sizes="144px" />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="project-inspector">
          <div className="project-inspector-heading">
            <span><i /> {project.status}</span>
            <h2>{project.title}</h2>
            <p>{project.eyebrow}</p>
          </div>

          <dl className="project-inspector-meta">
            <div><dt>Role</dt><dd>{project.role}</dd></div>
            <div><dt>Timeline</dt><dd>{project.year}</dd></div>
          </dl>

          <div className="project-detail-tabs" role="tablist" aria-label="Project details">
            <button type="button" role="tab" aria-selected={activeTab === "overview"} className={activeTab === "overview" ? "selected" : ""} onClick={() => setActiveTab("overview")}>Overview</button>
            {project.scope?.length ? <button type="button" role="tab" aria-selected={activeTab === "scope"} className={activeTab === "scope" ? "selected" : ""} onClick={() => setActiveTab("scope")}>Scope</button> : null}
            <button type="button" role="tab" aria-selected={activeTab === "stack"} className={activeTab === "stack" ? "selected" : ""} onClick={() => setActiveTab("stack")}>Stack</button>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="project-detail-content"
              key={activeTab}
              role="tabpanel"
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
            >
              {activeTab === "overview" ? (
                <>
                  <p className="project-inspector-summary">{project.summary}</p>
                  {project.metrics?.length ? (
                    <div className="project-fact-grid">
                      {project.metrics.map((metric) => <div key={metric.label}><b>{metric.value}</b><span>{metric.label}</span></div>)}
                    </div>
                  ) : null}
                  <article className="project-story-block"><span>01</span><h3>The challenge</h3><p>{project.problem}</p></article>
                  <article className="project-story-block"><span>02</span><h3>The response</h3><p>{project.solution}</p></article>
                </>
              ) : null}

              {activeTab === "scope" ? (
                <div className="project-scope-panel">
                  <h3>{project.scopeHeading ?? "What shipped"}</h3>
                  {project.scope?.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><div><b>{item.title}</b><p>{item.detail}</p></div></article>)}
                </div>
              ) : null}

              {activeTab === "stack" ? (
                <div className="project-stack-panel">
                  <h3>Technology behind the work</h3>
                  <p>The tools and systems selected to make this product real.</p>
                  <div>{project.tech.map((tech) => <span key={tech}>{tech}</span>)}</div>
                  <dl>
                    <div><dt>Project type</dt><dd>{project.status}</dd></div>
                    <div><dt>Visual proof</dt><dd>{project.gallery.length} {project.gallery.length === 1 ? "screen" : "screens"}</dd></div>
                    <div><dt>Delivery</dt><dd>{project.liveUrl ? "Live product" : "Private product"}</dd></div>
                  </dl>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>

      <AnimatePresence>
        {lightboxOpen ? (
          <motion.div className="project-lightbox" role="dialog" aria-modal="true" aria-label={`${project.title} screenshot viewer`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}>
            <button className="project-lightbox-close" type="button" onClick={() => setLightboxOpen(false)} aria-label="Close fullscreen screenshot"><X size={19} /> Close</button>
            {project.gallery.length > 1 ? <button className="project-lightbox-previous" type="button" onClick={() => changeImage(-1)} aria-label="Previous screenshot"><ChevronLeft size={24} /></button> : null}
            <div className="project-lightbox-image"><Image src={project.gallery[selectedImage]} alt={`${project.title}: ${galleryLabel}`} fill sizes="100vw" priority /></div>
            {project.gallery.length > 1 ? <button className="project-lightbox-next" type="button" onClick={() => changeImage(1)} aria-label="Next screenshot"><ChevronRight size={24} /></button> : null}
            <div className="project-lightbox-caption"><span>{selectedImage + 1} / {project.gallery.length}</span><b>{galleryLabel}</b><small><ArrowLeft size={13} /> Arrow keys <ArrowRight size={13} /></small></div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
