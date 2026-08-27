export type PortfolioTourStep = {
  title: string;
  description: string;
  src: string;
  duration: string;
};

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
  cover?: string;
  coverVideo?: string;
  gallery: string[];
  galleryLabels?: string[];
  tour?: {
    eyebrow: string;
    title: string;
    intro: string;
    steps: PortfolioTourStep[];
  };
  accent: string;
  status: "Flagship" | "Product" | "Client work" | "Experiment";
  liveUrl?: string;
  metrics?: {
    value: string;
    label: string;
  }[];
  scope?: {
    title: string;
    detail: string;
  }[];
  scopeHeading?: string;
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
    eyebrow: "On-premises automation platform + cloud control plane",
    role: "Product architect, lead developer & BMS integrator",
    year: "2020 - present",
    summary:
      "A complete operational platform spanning edge protocols, project engineering, deterministic control, graphics, alarming, schedules, automations, security, audit, and secure cloud access.",
    problem:
      "Traditional building platforms are protocol-first, difficult to explain, expensive to extend, and full of hidden state. Operators need clarity; integrators need exact technical control; organisations need a safe path from one local system to a connected estate.",
    solution:
      "NovaCore separates protocol evidence from product truth. Stable points, explicit operational context, reviewed engineering actions, and a deterministic P1-P16 command model power the local platform. NovaCloud adds organisations, licensing, connected systems, projects, people, and outbound-only remote access without becoming a dependency for local operation.",
    tech: [
      "Vite",
      "Next.js",
      "React 19",
      "TypeScript",
      "Express",
      "SQLite",
      "WebSockets",
      "BACnet",
      "Modbus",
      "KNX",
      "MQTT",
      "M-Bus",
      "Supabase",
    ],
    coverVideo: "/novacore/videos/login.mp4",
    gallery: [],
    tour: {
      eyebrow: "Guided product tour",
      title: "See NovaCore move from access to action.",
      intro:
        "Three focused walkthroughs show how users enter the platform, keep product knowledge close, and follow operational activity.",
      steps: [
        {
          title: "Enter NovaCore",
          description:
            "Start at secure sign-in and follow the first path into the operating workspace.",
          src: "/novacore/videos/login.mp4",
          duration: "0:40",
        },
        {
          title: "Keep answers in context",
          description:
            "Move through NovaCore documentation without breaking the product workflow.",
          src: "/novacore/videos/docs.mp4",
          duration: "0:12",
        },
        {
          title: "Follow important activity",
          description:
            "See how notifications surface system activity and keep operators informed.",
          src: "/novacore/videos/notifications.mp4",
          duration: "0:14",
        },
      ],
    },
    metrics: [
      { value: "2 apps", label: "NovaCore + NovaCloud" },
      { value: "7 sources", label: "Building and virtual drivers" },
      { value: "P1-P16", label: "Deterministic command stack" },
      { value: "Local-first", label: "Cloud remains optional" },
    ],
    scope: [
      {
        title: "Protocol-neutral engineering",
        detail: "Discover and add devices and points from BACnet, Modbus, MQTT, HTTP, KNX, M-Bus, and virtual sources through one reviewed workflow.",
      },
      {
        title: "Operational context",
        detail: "Model sites, floors, spaces, equipment, relationships, classes, and user-defined point meanings without sacrificing exact point identity.",
      },
      {
        title: "Graphics and 3D",
        detail: "Build reusable operational graphics, bind live point state, navigate whole facilities, and move from estate context into equipment detail.",
      },
      {
        title: "Control and evidence",
        detail: "Keep observations, commands, readback, quality, priority ownership, reachability, and audit provenance distinct and explainable.",
      },
      {
        title: "Operations suite",
        detail: "Author schedules, alarms, trends, notifications, logbook entries, and When / If / Then automations over exact compiled targets.",
      },
      {
        title: "Cloud control plane",
        detail: "Manage organisations, people, systems, projects, plans, signed licences, pairing, and short-lived remote access from NovaCloud.",
      },
    ],
    scopeHeading: "Local platform, cloud control plane, one product.",
    accent: "#111827",
    status: "Flagship",
  },
  {
    slug: "practly",
    title: "Practly",
    eyebrow: "Physiotherapy practice operations",
    role: "Product design & full-stack development",
    year: "2026",
    summary:
      "A calm, secure workspace built for Lizl Kruger Physiotherapy to manage hospital patients, rooms care, staff, consent, documents, medical aids, and follow-up alerts.",
    problem:
      "Patient administration was spread across hand-offs, documents, and practice knowledge. Hospital admissions and continued rooms care needed one clear record without turning a small practice into a maze of enterprise software.",
    solution:
      "Practly follows the real care journey: create a hospital file, retain admission history, move discharged patients into rooms care, manage supporting documents and consent, and keep practice-owned reference data in one role-aware workspace.",
    tech: ["Next.js 16", "React 19", "TypeScript", "Supabase Auth", "Supabase Storage", "PostgreSQL", "Tailwind CSS"],
    cover: "/practly/overview.png",
    gallery: [
      "/practly/overview.png",
      "/practly/hospital-intake.png",
      "/practly/information-sheets.png",
    ],
    galleryLabels: [
      "Practice overview and operational readiness",
      "Hospital patient intake with previous-file lookup",
      "Approved procedure PDF library",
    ],
    metrics: [
      { value: "1 workspace", label: "Single-practice focus" },
      { value: "2 care paths", label: "Hospital + rooms" },
      { value: "Role-aware", label: "Protected staff workflows" },
      { value: "Secure files", label: "Consent and clinical documents" },
    ],
    scope: [
      {
        title: "Hospital workflow",
        detail: "Patient lookup, admission details, medical-aid context, ICD information, notes, discharge, readmission history, and supporting documents.",
      },
      {
        title: "Continuity into rooms",
        detail: "Move discharged patients into ongoing rooms care while keeping their hospital history connected to the same patient record.",
      },
      {
        title: "Consent and information",
        detail: "Generate consent workflows and maintain an approved PDF library that staff can send directly from a patient file.",
      },
      {
        title: "Practice administration",
        detail: "Manage staff, medical aids, practice details, access, and persistent follow-up alerts from one restrained interface.",
      },
    ],
    scopeHeading: "Care operations, designed as one workflow.",
    accent: "#315fd8",
    status: "Client work",
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
      "A cinematic, systems-led website connects ABT's company story, STRATOS platform, industries, and delivered building work. Searchable projects and deep product storytelling turn technical capability into visible proof.",
    tech: ["Next.js", "React", "Responsive design", "Motion design", "Video", "Performance"],
    cover: "/websites/abt-home.png",
    coverVideo: "/abt/videos/home.mp4",
    gallery: ["/websites/abt-home.png", "/websites/abt-products.png", "/websites/abt-projects.png"],
    galleryLabels: [
      "Animated edge-to-cloud brand story",
      "STRATOS product narrative",
      "Searchable project portfolio",
    ],
    tour: {
      eyebrow: "Website walkthrough",
      title: "A technical company, shown in motion.",
      intro:
        "Two focused walkthroughs move from ABT's cinematic company story into the product ecosystem behind its connected-building work.",
      steps: [
        {
          title: "Enter the ABT story",
          description:
            "Follow the home experience as smart buildings, mobility, and infrastructure resolve into one connected technology narrative.",
          src: "/abt/videos/home.mp4",
          duration: "0:14",
        },
        {
          title: "Explore the product ecosystem",
          description:
            "See how the STRATOS platform and ABT's operational capabilities become a clear, visual product journey.",
          src: "/abt/videos/products.mp4",
          duration: "0:17",
        },
      ],
    },
    liveUrl: "https://abtv2.vercel.app/",
    scope: [
      {
        title: "Brand narrative",
        detail: "A cinematic opening positions smart-building automation as connected infrastructure, not a generic services list.",
      },
      {
        title: "Product storytelling",
        detail: "Dedicated STRATOS content explains control, alarming, schedules, trends, protocol integration, remote operations, and indoor-air-quality work.",
      },
      {
        title: "Project proof",
        detail: "A searchable portfolio exposes real buildings, systems, locations, project types, and detailed graphics work.",
      },
      {
        title: "Conversion paths",
        detail: "Products, industries, projects, company context, and contact routes remain clear beneath a highly visual presentation.",
      },
    ],
    scopeHeading: "A technical company made legible.",
    accent: "#142838",
    status: "Client work",
  },
  {
    slug: "botha-partners",
    title: "Botha Partners",
    eyebrow: "Editorial law-firm website",
    role: "Design & development",
    year: "2026",
    summary:
      "A premium editorial website for a Pretoria law firm, balancing its 1982 legacy with a sharp contemporary identity, clear expertise paths, partner profiles, insights, and direct contact journeys.",
    problem:
      "A long-established legal practice needed to feel credible without becoming conservative or interchangeable. Its history, people, expertise, and personal service all needed distinct space inside one coherent digital identity.",
    solution:
      "Oversized typography, monochrome art direction, restrained motion, and structured expertise pages create a confident site that feels established and current. Clear contact and appointment paths keep the visual concept commercially useful.",
    tech: ["HTML", "CSS", "JavaScript", "Bootstrap", "GSAP", "Swiper", "Responsive design"],
    cover: "/websites/botha-home.png",
    coverVideo: "/websites/bothapartners/videos/landing.mp4",
    gallery: ["/websites/botha-home.png", "/websites/botha-expertise.png", "/websites/botha-about.png"],
    galleryLabels: [
      "Monochrome editorial home page",
      "Visual expertise directory",
      "Legacy-led firm story",
    ],
    tour: {
      eyebrow: "Website walkthrough",
      title: "Editorial confidence, shown in motion.",
      intro:
        "A focused walkthrough follows the landing experience from its opening statement into the editorial system, legal expertise, and direct client journey.",
      steps: [
        {
          title: "Enter the Botha Partners experience",
          description:
            "See how oversized typography, monochrome art direction, and restrained motion turn a long-established legal practice into a contemporary digital presence.",
          src: "/websites/bothapartners/videos/landing.mp4",
          duration: "0:33",
        },
      ],
    },
    liveUrl: "https://bothapartnerswebsite.vercel.app/",
    scope: [
      {
        title: "Positioning",
        detail: "A direct 'Your partner in law' message anchors property, commercial, family, litigation, and estate-planning expertise.",
      },
      {
        title: "Editorial system",
        detail: "Large type, serif contrast, monochrome imagery, smooth scrolling, and subtle interaction produce a distinctive but disciplined identity.",
      },
      {
        title: "Trust architecture",
        detail: "Firm history, partner profiles, areas of expertise, organisational proof, and transparent practice values build confidence across the site.",
      },
      {
        title: "Complete site journey",
        detail: "Home, about, expertise detail, team, insights, and contact pages form a responsive, conversion-ready public presence.",
      },
    ],
    scopeHeading: "Legacy translated into a complete digital system.",
    accent: "#323639",
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
