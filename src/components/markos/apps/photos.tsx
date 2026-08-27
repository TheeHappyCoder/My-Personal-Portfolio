"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Camera,
  ImagePlus,
  Images,
  Sparkles,
  X,
} from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import profilePhoto from "@/assets/profile/profile.jpg";

type CollectionId = "life" | "work";
type PhotoSize = "standard" | "wide" | "tall";

type PhotoItem = {
  id: string;
  src: string | StaticImageData;
  title: string;
  caption: string;
  collection: CollectionId;
  tag: string;
  size: PhotoSize;
  local?: boolean;
};

const starterPhotos: PhotoItem[] = [
  {
    id: "portrait",
    src: profilePhoto,
    title: "Portrait, suspiciously professional",
    caption: "Proof that one usable photo can survive a camera roll.",
    collection: "life",
    tag: "Portrait",
    size: "tall",
  },
  {
    id: "friday-deploy",
    src: "/photos/friday-deploy-v2.png",
    title: "Deployed on a Friday",
    caption: "Chair empty. Alerts multiplying. Duck now in charge.",
    collection: "life",
    tag: "Evidence",
    size: "wide",
  },
  {
    id: "duck-review",
    src: "/photos/rubber-duck-review-v2.png",
    title: "Senior code review",
    caption: "No comments. Slightly judgmental silence.",
    collection: "life",
    tag: "Process",
    size: "standard",
  },
  {
    id: "cable-crime",
    src: "/photos/cable-crime-scene-v2.png",
    title: "Cable management, final boss",
    caption: "Six suspects. Zero documentation.",
    collection: "life",
    tag: "Behind the scenes",
    size: "wide",
  },
  {
    id: "practly",
    src: "/practly/overview.png",
    title: "Practly operations",
    caption: "A calmer way to run practice operations.",
    collection: "work",
    tag: "Product",
    size: "wide",
  },
  {
    id: "legal-ops",
    src: "/lawFirm/1.webp",
    title: "Legal operations dashboard",
    caption: "Dense workflows, made easier to scan.",
    collection: "work",
    tag: "Product",
    size: "standard",
  },
  {
    id: "droplet",
    src: "/droplet/2.png",
    title: "Droplet hand-off",
    caption: "Local-first sharing without the ceremony.",
    collection: "work",
    tag: "Experiment",
    size: "standard",
  },
  {
    id: "abt",
    src: "/websites/abt-home.png",
    title: "Africa Building Technologies",
    caption: "A focused home for a technical catalogue.",
    collection: "work",
    tag: "Website",
    size: "wide",
  },
  {
    id: "botha",
    src: "/websites/botha-home.png",
    title: "Botha Partners",
    caption: "Professional services with less visual noise.",
    collection: "work",
    tag: "Website",
    size: "standard",
  },
  {
    id: "tagon",
    src: "/websites/tagon.png",
    title: "Tagon",
    caption: "A compact product story with room to breathe.",
    collection: "work",
    tag: "Website",
    size: "standard",
  },
];

const collections: Array<{
  id: CollectionId;
  label: string;
  description: string;
  icon: typeof Images;
}> = [
  { id: "life", label: "Life lately", description: "The human bits", icon: Sparkles },
  { id: "work", label: "Selected work", description: "Projects only", icon: BriefcaseBusiness },
];

const POP = { type: "spring", stiffness: 400, damping: 26 } as const;
const POP_EXIT = { type: "spring", stiffness: 380, damping: 28 } as const;

export function PhotosApp() {
  const [collection, setCollection] = useState<CollectionId>("life");
  const [uploadedPhotos, setUploadedPhotos] = useState<PhotoItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const objectUrls = useRef<string[]>([]);

  const photos = useMemo(() => [...uploadedPhotos, ...starterPhotos], [uploadedPhotos]);
  const visiblePhotos = useMemo(
    () => photos.filter((photo) => photo.collection === collection),
    [collection, photos],
  );
  const selectedIndex = selectedId
    ? visiblePhotos.findIndex((photo) => photo.id === selectedId)
    : -1;
  const selected = selectedIndex >= 0 ? visiblePhotos[selectedIndex] : null;
  const activeCollection = collections.find((item) => item.id === collection) ?? collections[0];

  useEffect(() => {
    const urls = objectUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  useEffect(() => {
    if (!selected) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
      if (event.key === "ArrowLeft") {
        const previous = (selectedIndex - 1 + visiblePhotos.length) % visiblePhotos.length;
        setSelectedId(visiblePhotos[previous]?.id ?? null);
      }
      if (event.key === "ArrowRight") {
        const next = (selectedIndex + 1) % visiblePhotos.length;
        setSelectedId(visiblePhotos[next]?.id ?? null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected, selectedIndex, visiblePhotos]);

  const selectCollection = (nextCollection: CollectionId) => {
    setCollection(nextCollection);
    setSelectedId(null);
  };

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const added = files.map((file, index): PhotoItem => {
      const url = URL.createObjectURL(file);
      objectUrls.current.push(url);
      return {
        id: `upload-${file.name}-${file.lastModified}-${index}`,
        src: url,
        title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
        caption: "Added from this device. Refreshing clears this preview.",
        collection: "life",
        tag: "Just added",
        size: index % 3 === 0 ? "wide" : "standard",
        local: true,
      };
    });

    setUploadedPhotos((current) => [...added, ...current]);
    setCollection("life");
    event.target.value = "";
  };

  const showPrevious = () => {
    if (selectedIndex < 0) return;
    const previous = (selectedIndex - 1 + visiblePhotos.length) % visiblePhotos.length;
    setSelectedId(visiblePhotos[previous]?.id ?? null);
  };

  const showNext = () => {
    if (selectedIndex < 0) return;
    const next = (selectedIndex + 1) % visiblePhotos.length;
    setSelectedId(visiblePhotos[next]?.id ?? null);
  };

  return (
    <div className="photos-app">
      <aside className="photos-sidebar" aria-label="Photo collections">
        <div className="photos-brand">
          <span aria-hidden="true"><Camera size={17} /></span>
          <div><strong>Photos</strong><small>Mark&apos;s camera roll</small></div>
        </div>

        <nav>
          {collections.map((item) => {
            const Icon = item.icon;
            const selectedCollection = item.id === collection;
            const count = photos.filter((photo) => photo.collection === item.id).length;

            return (
              <button
                type="button"
                key={item.id}
                className={selectedCollection ? "selected" : ""}
                aria-current={selectedCollection ? "page" : undefined}
                onClick={() => selectCollection(item.id)}
              >
                <Icon size={15} aria-hidden="true" />
                <span><b>{item.label}</b><small>{item.description}</small></span>
                <em>{count}</em>
              </button>
            );
          })}
        </nav>

        <p className="photos-sidebar-note">
          Personal photos can replace these stand-ins whenever they are ready.
        </p>
      </aside>

      <main className="photos-main">
        <header className="photos-toolbar">
          <div>
            <span>{collection === "life" ? "Camera roll" : "Portfolio archive"}</span>
            <h2>{activeCollection.label}</h2>
          </div>
          <button className="photos-add-button" type="button" onClick={() => uploadRef.current?.click()}>
            <ImagePlus size={15} aria-hidden="true" />
            Add photos
          </button>
          <input
            ref={uploadRef}
            className="photos-file-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            tabIndex={-1}
          />
        </header>

        <div className="photos-gallery-stage">
          <div className="photos-gallery-heading">
            <p>{collection === "life" ? "A few honest moments, plus several questionable decisions." : "Project images live separately from the personal camera roll."}</p>
            <span>{visiblePhotos.length} photos</span>
          </div>

          <motion.div className="photo-grid" layout>
            <AnimatePresence mode="popLayout" initial={false}>
              {visiblePhotos.map((photo) => (
                <motion.button
                  layout
                  key={photo.id}
                  type="button"
                  className={`photo-card ${photo.size}`}
                  onClick={() => setSelectedId(photo.id)}
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  transition={{ duration: 0.16, ease: "easeOut", layout: { type: "spring", stiffness: 550, damping: 40 } }}
                >
                  <span className="photo-card-image">
                    <Image
                      src={photo.src}
                      alt={photo.title}
                      fill
                      loading={["portrait", "friday-deploy", "duck-review", "cable-crime", "practly"].includes(photo.id) ? "eager" : "lazy"}
                      unoptimized={photo.local}
                      sizes="(max-width: 680px) 100vw, (max-width: 900px) 50vw, 320px"
                    />
                  </span>
                  <span className="photo-card-overlay">
                    <small>{photo.tag}</small>
                    <strong>{photo.title}</strong>
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <AnimatePresence>
        {selected ? (
          <motion.div
            className="photo-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            <button className="photo-lightbox-backdrop" type="button" onClick={() => setSelectedId(null)} aria-label="Close photo" />
            <motion.section
              className="photo-lightbox-panel"
              role="dialog"
              aria-modal="true"
              aria-label={selected.title}
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: POP }}
              exit={{ opacity: 0, scale: 0.96, y: 8, transition: POP_EXIT }}
            >
              <div className="photo-lightbox-image">
                <Image src={selected.src} alt={selected.title} fill unoptimized={selected.local} sizes="85vw" />
                {visiblePhotos.length > 1 ? (
                  <>
                    <button className="lightbox-previous" type="button" onClick={showPrevious} aria-label="Previous photo"><ArrowLeft size={17} /></button>
                    <button className="lightbox-next" type="button" onClick={showNext} aria-label="Next photo"><ArrowRight size={17} /></button>
                  </>
                ) : null}
              </div>
              <footer>
                <div><small>{selected.tag}</small><h3>{selected.title}</h3><p>{selected.caption}</p></div>
                <span>{selectedIndex + 1} / {visiblePhotos.length}</span>
              </footer>
              <button className="lightbox-close" type="button" onClick={() => setSelectedId(null)} aria-label="Close photo"><X size={17} /></button>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
