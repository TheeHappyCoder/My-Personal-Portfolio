import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getPortfolioProject, projects } from "@/data/portfolio";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ShareableProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getPortfolioProject(slug);
  if (!project) notFound();

  return (
    <main className="share-page">
      <nav className="share-nav">
        <Link href="/"><ArrowLeft size={16} /> Back to MarkOS</Link>
        <span>Mark Steyn / Selected work</span>
      </nav>

      <header className="share-hero" style={{ backgroundColor: project.accent }}>
        <Image src={project.cover} alt={`${project.title} interface`} fill loading="eager" sizes="100vw" />
        <div />
        <section>
          <span>{project.status}</span>
          <h1>{project.title}</h1>
          <p>{project.eyebrow}</p>
        </section>
      </header>

      <article className="share-story">
        <div className="share-meta">
          <span><b>Role</b>{project.role}</span>
          <span><b>Timeline</b>{project.year}</span>
          {project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noreferrer">
              Visit live site <ArrowUpRight size={15} />
            </a>
          ) : null}
        </div>
        <p className="share-lede">{project.summary}</p>

        {project.metrics?.length ? (
          <section className="share-metrics" aria-label={`${project.title} project facts`}>
            {project.metrics.map((metric) => (
              <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>
            ))}
          </section>
        ) : null}

        <div className="share-problem-grid">
          <section><span>01</span><h2>Problem</h2><p>{project.problem}</p></section>
          <section><span>02</span><h2>Response</h2><p>{project.solution}</p></section>
        </div>

        {project.scope?.length ? (
          <section className="share-scope">
            <div className="share-section-heading"><span>Product scope</span><h2>{project.scopeHeading ?? "What shipped."}</h2></div>
            <div className="share-scope-grid">
              {project.scope.map((item, index) => (
                <article key={item.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="share-tech">
          <p>Built with</p>
          <div>{project.tech.map((tech) => <span key={tech}>{tech}</span>)}</div>
        </section>

        <section className="share-gallery">
          <div className="share-section-heading"><span>Gallery</span><h2>Interface details</h2></div>
          {project.gallery.map((image, index) => (
            <figure className="share-gallery-item" key={image}>
              <div className="share-gallery-image">
                <Image src={image} alt={project.galleryLabels?.[index] ?? `${project.title} screenshot ${index + 1}`} fill sizes="(max-width: 900px) 100vw, 1100px" />
              </div>
              {project.galleryLabels?.[index] ? <figcaption>{project.galleryLabels[index]}</figcaption> : null}
            </figure>
          ))}
        </section>

        <footer className="share-footer">
          <div><span>Have an interesting system?</span><h2>Let&apos;s make it feel obvious.</h2></div>
          <a href="mailto:marksteyn1001@gmail.com?subject=Project%20idea%20for%20Mark">Email Mark <ArrowUpRight size={17} /></a>
        </footer>
      </article>
    </main>
  );
}
