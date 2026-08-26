"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export type ProjectMediaKind = "image" | "video";
export type ProjectMediaMode = "cover" | "stage" | "thumbnail" | "gallery" | "lightbox";

type ProjectMediaProps = {
  kind: ProjectMediaKind;
  src: string;
  alt: string;
  mode: ProjectMediaMode;
  sizes?: string;
  loading?: "eager" | "lazy";
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  decorative?: boolean;
  onEnded?: () => void;
};

function ProjectVideo({
  src,
  alt,
  mode,
  autoPlay = false,
  controls = false,
  loop = false,
  decorative = false,
  onEnded,
}: Omit<ProjectMediaProps, "kind" | "sizes" | "loading">) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (!autoPlay || reducedMotion.matches) {
        video.pause();
        return;
      }

      void video.play().catch(() => {
        // Browser controls remain available when autoplay policy blocks playback.
      });
    };

    syncPlayback();
    reducedMotion.addEventListener("change", syncPlayback);
    return () => reducedMotion.removeEventListener("change", syncPlayback);
  }, [autoPlay, src]);

  return (
    <video
      ref={videoRef}
      className="project-video"
      data-media-mode={mode}
      controls={controls}
      loop={loop}
      muted={autoPlay}
      playsInline
      preload="metadata"
      aria-label={decorative ? undefined : alt}
      aria-hidden={decorative || undefined}
      tabIndex={controls ? 0 : -1}
      onEnded={onEnded}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support embedded video.
    </video>
  );
}

export function ProjectMedia({
  kind,
  src,
  alt,
  mode,
  sizes = "100vw",
  loading = "lazy",
  ...videoProps
}: ProjectMediaProps) {
  if (kind === "video") {
    return <ProjectVideo src={src} alt={alt} mode={mode} {...videoProps} />;
  }

  return <Image src={src} alt={alt} fill sizes={sizes} loading={loading} />;
}
