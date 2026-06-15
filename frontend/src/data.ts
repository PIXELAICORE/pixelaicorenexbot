import { AgencyService, PortfolioItem, TestimonialFeedback, BlogArticle } from './types';

export const SERVICES: AgencyService[] = [
  {
    id: "ai-solutions",
    title: "AI Solutions & Automation",
    description: "Multi-layered cognitive engineering, neural architecture, customized large language model fine-tuning, and robotic workflow automations.",
    icon: "Brain",
    category: "AI & Innovation",
    price: "$5,000"
  },
  {
    id: "web-dev",
    title: "Web Development",
    description: "Ultra-fast Next.js apps, headless architectures, microservices pipelines, and dynamic administrative panels.",
    icon: "Globe",
    category: "Development",
    price: "$3,500"
  },
  {
    id: "mobile-dev",
    title: "Mobile App Development",
    description: "Native feeling React Native and Swift/Kotlin applications delivering flawless, fluid user journeys with reliable offline sync.",
    icon: "Smartphone",
    category: "Development",
    price: "$4,500"
  },
  {
    id: "ui-ux",
    title: "UI/UX Design",
    description: "Premium digital design systems following cohesive layouts, glassmorphic themes, fluid micro-interactions, and visual harmony.",
    icon: "Palette",
    category: "Design",
    price: "$2,500"
  },
  {
    id: "branding",
    title: "Branding & Graphic Design",
    description: "High-impact brand guidelines, custom vector styling, futuristic graphics, and corporate visual guidelines.",
    icon: "Award",
    category: "Design",
    price: "$1,800"
  },
  {
    id: "firestore-solutions",
    title: "Firestore Database Solutions",
    description: "Hardened Firestore blueprints, ABAC safety rules logic, sub-collection partitioning, and high-performance server integrations.",
    icon: "Database",
    category: "Data Systems",
    price: "$2,000"
  },
  {
    id: "backend-api",
    title: "Backend API Development",
    description: "Robust Express/Node architectures, secure JSON Web Token middlewares, high-capacity gateways, and Webhook integrations.",
    icon: "Cpu",
    category: "Data Systems",
    price: "$3,000"
  },
  {
    id: "paypal-integration",
    title: "PayPal Integration",
    description: "Flawless checkouts, multi-tier billing pipelines, automated receipts, error-proof webhook verification, and invoice generators.",
    icon: "CreditCard",
    category: "Fintech",
    price: "$1,500"
  },
  {
    id: "photo-editing",
    title: "Photo Editing",
    description: "High-end product assets styling, AI-enhanced super-resolution upscaling, advanced light/matte composites, and lighting correction.",
    icon: "Image",
    category: "Design",
    price: "$1,000"
  },
  {
    id: "amazon-kdp",
    title: "Amazon KDP Design",
    description: "Niche research, optimized layouts, high-conversion visual book jackets, and formatting designs tailored for Amazon self-publishing success.",
    icon: "BookOpen",
    category: "Publishing & Media",
    price: "$1,200"
  }
];

export const PORTFOLIO: PortfolioItem[] = [
  {
    id: "portfolio-1",
    title: "Aura Cognitive Assistant",
    category: "AI Projects",
    description: "An enterprise-grade orchestration pipeline using multi-agent model logic, processing over 12 million real-time requests daily.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
    tags: ["Gemini 1.5 Pro", "Express", "Node.js", "Firestore"],
    link: "#"
  },
  {
    id: "portfolio-2",
    title: "Apex Logistics Platform",
    category: "Mobile Apps",
    description: "Full-scale logistics tracker featuring precise offline geolocation queuing, automated delivery invoices, and custom maps overlay.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
    tags: ["React Native", "Tailwind UI", "Firebase Auth"],
    link: "#"
  },
  {
    id: "portfolio-3",
    title: "Cyberpunk Fintech Hub",
    category: "Business Websites",
    description: "Futuristic wealth management dashboard showcasing detailed glassmorphic design and real-time SVG charting engines.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
    tags: ["React", "Motion", "Tailwindv4", "D3.js"],
    link: "#"
  },
  {
    id: "portfolio-4",
    title: "Vivid Ecommerce Suite",
    category: "eCommerce Stores",
    description: "Fully headless lifestyle shop showing instant checkout processes, PayPal webhook relays, and optimized layouts.",
    image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80&w=800",
    tags: ["Next.js", "Express", "PayPal REST API", "Firestore"],
    link: "#"
  },
  {
    id: "portfolio-5",
    title: "NexBot Core Identity",
    category: "Branding Projects",
    description: "Futuristic, award-winning complete brand visual styling system, with dynamic 3D logo guidelines and custom graphic packets.",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=800",
    tags: ["Brand Guidelines", "Vector Art", "3D Styling"],
    link: "#"
  },
  {
    id: "portfolio-6",
    title: "Solace Health Automation",
    category: "AI Projects",
    description: "Cognitive voice analytics scheduling engine, integrating automatic patient note classification and HIPAA-compliant data models.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
    tags: ["Gemini API", "Node.js", "Speech Synthesizer"],
    link: "#"
  }
];

export const TESTIMONIALS: TestimonialFeedback[] = [
  {
    id: "test-1",
    author: "Elena Rostova",
    role: "VP of Product",
    company: "Synthetix Labs",
    rating: 5,
    text: "Pixel AICore transformed our outdated architecture into a blazing-fast, AI-driven automation engine. Our operational efficiency skyrocketed by 340% within three weeks.",
    createdAt: "2026-05-10T12:00:00Z"
  },
  {
    id: "test-2",
    author: "Marcus Vance",
    role: "Founder",
    company: "Apex Ledger",
    rating: 5,
    text: "Their PayPal and Firestore configurations are bulletproof. We launched our subscription system without a single glitch, and the secure admin dashboard makes tracking leads incredibly easy.",
    createdAt: "2026-05-15T12:00:00Z"
  },
  {
    id: "test-3",
    author: "Sora Takahashi",
    role: "Marketing Director",
    company: "OmniCorp Japan",
    rating: 5,
    text: "An absolute masterclass in futuristic typography and UI layout. They build digital products that look like they belong in 2030, but function flawlessly right now.",
    createdAt: "2026-05-20T12:00:00Z"
  }
];

export const BLOG: BlogArticle[] = [
  {
    id: "blog-1",
    title: "The Zero-Trust Era: Hardening Firestore Security Rules for AI Scale",
    summary: "How to avoid orphaned writes, prevent shadow updates, and design secure document constraints to guard your cloud wallets.",
    content: "With the rise of automated web systems, poorly guarded databases are prime targets. Hardening Firestore rules using strict key-presence validators, isOwner identities, and temporal constraints is no longer optional. This article breaks down Attribute-Based Access Control and practical rules optimization strategies.",
    author: "AICore Research",
    category: "Cybersecurity",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    createdAt: "June 12, 2026"
  },
  {
    id: "blog-2",
    title: "Mastering Intelligent Automations using Gemini Live Orchestrators",
    summary: "Leveraging structured schemas, JSON modes, and continuous socket streams to drive automated workflows.",
    content: "Automated business workflows require deterministic outcomes. By feeding highly structured Gemini prompt layouts paired with robust Node.js backend validation layers, developers can achieve flawless code generation, smart content parsing, and autonomous lead routing safely.",
    author: "Nexbot Team",
    category: "Artificial Intelligence",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
    createdAt: "May 28, 2026"
  }
];

export const PRICING_TICKETS = [
  {
    name: "Starter Package",
    price: 2500,
    subtitle: "Ideal for growing startups needing strategic AI integration or advanced web design.",
    features: [
      "Custom Futuristic Responsive Frontend",
      "Core AI Integrations (1 Model Gateway)",
      "Firestore Persistent Database Layout",
      "PayPal Standard Payment Integration",
      "Standard Contact Lead Dashboard",
      "3 Weeks Operational Support"
    ],
    glowClass: "from-blue-500/20 to-cyan-500/0"
  },
  {
    name: "Professional Package",
    price: 4999,
    subtitle: "Perfect for scaling startups. Deep automation, comprehensive panels, and billing setup.",
    features: [
      "Full Stack Next.js / React Architecture",
      "Custom Multi-Agent Cognitive Automations",
      "PayPal Checkout + Auto Invoice Generation",
      "Comprehensive Secure Admin Dashboard",
      "Hardened Access-Controlled Firestore rules",
      "Robust REST API Infrastructure",
      "6 Weeks Production SLA Support"
    ],
    glowClass: "from-purple-500/30 via-blue-500/20 to-transparent",
    popular: true
  },
  {
    name: "Enterprise Package",
    price: 9999,
    subtitle: "Custom-crafted digital transformation for high-capacity multi-market applications.",
    features: [
      "Complete Technology Consulting & Discovery",
      "Unlimited Multi-Agent Pipelines",
      "Complex Custom Database Schemas (Firestore + SQL)",
      "Custom Branded Administrative Platform",
      "Fully Scalable Server Operations",
      "Strategic Photo & Amazon KDP Layout Designs",
      "Dedicated 24/7 Solution Architect",
      "12 Months Tech SLA Protection"
    ],
    glowClass: "from-cyan-500/25 with-purple-500/20 to-transparent"
  }
];
