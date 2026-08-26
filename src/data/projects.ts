export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  role: string;
  year: string;
  description: string;
  tech: string[];
  features: {
    title: string;
    description: string;
    icon: string;
  }[];
  challenge: string;
  solution: string;
  images: string[];
  liveUrl?: string;
  repoUrl?: string;
}

export const projects: Project[] = [
  {
    slug: "novacore",
    title: "NovaCore",
    subtitle: "Building Management System",
    role: "Lead Developer",
    year: "2020 - Present",
    description:
      "A comprehensive building and smart-home automation platform built from the ground up. NovaCore provides real-time monitoring, control, and visualization of building systems through interactive floor plans and an intuitive interface.",
    tech: [
      "Next.js",
      "React 19",
      "TypeScript",
      "Express",
      "SQLite",
      "WebSockets",
      "node-bacnet",
      "KNX",
      "Tailwind CSS",
    ],
    features: [
      {
        title: "Interactive Floor Plans",
        description:
          "Drag-and-drop graphics editor with customizable widgets for creating building visualizations",
        icon: "Layout",
      },
      {
        title: "Real-Time Alarming",
        description:
          "Instant notifications and alarm management with configurable thresholds and priorities",
        icon: "Bell",
      },
      {
        title: "Data Trending",
        description:
          "Historical data visualization with Recharts and export capabilities",
        icon: "TrendingUp",
      },
      {
        title: "Scheduling System",
        description:
          "Advanced scheduling for HVAC, lighting, and other building systems",
        icon: "Calendar",
      },
      {
        title: "Device Management",
        description:
          "Comprehensive BACnet and KNX device discovery, configuration, and monitoring",
        icon: "Settings",
      },
      {
        title: "User Management",
        description:
          "Role-based access control with customizable permissions and audit logging",
        icon: "Users",
      },
    ],
    challenge:
      "Building management systems are traditionally expensive, complex, and locked into proprietary ecosystems. Existing solutions often lack modern UX design and real-time capabilities that users expect from contemporary software.",
    solution:
      "NovaCore provides an open, modern alternative built entirely with JavaScript/TypeScript. Next.js powers both the frontend and Express-based backend, with node-bacnet and KNX libraries handling protocol communication. WebSockets enable real-time updates across all connected clients.",
    images: [],
  },
  {
    slug: "novacloud",
    title: "NovaCloud",
    subtitle: "Cloud Management Portal",
    role: "Full-Stack Developer",
    year: "2024 - Present",
    description:
      "A multi-tenant cloud portal for managing NovaCore installations across multiple sites and organizations. NovaCloud provides centralized oversight, license management, and geographic visualization of building systems.",
    tech: ["Next.js", "React", "TypeScript", "Supabase", "Leaflet", "Tailwind CSS"],
    features: [
      {
        title: "Multi-Tenant Organizations",
        description:
          "Support for multiple organizations with isolated data and configurable permissions",
        icon: "Building",
      },
      {
        title: "Installation Tracking",
        description:
          "Monitor and manage all NovaCore installations from a central dashboard",
        icon: "Server",
      },
      {
        title: "License Management",
        description:
          "Generate, assign, and track software licenses across installations",
        icon: "Key",
      },
      {
        title: "Geographic Maps",
        description:
          "Interactive maps showing installation locations with Leaflet integration",
        icon: "Map",
      },
      {
        title: "Analytics Dashboard",
        description:
          "Usage statistics and performance metrics across all managed sites",
        icon: "BarChart",
      },
      {
        title: "User Administration",
        description:
          "Centralized user management with SSO and role-based access",
        icon: "UserCog",
      },
    ],
    challenge:
      "Managing multiple building automation installations across different locations requires constant context switching and lacks centralized visibility. Organizations need a single pane of glass to oversee their entire portfolio.",
    solution:
      "NovaCloud aggregates data from all connected NovaCore instances into a unified dashboard. Supabase provides real-time data synchronization and authentication, while Leaflet maps offer geographic context for distributed installations.",
    images: ["/novacloud/banner.webp"],
  },
  {
    slug: "align",
    title: "Align",
    subtitle: "AI-Powered Finance App",
    role: "Full-Stack Developer",
    year: "2024 - Present",
    description:
      "A personal finance application that uses AI to automatically extract and categorize transactions from email receipts. Align provides intelligent budgeting, subscription tracking, and financial insights through natural language chat.",
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "Supabase",
      "OpenAI",
      "Gmail API",
      "Outlook API",
    ],
    features: [
      {
        title: "Auto Transaction Extraction",
        description:
          "AI-powered parsing of email receipts to automatically log transactions",
        icon: "Scan",
      },
      {
        title: "AI Chat Assistant",
        description:
          "Natural language interface for querying finances and getting insights",
        icon: "MessageSquare",
      },
      {
        title: "Smart Budgets",
        description:
          "Intelligent budget recommendations based on spending patterns",
        icon: "PiggyBank",
      },
      {
        title: "Subscription Tracking",
        description:
          "Automatic detection and monitoring of recurring subscriptions",
        icon: "Repeat",
      },
      {
        title: "Automations",
        description:
          "Custom rules for categorization, alerts, and financial workflows",
        icon: "Zap",
      },
      {
        title: "Financial Reports",
        description:
          "Detailed spending analysis with exportable reports and visualizations",
        icon: "FileText",
      },
    ],
    challenge:
      "Manual expense tracking is tedious and often abandoned. Most finance apps require significant user input and lack intelligent automation to reduce the burden of financial management.",
    solution:
      "Align leverages OpenAI to extract transaction data from email receipts automatically. The AI chat interface allows users to interact with their finances naturally, while smart automations handle categorization and alerting without manual intervention.",
    images: ["/align/banner.webp"],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
