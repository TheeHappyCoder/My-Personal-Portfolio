"use client";

import {
  Beaker,
  BadgeCheck,
  ChevronRight,
  ExternalLink,
  FileText,
  FolderKanban,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { labProjects, projects, type PortfolioProject } from "@/data/portfolio";
import { ProjectMedia } from "../shared/project-media";
import { WindowsAsset } from "../shared/windows-asset";
import type { PortfolioAppProps } from "./types";

type ShowcaseSection = "showcase" | "lab" | "documents";
const filters = ["All", "Flagship", "Product", "Client work", "Experiment"] as const;
type ProjectFilter = (typeof filters)[number];

function ProjectCover({ project, eager = false }: { project: PortfolioProject; eager?: boolean }) {
  const src = project.coverVideo ?? project.cover ?? project.gallery[0];

  if (!src) return <span className="project-cover-empty"><WindowsAsset name="projects" size={42} /></span>;

  const kind = project.coverVideo ? "video" : "image";
  return (
    <ProjectMedia
      kind={kind}
      src={src}
      alt={`${project.title} interface preview`}
      mode="cover"
      sizes="(max-width: 680px) 100vw, 58vw"
      loading={eager ? "eager" : "lazy"}
      autoPlay={kind === "video"}
      loop={kind === "video"}
      decorative={kind === "video"}
    />
  );
}

export function ExplorerApp({ onOpenApp, onOpenProject }: PortfolioAppProps) {
  const [section, setSection] = useState<ShowcaseSection>("showcase");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ProjectFilter>("All");
  const featured = projects[0];

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesFilter = filter === "All" || project.status === filter;
      const searchable = `${project.title} ${project.eyebrow} ${project.summary} ${project.tech.join(" ")}`.toLowerCase();
      return matchesFilter && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [filter, query]);

  const showFeatured = section === "showcase" && filter === "All" && !query.trim() && Boolean(featured);
  const collectionProjects = showFeatured && featured ? filteredProjects.filter((project) => project.slug !== featured.slug) : filteredProjects;
  const sectionLabel = section === "showcase" ? "Selected work" : section === "lab" ? "The lab" : "Documents";

  return (
    <div className="showcase-hub">
      <aside className="showcase-sidebar">
        <div className="showcase-brand">
          <WindowsAsset name="projects" size={27} />
          <span><b>My work</b><small>Project showcase</small></span>
        </div>

        <nav aria-label="Showcase sections">
          <button className={section === "showcase" ? "selected" : ""} type="button" onClick={() => setSection("showcase")}><FolderKanban size={17} /> Showcase</button>
          <button className={section === "lab" ? "selected" : ""} type="button" onClick={() => setSection("lab")}><Beaker size={17} /> The lab</button>
          <button className={section === "documents" ? "selected" : ""} type="button" onClick={() => setSection("documents")}><FileText size={17} /> Documents</button>
        </nav>

        <div className="showcase-sidebar-note">
          <BadgeCheck size={15} />
          <span><b>{projects.length} shipped projects</b><small>Products, platforms, and client work</small></span>
        </div>
      </aside>

      <main className="showcase-main">
        <header className="showcase-toolbar">
          <div className="showcase-breadcrumb"><WindowsAsset name="pc" size={16} /><ChevronRight size={13} /><span>Mark</span><ChevronRight size={13} /><b>{sectionLabel}</b></div>
          {section === "showcase" ? (
            <label className="showcase-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects" aria-label="Search projects" /></label>
          ) : null}
        </header>

        <div className="showcase-scroll">
          {section === "showcase" ? (
            <div className="showcase-work">
              <header className="showcase-intro">
                <div><span>Selected work</span><h2>Systems built for real operations.</h2><p>Products, operational platforms, and client sites. Open a project for its interface, scope, and engineering decisions.</p></div>
                <strong>{filteredProjects.length}<small>{filteredProjects.length === 1 ? "project" : "projects"}</small></strong>
              </header>

              {showFeatured && featured ? (
                <article className="showcase-featured">
                  <button className="showcase-featured-media" type="button" onClick={() => onOpenProject(featured.slug)} aria-label={`Open ${featured.title} case study`}>
                    <ProjectCover project={featured} eager />
                    <span><WindowsAsset name="projects" size={18} /> Open flagship case study <ChevronRight size={15} /></span>
                  </button>
                  <div className="showcase-featured-copy">
                    <div className="showcase-kicker"><span>{featured.status}</span><small>{featured.year}</small></div>
                    <h3>{featured.title}</h3>
                    <p className="showcase-featured-eyebrow">{featured.eyebrow}</p>
                    <p>{featured.summary}</p>
                    {featured.metrics?.length ? (
                      <div className="showcase-featured-metrics">
                        {featured.metrics.slice(0, 3).map((metric) => <span key={metric.label}><b>{metric.value}</b><small>{metric.label}</small></span>)}
                      </div>
                    ) : null}
                    <div className="showcase-featured-actions">
                      <button className="win-button primary" type="button" onClick={() => onOpenProject(featured.slug)}>Explore {featured.title}</button>
                      {featured.liveUrl ? <a className="win-button" href={featured.liveUrl} target="_blank" rel="noreferrer">Visit live site <ExternalLink size={13} /></a> : null}
                    </div>
                  </div>
                </article>
              ) : null}

              <div className="showcase-collection-heading">
                <div><h3>{showFeatured ? "More selected work" : "Project results"}</h3><p>Choose a category or search by product, client, or technology.</p></div>
                <div className="showcase-filters" role="group" aria-label="Filter projects">
                  {filters.map((item) => <button type="button" key={item} className={filter === item ? "selected" : ""} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}
                </div>
              </div>

              {collectionProjects.length ? (
                <div className="showcase-project-grid">
                  {collectionProjects.map((project) => (
                    <button className="showcase-project-card" type="button" key={project.slug} onClick={() => onOpenProject(project.slug)}>
                      <span className="showcase-project-image"><ProjectCover project={project} /><i>{project.status}</i></span>
                      <span className="showcase-project-copy">
                        <span><b>{project.title}</b><small>{project.year}</small></span>
                        <em>{project.eyebrow}</em>
                        <p>{project.summary}</p>
                        <span className="showcase-project-footer"><span>{project.tech.slice(0, 2).join(" · ")}</span><span>View project <ChevronRight size={13} /></span></span>
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="showcase-empty"><Search size={24} /><h3>No matching work</h3><p>Try another category or a broader search.</p><button className="win-button" type="button" onClick={() => { setQuery(""); setFilter("All"); }}>Show all projects</button></div>
              )}
            </div>
          ) : null}

          {section === "lab" ? (
            <section className="showcase-secondary-view">
              <header><span>In progress</span><h2>The lab</h2><p>Ideas being tested before they earn a place in selected work.</p></header>
              <div className="details-list">
                {labProjects.map((project) => (
                  <article key={project.title}>
                    <div className="file-type-icon lab"><WindowsAsset name="folder" size={29} /></div>
                    <div><b>{project.title}</b><small>{project.type}</small><p>{project.note}</p><div className="mini-tags">{project.tech.map((tech) => <span key={tech}>{tech}</span>)}</div></div>
                  </article>
                ))}
                <article>
                  <div className="file-type-icon"><WindowsAsset name="notepad" size={30} shortcut /></div>
                  <div><b>reminders.txt</b><small>Text document</small><p>Loose reminders, calculations, and unfinished notes.</p><button className="text-action" type="button" onClick={() => onOpenApp("notepad")}>Open in Notepad</button></div>
                </article>
              </div>
            </section>
          ) : null}

          {section === "documents" ? (
            <section className="showcase-secondary-view">
              <header><span>Useful files</span><h2>Documents</h2><p>Resume, background, and direct contact routes.</p></header>
              <div className="documents-grid">
                <button type="button" onClick={() => onOpenApp("resume")}><div className="file-type-icon pdf"><WindowsAsset name="file" size={39} /></div><b>Mark-Steyn-CV.pdf</b><small>PDF document</small></button>
                <button type="button" onClick={() => onOpenApp("about")}><div className="file-type-icon"><WindowsAsset name="user" size={42} /></div><b>About Mark</b><small>Profile folder</small></button>
                <button type="button" onClick={() => onOpenApp("contact")}><div className="file-type-icon mail"><WindowsAsset name="network" size={40} shortcut /></div><b>Contact.url</b><small>Open contact app</small></button>
              </div>
            </section>
          ) : null}
        </div>
      </main>
    </div>
  );
}
