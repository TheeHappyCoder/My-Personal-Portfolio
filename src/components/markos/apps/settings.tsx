"use client";

import {
  Accessibility,
  Check,
  ImageIcon,
  Info,
  Laptop,
  Monitor,
  Moon,
  Palette,
  RotateCcw,
  Sparkles,
  Sun,
  Type,
} from "lucide-react";
import { useState } from "react";
import {
  type AppearancePreferences,
  type FontFamily,
  type TextSize,
  textSizes,
  type ThemeMode,
  type Wallpaper,
} from "../appearance";

type SettingsTab = "appearance" | "accessibility" | "about";

type SettingsAppProps = {
  preferences: AppearancePreferences;
  onChange: (patch: Partial<AppearancePreferences>) => void;
  onReset: () => void;
};

const tabs = [
  { id: "appearance" as const, label: "Appearance", icon: Palette },
  { id: "accessibility" as const, label: "Accessibility", icon: Accessibility },
  { id: "about" as const, label: "About MarkOS", icon: Info },
];

const themeOptions: Array<{ id: ThemeMode; label: string; description: string; icon: typeof Sun }> = [
  { id: "light", label: "Light", description: "Bright apps and panels", icon: Sun },
  { id: "dark", label: "Dark", description: "Low-light apps and panels", icon: Moon },
  { id: "system", label: "System", description: "Match this device", icon: Laptop },
];

const fontOptions: Array<{ id: FontFamily; label: string; description: string; sample: string }> = [
  { id: "segoe", label: "Segoe UI", description: "Familiar and neutral", sample: "Aa" },
  { id: "humanist", label: "Humanist", description: "Warm and open", sample: "Ag" },
  { id: "serif", label: "Editorial", description: "Classic serif", sample: "Aa" },
  { id: "mono", label: "Monospace", description: "Technical and precise", sample: "01" },
];

const wallpaperOptions: Array<{ id: Wallpaper; label: string }> = [
  { id: "bloom", label: "Blue bloom" },
  { id: "aurora", label: "Aurora" },
  { id: "dusk", label: "Dusk" },
  { id: "graphite", label: "Graphite" },
];

const accentOptions = [
  { id: "blue" as const, label: "Blue" },
  { id: "violet" as const, label: "Violet" },
  { id: "emerald" as const, label: "Emerald" },
  { id: "rose" as const, label: "Rose" },
];

const textSizeLabels: Record<TextSize, string> = {
  small: "Small",
  default: "Default",
  large: "Large",
  xlarge: "Extra large",
};

function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (checked: boolean) => void }) {
  return (
    <button
      type="button"
      className={`settings-switch ${checked ? "on" : ""}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span aria-hidden="true" />
    </button>
  );
}

export function SettingsApp({ preferences, onChange, onReset }: SettingsAppProps) {
  const [selectedTab, setSelectedTab] = useState<SettingsTab>("appearance");
  const textSizeIndex = Math.max(0, textSizes.indexOf(preferences.textSize));

  return (
    <div className="system-settings-app">
      <aside>
        <div className="system-settings-profile">
          <span>MS</span>
          <div><b>Mark Steyn</b><small>Local MarkOS profile</small></div>
        </div>

        <nav aria-label="Settings categories">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              className={selectedTab === id ? "selected" : ""}
              aria-current={selectedTab === id ? "page" : undefined}
              onClick={() => setSelectedTab(id)}
            >
              <Icon size={17} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <p className="system-settings-state"><Check size={13} aria-hidden="true" /> Changes save in this browser</p>
      </aside>

      <main>
        {selectedTab === "appearance" ? (
          <>
            <header className="system-settings-heading">
              <div><span>Personalization</span><h2>Appearance</h2><p>Make MarkOS feel right without losing its Windows character.</p></div>
              <button type="button" className="settings-reset" onClick={onReset}><RotateCcw size={14} /> Reset defaults</button>
            </header>

            <div className="system-settings-stack">
              <section className="settings-section" aria-labelledby="color-mode-title">
                <header><span className="settings-section-icon"><Monitor size={17} /></span><div><h3 id="color-mode-title">Color mode</h3><p>Choose light, dark, or follow this device.</p></div></header>
                <div className="theme-choice-grid">
                  {themeOptions.map(({ id, label, description, icon: Icon }) => (
                    <button type="button" key={id} className={preferences.theme === id ? "selected" : ""} aria-pressed={preferences.theme === id} onClick={() => onChange({ theme: id })}>
                      <span className={`theme-preview ${id}`} aria-hidden="true"><i /><i /><i /></span>
                      <span><Icon size={15} /><b>{label}</b><small>{description}</small></span>
                      {preferences.theme === id ? <Check className="choice-check" size={15} aria-hidden="true" /> : null}
                    </button>
                  ))}
                </div>
              </section>

              <section className="settings-section" aria-labelledby="background-title">
                <header><span className="settings-section-icon"><ImageIcon size={17} /></span><div><h3 id="background-title">Desktop background</h3><p>Pick a wallpaper and accent color.</p></div></header>
                <div className="wallpaper-choice-grid">
                  {wallpaperOptions.map(({ id, label }) => (
                    <button type="button" key={id} className={preferences.wallpaper === id ? "selected" : ""} aria-pressed={preferences.wallpaper === id} onClick={() => onChange({ wallpaper: id })}>
                      <span className="wallpaper-swatch" data-wallpaper-option={id} aria-hidden="true"><i /></span>
                      <span>{label}</span>
                      {preferences.wallpaper === id ? <Check size={14} aria-hidden="true" /> : null}
                    </button>
                  ))}
                </div>

                <div className="settings-control-row accent-control-row">
                  <div><b>Accent color</b><small>Used for selections, switches, and active apps.</small></div>
                  <div className="accent-choice-row" role="group" aria-label="Accent color">
                    {accentOptions.map(({ id, label }) => (
                      <button type="button" key={id} data-accent-option={id} className={preferences.accent === id ? "selected" : ""} aria-label={label} aria-pressed={preferences.accent === id} onClick={() => onChange({ accent: id })}>
                        {preferences.accent === id ? <Check size={13} aria-hidden="true" /> : null}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section className="settings-section" aria-labelledby="typeface-title">
                <header><span className="settings-section-icon"><Type size={17} /></span><div><h3 id="typeface-title">Typeface</h3><p>Change the font across apps, menus, and desktop labels.</p></div></header>
                <div className="font-choice-grid">
                  {fontOptions.map(({ id, label, description, sample }) => (
                    <button type="button" key={id} data-font-option={id} className={preferences.font === id ? "selected" : ""} aria-pressed={preferences.font === id} onClick={() => onChange({ font: id })}>
                      <strong>{sample}</strong><span><b>{label}</b><small>{description}</small></span>
                      {preferences.font === id ? <Check size={15} aria-hidden="true" /> : null}
                    </button>
                  ))}
                </div>
              </section>

              <section className="settings-section compact" aria-labelledby="effects-title">
                <header><span className="settings-section-icon"><Sparkles size={17} /></span><div><h3 id="effects-title">Visual effects</h3><p>Control acrylic blur in windows and system panels.</p></div></header>
                <div className="settings-control-row">
                  <div><b>Transparency effects</b><small>Let wallpaper color show through MarkOS surfaces.</small></div>
                  <Toggle checked={preferences.transparency} label="Transparency effects" onChange={(transparency) => onChange({ transparency })} />
                </div>
              </section>
            </div>
          </>
        ) : null}

        {selectedTab === "accessibility" ? (
          <>
            <header className="system-settings-heading">
              <div><span>Ease of use</span><h2>Accessibility</h2><p>Make text easier to read and motion easier to follow.</p></div>
              <button type="button" className="settings-reset" onClick={onReset}><RotateCcw size={14} /> Reset defaults</button>
            </header>

            <div className="system-settings-stack">
              <section className="settings-section" aria-labelledby="text-size-title">
                <header><span className="settings-section-icon"><Type size={17} /></span><div><h3 id="text-size-title">Text size</h3><p>Adjust interface text while keeping window layout intact.</p></div></header>
                <div className="text-size-control">
                  <div className="text-size-preview" aria-hidden="true"><small>A</small><span>MarkOS preview</span><strong>A</strong></div>
                  <label>
                    <span><b>Size</b><output>{textSizeLabels[preferences.textSize]}</output></span>
                    <input
                      type="range"
                      min="0"
                      max={textSizes.length - 1}
                      step="1"
                      value={textSizeIndex}
                      aria-label="Text size"
                      onChange={(event) => onChange({ textSize: textSizes[Number(event.target.value)] ?? "default" })}
                    />
                    <span className="text-size-marks" aria-hidden="true"><i /><i /><i /><i /></span>
                  </label>
                  <div className="text-size-options" role="group" aria-label="Text size presets">
                    {textSizes.map((size) => (
                      <button type="button" key={size} className={preferences.textSize === size ? "selected" : ""} aria-pressed={preferences.textSize === size} onClick={() => onChange({ textSize: size })}>
                        {textSizeLabels[size]}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section className="settings-section compact" aria-labelledby="motion-title">
                <header><span className="settings-section-icon"><Accessibility size={17} /></span><div><h3 id="motion-title">Motion</h3><p>Reduce window and panel movement while keeping state changes clear.</p></div></header>
                <div className="settings-control-row">
                  <div><b>Reduce motion</b><small>Shortens movement and disables decorative animation.</small></div>
                  <Toggle checked={preferences.reduceMotion} label="Reduce motion" onChange={(reduceMotion) => onChange({ reduceMotion })} />
                </div>
              </section>
            </div>
          </>
        ) : null}

        {selectedTab === "about" ? (
          <>
            <header className="system-settings-heading">
              <div><span>System</span><h2>About MarkOS</h2><p>Portfolio shell, appearance storage, and current build details.</p></div>
            </header>

            <section className="settings-about-card">
              <span className="settings-about-logo"><Monitor size={25} /></span>
              <div><h3>MarkOS</h3><p>Windows-inspired portfolio environment by Mark Steyn.</p></div>
              <dl>
                <div><dt>Edition</dt><dd>Portfolio</dd></div>
                <div><dt>Version</dt><dd>1.1</dd></div>
                <div><dt>Preferences</dt><dd>Stored in this browser</dd></div>
              </dl>
              <button type="button" className="win-button" onClick={onReset}><RotateCcw size={14} /> Reset appearance</button>
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}
