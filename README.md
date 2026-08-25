# MarkOS Portfolio

An interactive Windows 11-inspired portfolio for Mark Steyn. The desktop is the navigation: draggable windows, File Explorer case studies, Google Chrome tabs, MarkGPT, Notepad, Photos, Terminal, Settings-style skills, CV viewer, and contact routes.

## Run locally

```bash
npm install
npm run dev -- -p 3020
```

Production check:

```bash
npm run typecheck
npm run lint
npm run build
```

## Source layout

```text
src/
├── app/                       # Next.js routes and global Windows shell styles
├── assets/                    # Mark's source media
├── components/markos/
│   ├── apps/                  # One module per desktop application
│   ├── shared/                # Reusable Windows asset renderer
│   ├── desktop.tsx            # Window manager, taskbar, Start, lock screen
│   └── window-frame.tsx       # Drag, focus, minimize, maximize, close
└── data/portfolio.ts          # Typed portfolio content
```

Chrome tabs mount lazily: background tabs do not load their iframe until first activation. Notepad changes persist only in the visitor's browser. MarkGPT is a deterministic portfolio guide and makes no external AI request.

## Asset attribution

Selected Windows-style icons and the shortcut overlay were sourced from [programming-with-ia/windows-11](https://github.com/programming-with-ia/windows-11), the public clone that inspired this interface. Product names, interface likenesses, and trademarks belong to their respective owners. This portfolio is not affiliated with Microsoft, Google, or OpenAI. Review the upstream repository's asset rights before commercial deployment.
