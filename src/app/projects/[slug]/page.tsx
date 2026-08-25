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
        <Image src={project.cover} alt={`${project.title} interface`} fill priority sizes="100vw" />
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
        </div>
        <p className="share-lede">{project.summary}</p>

        <div className="share-problem-grid">
          <section><span>01</span><h2>Problem</h2><p>{project.problem}</p></section>
          <section><span>02</span><h2>Response</h2><p>{project.solution}</p></section>
        </div>

        <section className="share-tech">
          <p>Built with</p>
          <div>{project.tech.map((tech) => <span key={tech}>{tech}</span>)}</div>
        </section>

        <section className="share-gallery">
          <div className="share-section-heading"><span>Gallery</span><h2>Interface details</h2></div>
          {project.gallery.map((image, index) => (
            <div className="share-gallery-image" key={image}>
              <Image src={image} alt={`${project.title} screenshot ${index + 1}`} fill sizes="(max-width: 900px) 100vw, 1100px" />
            </div>
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
