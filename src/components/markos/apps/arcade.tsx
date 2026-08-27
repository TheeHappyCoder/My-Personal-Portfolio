"use client";

import {
  ArrowLeft,
  Bug,
  Gamepad2,
  Grid3X3,
  Play,
  Rocket,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";

type GameSlug = "cache-overflow" | "bug-sweeper" | "break-production";

type ArcadeGame = {
  slug: GameSlug;
  title: string;
  description: string;
  controls: string;
  src: string;
  icon: typeof Gamepad2;
  preview: "tiles" | "bugs" | "bricks";
};

const games: ArcadeGame[] = [
  {
    slug: "cache-overflow",
    title: "Cache Overflow",
    description: "Merge allocations before memory runs out.",
    controls: "Arrow keys, WASD, or swipe",
    src: "/games/cache-overflow/index.html",
    icon: Grid3X3,
    preview: "tiles",
  },
  {
    slug: "bug-sweeper",
    title: "Bug Sweeper",
    description: "Find production bugs without shipping one.",
    controls: "Click to inspect, right-click to flag",
    src: "/games/bug-sweeper/index.html",
    icon: Bug,
    preview: "bugs",
  },
  {
    slug: "break-production",
    title: "Break Production",
    description: "Clear every failing check before launch.",
    controls: "Arrow keys, mouse, or touch",
    src: "/games/break-production/index.html",
    icon: Rocket,
    preview: "bricks",
  },
];

function GamePreview({ kind }: { kind: ArcadeGame["preview"] }) {
  if (kind === "tiles") {
    return (
      <div className="arcade-preview tiles" aria-hidden="true">
        {[2, 4, 8, 16, 0, 32, 64, 0, 128, 0, 256, 512].map((value, index) => (
          <span key={`${value}-${index}`} className={value >= 128 ? "hot" : ""}>{value || ""}</span>
        ))}
      </div>
    );
  }

  if (kind === "bugs") {
    return (
      <div className="arcade-preview bugs" aria-hidden="true">
        {["", "1", "", "", "2", "", "⚑", "1", "", "", "", "🐛", "2", "", ""].map((value, index) => (
          <span key={`${value}-${index}`} className={value === "🐛" ? "hot" : ""}>{value}</span>
        ))}
      </div>
    );
  }

  return (
    <div className="arcade-preview bricks" aria-hidden="true">
      <div>{["lint", "type", "test", "build", "a11y", "ship"].map((label) => <span key={label}>{label}</span>)}</div>
      <i />
      <b />
    </div>
  );
}

export function ArcadeApp() {
  const [activeSlug, setActiveSlug] = useState<GameSlug | null>(null);
  const [run, setRun] = useState(0);
  const activeGame = games.find((game) => game.slug === activeSlug) ?? null;

  if (activeGame) {
    return (
      <section className="arcade-app is-playing">
        <header className="arcade-playbar">
          <button type="button" className="arcade-icon-button" onClick={() => setActiveSlug(null)} aria-label="Back to Arcade">
            <ArrowLeft size={16} />
          </button>
          <span className="arcade-playbar-icon"><activeGame.icon size={16} /></span>
          <div>
            <strong>{activeGame.title}</strong>
            <small>{activeGame.controls}</small>
          </div>
          <button type="button" className="arcade-secondary-button" onClick={() => setRun((value) => value + 1)}>
            <RotateCcw size={14} /> Restart
          </button>
        </header>

        <div className="arcade-frame-shell">
          <iframe
            key={`${activeGame.slug}-${run}`}
            src={activeGame.src}
            title={activeGame.title}
            sandbox="allow-scripts"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="arcade-app">
      <header className="arcade-header">
        <span className="arcade-brand"><Gamepad2 size={19} /></span>
        <div>
          <small>MarkOS</small>
          <h2>Arcade</h2>
          <p>Three tiny games. Zero useful output.</p>
        </div>
        <span className="arcade-status"><i /> 3 games installed</span>
      </header>

      <main className="arcade-stage">
        <div className="arcade-section-heading">
          <div><strong>Ready to play</strong><small>Runs locally inside MarkOS</small></div>
          <Gamepad2 size={17} aria-hidden="true" />
        </div>

        <div className="arcade-grid">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <article className="arcade-card" key={game.slug}>
                <GamePreview kind={game.preview} />
                <div className="arcade-card-copy">
                  <span><Icon size={15} /></span>
                  <div><h3>{game.title}</h3><p>{game.description}</p></div>
                </div>
                <footer>
                  <small>{game.controls}</small>
                  <button type="button" onClick={() => setActiveSlug(game.slug)}>
                    <Play size={13} fill="currentColor" /> Play
                  </button>
                </footer>
              </article>
            );
          })}
        </div>

        <p className="arcade-footnote">Scores reset with each session. Work remains safely ignored.</p>
      </main>
    </section>
  );
}
