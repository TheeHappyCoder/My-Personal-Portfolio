import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const outputRoot = join(process.cwd(), ".next", "static");
const requiredSelectors = [
  ".window-controls",
  ".showcase-hub",
  ".project-showcase-app",
  ".system-settings-app",
];

async function findCssFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return findCssFiles(path);
    return entry.isFile() && entry.name.endsWith(".css") ? [path] : [];
  }));

  return files.flat();
}

const cssFiles = await findCssFiles(outputRoot);
if (!cssFiles.length) {
  throw new Error("[critical-css] Next.js emitted no production CSS files.");
}

const bundles = await Promise.all(cssFiles.map(async (path) => ({
  path: relative(process.cwd(), path),
  content: await readFile(path, "utf8"),
})));
const emittedCss = bundles.map((bundle) => bundle.content).join("\n");
const missingSelectors = requiredSelectors.filter((selector) => !emittedCss.includes(selector));

if (missingSelectors.length) {
  throw new Error(
    `[critical-css] Production CSS missing required selectors: ${missingSelectors.join(", ")}. ` +
    "Refusing release because MarkOS windows would render unstyled."
  );
}

console.log(
  `[critical-css] Verified ${requiredSelectors.length} critical selectors across ${bundles.length} CSS bundle${bundles.length === 1 ? "" : "s"}.`
);
