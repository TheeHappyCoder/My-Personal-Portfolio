"use client";

import Image, { type StaticImageData } from "next/image";
import { MoreHorizontal, X } from "lucide-react";
import { useState } from "react";
import profilePhoto from "@/assets/profile/profile.jpg";

type PhotoItem = { src: string | StaticImageData; label: string; category: string };

const photos: PhotoItem[] = [
  { src: profilePhoto, label: "Mark, currently not debugging", category: "People" },
  { src: "/practly/overview.png", label: "Practly practice operations", category: "Work" },
  { src: "/lawFirm/1.webp", label: "Legal operations dashboard", category: "Work" },
  { src: "/droplet/2.png", label: "Droplet local hand-off", category: "Experiments" },
  { src: "/websites/abt-home.png", label: "Africa Building Technologies", category: "Websites" },
  { src: "/websites/botha-home.png", label: "Botha Partners", category: "Websites" },
  { src: "/websites/tagon.png", label: "Tagon", category: "Websites" },
];

export function PhotosApp() {
  const [selected, setSelected] = useState<PhotoItem | null>(null);

  return (
    <div className="photos-app">
      <header><div><span>Collection</span><h2>Portfolio memories</h2></div><button type="button" aria-label="Photo options"><MoreHorizontal size={18} /></button></header>
      <div className="photo-grid">
        {photos.map((photo, index) => (
          <button type="button" key={`${photo.label}-${index}`} onClick={() => setSelected(photo)} className={index === 0 ? "portrait" : index === 1 || index === 4 ? "wide" : ""}>
            <Image src={photo.src} alt={photo.label} fill sizes="(max-width: 700px) 50vw, 280px" />
            <span>{photo.category}</span>
          </button>
        ))}
      </div>
      {selected ? (
        <div className="photo-lightbox">
          <button className="lightbox-close" type="button" onClick={() => setSelected(null)} aria-label="Close photo"><X size={18} /></button>
          <div className="lightbox-image"><Image src={selected.src} alt={selected.label} fill sizes="80vw" /></div>
          <p>{selected.label}</p>
        </div>
      ) : null}
    </div>
  );
}
