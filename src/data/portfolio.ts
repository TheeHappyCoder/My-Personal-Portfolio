export type PortfolioProject = {
  slug: string;
  title: string;
  eyebrow: string;
  role: string;
  year: string;
  summary: string;
  problem: string;
  solution: string;
  tech: string[];
  cover: string;
  gallery: string[];
  accent: string;
  status: "Flagship" | "Product" | "Client work" | "Experiment";
};

export const profile = {
  name: "Mark Steyn",
  title: "Full-stack developer & BMS integrator",
  location: "Pretoria, South Africa",
  email: "marksteyn1001@gmail.com",
  linkedin: "https://www.linkedin.com/in/mark-steyn-b71894139/",
  intro:
    "I build software where the web meets the physical world: modern product interfaces, real-time systems, and building automation that people can actually enjoy using.",
  availability: "Open to ambitious product work and collaborations",
};

export const projects: PortfolioProject[] = [
  {
    slug: "novacore",
    title: "NovaCore",
    eyebrow: "Building management system",
    role: "Lead developer & systems integrator",
    year: "2020 - present",
    summary:
      "A building and smart-home automation platform for live monitoring, control, alarming, scheduling, and interactive floor-plan visualisation.",
    problem:
      "Traditional building systems are expensive, proprietary, and often feel decades behind the software people use every day.",
    solution:
      "NovaCore brings BACnet, KNX, live device data, alarms, schedules, and custom graphics into one modern web application.",
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "Express",
      "SQLite",
      "WebSockets",
      "BACnet",
      "KNX",
    ],
    cover: "/novacore/1.png",
    gallery: [
      "/novacore/1.png",
      "/novacore/13.png",
      "/novacore/23.png",
      "/novacore/34.png",
      "/novacore/42.png",
      "/novacore/46.png",
    ],
    accent: "#111827",
    status: "Flagship",
  },
  {
    slug: "legal-practice-suite",
    title: "Legal Practice Suite",
    eyebrow: "Operations platform",
    role: "Full-stack developer",
    year: "Selected work",
    summary:
      "A focused workspace for clients, cases, files, timesheets, trust accounting, invoices, statements, and operational reporting.",
    problem:
      "Legal work becomes fragmented when client records, time, documents, billing, and reporting live in separate tools.",
    solution:
      "One dense, calm operating layer keeps the complete matter lifecycle visible without turning every task into admin.",
    tech: ["React", "TypeScript", "Workflow design", "Data visualisation", "Responsive UI"],
    cover: "/lawFirm/1.webp",
    gallery: [
      "/lawFirm/1.webp",
      "/lawFirm/5.webp",
      "/lawFirm/7.webp",
      "/lawFirm/10.webp",
      "/lawFirm/13.webp",
      "/lawFirm/15.webp",
    ],
    accent: "#17151f",
    status: "Product",
  },
  {
    slug: "droplet",
    title: "Droplet",
    eyebrow: "Local-first file transfer",
    role: "Product design & development",
    year: "Selected work",
    summary:
      "A local network file-transfer tool. Scan a QR code, upload from a phone, and download from the desktop without a cloud detour.",
    problem:
      "Moving a few files between nearby devices should not need messaging apps, cables, account setup, or public cloud storage.",
    solution:
      "Droplet creates a simple local hand-off with QR pairing, drag-and-drop upload, optional folders, and a clear download queue.",
    tech: ["React", "TypeScript", "Local networking", "QR workflows", "File handling"],
    cover: "/droplet/1.png",
    gallery: [
      "/droplet/1.png",
      "/droplet/2.png",
      "/droplet/3.png",
      "/droplet/4.png",
      "/droplet/5.png",
    ],
    accent: "#b30a79",
    status: "Experiment",
  },
  {
    slug: "africa-building-technologies",
    title: "Africa Building Technologies",
    eyebrow: "Company website",
    role: "Design & development",
    year: "Selected work",
    summary:
      "A cinematic company website framing smart buildings, mobility, and infrastructure as one connected technology story.",
    problem:
      "A broad systems company needed a clear digital front door without reducing its work to a generic list of services.",
    solution:
      "Large visual storytelling, crisp routes into products and industries, and a confident technical identity make the offer easy to scan.",
    tech: ["Responsive design", "Frontend development", "Interaction design", "Performance"],
    cover: "/websites/abt.png",
    gallery: ["/websites/abt.png"],
    accent: "#142838",
    status: "Client work",
  },
  {
    slug: "tagon",
    title: "Tagon",
    eyebrow: "Industrial technology website",
    role: "Design & development",
    year: "Selected work",
    summary:
      "A high-impact industrial site presenting smart hardware, electronic design, AI-led solutions, and services for modern operations.",
    problem:
      "Complex technical services can feel abstract before prospects understand what the company builds and why it matters.",
    solution:
      "Direct positioning, a strong industrial hero, and visible service paths turn a complicated offer into a clear first conversation.",
    tech: ["Responsive design", "Frontend development", "Content design", "Visual direction"],
    cover: "/websites/tagon.png",
    gallery: ["/websites/tagon.png"],
    accent: "#0f6b56",
    status: "Client work",
  },
];

export const labProjects = [
  {
    title: "NovaCloud",
    type: "Cloud management portal",
    note: "Multi-tenant oversight, installations, licensing, maps, and analytics for distributed NovaCore sites.",
    tech: ["Next.js", "TypeScript", "Supabase", "Leaflet"],
  },
  {
    title: "Align",
    type: "AI-assisted personal finance",
    note: "Email receipt extraction, smart budgets, subscription detection, automations, and natural-language financial queries.",
    tech: ["Next.js", "Supabase", "OpenAI", "Gmail API"],
  },
];

export const skillGroups = [
  {
    title: "Product engineering",
    description: "Daily drivers for designing and shipping complete web products.",
    skills: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Node.js", "Express"],
  },
  {
    title: "Data & realtime",
    description: "Storage and communication layers for live operational software.",
    skills: ["SQLite", "InfluxDB", "Supabase", "Firebase", "SQL", "WebSockets"],
  },
  {
    title: "Building automation",
    description: "The physical-world stack behind smart buildings and BMS work.",
    skills: ["BACnet", "KNX", "Desigo CC", "FIN Framework", "DDC", "HVAC", "RS-485", "TCP/IP"],
  },
  {
    title: "Visual systems",
    description: "Tools for interfaces that make complex systems legible.",
    skills: ["Fabric.js", "Recharts", "Interactive floor plans", "Dashboard UX", "Responsive design"],
  },
  {
    title: "Python & tooling",
    description: "Useful supporting tools for APIs, automation, and delivery.",
    skills: ["Python", "Flask", "FastAPI", "Git", "CLI workflows"],
  },
];

export const experience = [
  {
    period: "2021 - present",
    role: "Systems integrator / BMS engineer",
    company: "Africa Building Technologies",
    detail:
      "Install, troubleshoot, and program DDC and BMS/HVAC systems; manage TCP/IP and RS-485 communication; coordinate technical delivery.",
  },
  {
    period: "2023",
    role: "Desigo CC training",
    company: "Siemens",
    detail: "Entry-level Desigo CC building management software training.",
  },
  {
    period: "2021",
    role: "FIN Framework training",
    company: "J2 Innovations, a Siemens company",
    detail: "FIN Framework building management software training.",
  },
];

export const education = [
  "Software & Application Development (MCSD & MCSE) - CTU Training Solutions, 2019 - 2021",
  "Higher Certificate in Exercise Science - HFPA, 2015 - 2016",
  "Matric - Pretoria Boys High School, 2014",
];

export function getPortfolioProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
