import Image from "next/image";

const iconPaths = {
  calculator: "/markos/icons/calculator.png",
  chrome: "/markos/icons/chrome.png",
  drive: "/markos/icons/drive.png",
  explorer: "/markos/icons/explorer.png",
  file: "/markos/icons/file.png",
  folder: "/markos/icons/folder.png",
  documents: "/markos/icons/folder-documents.png",
  downloads: "/markos/icons/folder-downloads.png",
  pictures: "/markos/icons/folder-pictures.png",
  videos: "/markos/icons/folder-videos.png",
  github: "/markos/icons/github-icon.png",
  network: "/markos/icons/network.png",
  notepad: "/markos/icons/notepad.png",
  pc: "/markos/icons/pc.png",
  projects: "/markos/icons/projects.png",
  settings: "/markos/icons/settings.png",
  tools: "/markos/icons/tools-folder.png",
  user: "/markos/icons/user-folder.png",
  vscode: "/markos/icons/vscode.png",
  windowsDrive: "/markos/icons/windows-drive.png",
  windowsStart: "/markos/icons/windows-start.png",
} as const;

export type WindowsIconName = keyof typeof iconPaths;

type WindowsAssetProps = {
  name: WindowsIconName;
  size?: number;
  shortcut?: boolean;
  className?: string;
  priority?: boolean;
};

export function WindowsAsset({
  name,
  size = 32,
  shortcut = false,
  className = "",
  priority = false,
}: WindowsAssetProps) {
  const overlaySize = Math.max(11, Math.round(size * 0.38));

  return (
    <span
      className={`windows-asset ${className}`.trim()}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Image
        src={iconPaths[name]}
        alt=""
        width={size}
        height={size}
        sizes={`${size}px`}
        priority={priority}
        draggable={false}
      />
      {shortcut ? (
        <Image
          className="windows-shortcut-overlay"
          src="/markos/icons/shortcut.png"
          alt=""
          width={overlaySize}
          height={overlaySize}
          sizes={`${overlaySize}px`}
          draggable={false}
        />
      ) : null}
    </span>
  );
}
