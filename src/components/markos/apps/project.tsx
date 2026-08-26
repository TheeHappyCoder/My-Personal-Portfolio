"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  ExternalLink,
  FolderOpen,
  Images,
  Maximize2,
  Play,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type CSSProperties, type KeyboardEvent } from "react";
import { getPortfolioProject } from "@/data/portfolio";
import { ProjectMedia, type ProjectMediaKind } from "../shared/project-media";
import type { OpenApp } from "./types";

type DetailTab = "overview" | "scope" | "stack";
type ProjectAppProps = { slug: string; onOpenApp: OpenApp };
type ShowcaseMedia = {
  kind: ProjectMediaKind;
  src: string;
  title: string;
  description?: string;
  duration?: string;
};

export function ProjectApp(props: ProjectAppProps) {
  return <ProjectAppContent key={props.slug} {...props} />;
}

function ProjectAppContent({ slug, onOpenApp }: ProjectAppProps) {
  const project = getPortfolioProject(slug);
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!project) {
    return <div className="empty-app"><FolderOpen size={36} /><h2>Project moved</h2><p>This shortcut points somewhere mysterious.</p></div>;
  }

  const media: ShowcaseMedia[] = [
    ...(project.tour?.steps.map((step) => ({
      kind: "video" as const,
      src: step.src,
      title: step.title,
      description: step.description,
      duration: step.duration,
    })) ?? []),
    ...project.gallery.map((image, index) => ({
      kind: "image" as const,
      src: image,
      title: project.galleryLabels?.[index] ?? `Screenshot ${index + 1}`,
    })),
  ];
  const activeIndex = Math.min(selectedMedia, Math.max(media.length - 1, 0));
  const currentMedia = media[activeIndex];
  const tourLength = project.tour?.steps.length ?? 0;
  const MediaIcon = tourLength ? Clapperboard : Images;
  const changeMedia = (direction: number) => {
    if (!media.length) return;
    setSelectedMedia((current) => (current + direction + media.length) % media.length);
  };
  const handleKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLVideoElement) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      changeMedia(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      changeMedia(1);
    }
    if (event.key === "Escape" && lightboxOpen) {
      event.preventDefault();
      setLightboxOpen(false);
    }
  };
  const advanceTour = () => {
    if (activeIndex < tourLength - 1) setSelectedMedia(activeIndex + 1);
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
          <div className="project-media-stage" data-media-kind={currentMedia?.kind} tabIndex={0} aria-label={`${currentMedia?.title ?? "Project media"}. Use left and right arrow keys to browse.`}>
            {currentMedia ? (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  className="project-media-frame"
                  key={currentMedia.src}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16 }}
                >
                  <ProjectMedia
                    kind={currentMedia.kind}
                    src={currentMedia.src}
                    alt={`${project.title}: ${currentMedia.title}`}
                    mode="stage"
                    sizes="(max-width: 680px) 100vw, 68vw"
                    loading="eager"
                    autoPlay={!lightboxOpen && currentMedia.kind === "video"}
                    controls={currentMedia.kind === "video"}
                    onEnded={currentMedia.kind === "video" ? advanceTour : undefined}
                  />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="project-media-empty">Fresh product media coming soon.</div>
            )}
            {currentMedia ? <div className="project-media-count"><MediaIcon size={14} /><span>{activeIndex + 1} / {media.length}</span></div> : null}
            {currentMedia ? <button className="project-media-expand" type="button" onClick={() => setLightboxOpen(true)} aria-label="Open media fullscreen"><Maximize2 size={16} /> Expand</button> : null}
            {media.length > 1 ? (
              <div className="project-media-navigation">
                <button type="button" onClick={() => changeMedia(-1)} aria-label="Previous media"><ChevronLeft size={19} /></button>
                <button type="button" onClick={() => changeMedia(1)} aria-label="Next media"><ChevronRight size={19} /></button>
              </div>
            ) : null}
          </div>

          {currentMedia ? (
            <div className="project-media-caption">
              <span>
                <b>{String(activeIndex + 1).padStart(2, "0")}</b>
                <span className="project-media-caption-copy"><strong>{currentMedia.title}</strong>{currentMedia.description ? <small>{currentMedia.description}</small> : null}</span>
              </span>
              <small>{currentMedia.duration ? `${currentMedia.duration} guided demo` : "Interface detail"}</small>
            </div>
          ) : <div />}

          <div className={`project-thumbnail-rail ${tourLength ? "has-tour" : ""}`} aria-label={`${project.title} ${tourLength ? "guided video tour" : "media gallery"}`}>
            {media.map((item, index) => {
              return (
                <button
                  className={`${activeIndex === index ? "selected" : ""} ${item.kind === "video" ? "video" : ""}`}
                  key={item.src}
                  type="button"
                  onClick={() => setSelectedMedia(index)}
                  aria-label={`Show ${item.title}`}
                  aria-pressed={activeIndex === index}
                  title={item.title}
                >
                  {item.kind === "video" ? (
                    <span className="project-tour-thumbnail">
                      <span className="project-tour-play"><Play size={15} fill="currentColor" /></span>
                      <span className="project-tour-thumbnail-copy"><b>{item.title}</b><small>{item.duration}</small></span>
                    </span>
                  ) : <ProjectMedia kind="image" src={item.src} alt="" mode="thumbnail" sizes="144px" decorative />}
                  <span className="project-thumbnail-number">{String(index + 1).padStart(2, "0")}</span>
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
                    <div><dt>Visual proof</dt><dd>{tourLength ? `${tourLength} guided videos` : `${media.length} ${media.length === 1 ? "screen" : "screens"}`}</dd></div>
                    <div><dt>Delivery</dt><dd>{project.liveUrl ? "Live product" : "Private product"}</dd></div>
                  </dl>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>

      <AnimatePresence>
        {lightboxOpen && currentMedia ? (
          <motion.div className="project-lightbox" role="dialog" aria-modal="true" aria-label={`${project.title} media viewer`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}>
            <button className="project-lightbox-close" type="button" onClick={() => setLightboxOpen(false)} aria-label="Close fullscreen media"><X size={19} /> Close</button>
            {media.length > 1 ? <button className="project-lightbox-previous" type="button" onClick={() => changeMedia(-1)} aria-label="Previous media"><ChevronLeft size={24} /></button> : null}
            <div className="project-lightbox-image">
              <ProjectMedia
                key={currentMedia.src}
                kind={currentMedia.kind}
                src={currentMedia.src}
                alt={`${project.title}: ${currentMedia.title}`}
                mode="lightbox"
                sizes="100vw"
                loading="eager"
                autoPlay={currentMedia.kind === "video"}
                controls={currentMedia.kind === "video"}
                onEnded={currentMedia.kind === "video" ? advanceTour : undefined}
              />
            </div>
            {media.length > 1 ? <button className="project-lightbox-next" type="button" onClick={() => changeMedia(1)} aria-label="Next media"><ChevronRight size={24} /></button> : null}
            <div className="project-lightbox-caption"><span>{activeIndex + 1} / {media.length}</span><b>{currentMedia.title}</b><small><ArrowLeft size={13} /> Arrow keys <ArrowRight size={13} /></small></div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
