export const APPEARANCE_STORAGE_KEY = "markos.appearance.v1";

export const themeModes = ["light", "dark", "system"] as const;
export const fontFamilies = ["segoe", "humanist", "serif", "mono"] as const;
export const textSizes = ["small", "default", "large", "xlarge"] as const;
export const wallpapers = ["bloom", "aurora", "dusk", "graphite"] as const;
export const accentColors = ["blue", "violet", "emerald", "rose"] as const;

export type ThemeMode = (typeof themeModes)[number];
export type FontFamily = (typeof fontFamilies)[number];
export type TextSize = (typeof textSizes)[number];
export type Wallpaper = (typeof wallpapers)[number];
export type AccentColor = (typeof accentColors)[number];

export type AppearancePreferences = {
  theme: ThemeMode;
  font: FontFamily;
  textSize: TextSize;
  wallpaper: Wallpaper;
  accent: AccentColor;
  transparency: boolean;
  reduceMotion: boolean;
};

export const defaultAppearancePreferences: AppearancePreferences = {
  theme: "light",
  font: "segoe",
  textSize: "default",
  wallpaper: "bloom",
  accent: "blue",
  transparency: true,
  reduceMotion: false,
};

function includes<T extends string>(options: readonly T[], value: unknown): value is T {
  return typeof value === "string" && options.includes(value as T);
}

function normalizeAppearancePreferences(value: unknown): AppearancePreferences {
  if (!value || typeof value !== "object") return defaultAppearancePreferences;

  const stored = value as Partial<AppearancePreferences>;
  return {
    theme: includes(themeModes, stored.theme) ? stored.theme : defaultAppearancePreferences.theme,
    font: includes(fontFamilies, stored.font) ? stored.font : defaultAppearancePreferences.font,
    textSize: includes(textSizes, stored.textSize) ? stored.textSize : defaultAppearancePreferences.textSize,
    wallpaper: includes(wallpapers, stored.wallpaper) ? stored.wallpaper : defaultAppearancePreferences.wallpaper,
    accent: includes(accentColors, stored.accent) ? stored.accent : defaultAppearancePreferences.accent,
    transparency: typeof stored.transparency === "boolean" ? stored.transparency : defaultAppearancePreferences.transparency,
    reduceMotion: typeof stored.reduceMotion === "boolean" ? stored.reduceMotion : defaultAppearancePreferences.reduceMotion,
  };
}

export function readAppearancePreferences(): AppearancePreferences {
  if (typeof window === "undefined") return defaultAppearancePreferences;

  try {
    const stored = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
    return stored ? normalizeAppearancePreferences(JSON.parse(stored)) : defaultAppearancePreferences;
  } catch {
    return defaultAppearancePreferences;
  }
}

export function writeAppearancePreferences(preferences: AppearancePreferences) {
  try {
    window.localStorage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // Browsing can continue when storage is blocked or unavailable.
  }
}

export const appearanceBootstrapScript = `
(function () {
  try {
    var root = document.getElementById("markos-desktop");
    var raw = localStorage.getItem(${JSON.stringify(APPEARANCE_STORAGE_KEY)});
    if (!root || !raw) return;
    var value = JSON.parse(raw);
    var themeModes = ${JSON.stringify(themeModes)};
    var fontFamilies = ${JSON.stringify(fontFamilies)};
    var textSizes = ${JSON.stringify(textSizes)};
    var wallpapers = ${JSON.stringify(wallpapers)};
    var accentColors = ${JSON.stringify(accentColors)};
    var themeMode = themeModes.indexOf(value.theme) > -1 ? value.theme : "light";
    var theme = themeMode === "system"
      ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : themeMode;
    root.dataset.theme = theme;
    root.dataset.themeMode = themeMode;
    root.dataset.font = fontFamilies.indexOf(value.font) > -1 ? value.font : "segoe";
    root.dataset.textSize = textSizes.indexOf(value.textSize) > -1 ? value.textSize : "default";
    root.dataset.wallpaper = wallpapers.indexOf(value.wallpaper) > -1 ? value.wallpaper : "bloom";
    root.dataset.accent = accentColors.indexOf(value.accent) > -1 ? value.accent : "blue";
    root.dataset.transparency = value.transparency === false ? "off" : "on";
    root.dataset.motion = value.reduceMotion === true ? "reduced" : "full";
  } catch (error) {}
})();`;
