import aquaFillPreview from "../components/images/AquaFill.png";
import petronPreview from "../components/images/Petron.png";
import whisperPreview from "../components/images/Whisper.png";

export const PROJECT_RECORDS = [
  {
    id: "aquafill",
    title: "AquaFill",
    subtitle: "Water Refilling Station System",
    description:
      "Full-stack management system for water refilling businesses. Features a customer portal, billing management, order tracking, Firebase Google Auth, real-time dashboards with Recharts, and a responsive mobile layout.",
    longDescription:
      "AquaFill is a complete business management solution for water refilling stations. The system includes an admin dashboard for managing orders, tracking deliveries, generating bills, and viewing analytics. The customer portal allows users to place orders, view order history, track bills, and manage their profile. Authentication is handled via Firebase Google OAuth, with JWT tokens securing all API endpoints on the Node.js/Express backend.",
    tags: ["React", "Vite", "Node.js", "Express", "MariaDB", "Firebase"],
    image: aquaFillPreview,
    imageAlt: "AquaFill landing page preview",
    color: "#0ea5e9",
    status: "Completed",
    github: "https://github.com/itswilgen/AquaFill",
    demo: "https://aqua-fill-zeta.vercel.app/",
    features: [
      "Customer portal with order tracking",
      "Admin dashboard with analytics",
      "Firebase Google OAuth",
      "JWT-secured REST API",
      "Billing and invoice generation",
      "Responsive mobile layout",
    ],
    stack: {
      frontend: ["React 18", "Vite", "React Router", "Axios", "Recharts", "Firebase Auth"],
      backend: ["Node.js", "Express", "OOP Architecture", "JWT"],
      database: ["MariaDB", "phpMyAdmin", "XAMPP"],
    },
  },
  {
    id: "petron-inventory",
    title: "Petron Inventory",
    subtitle: "Gasoline Inventory & Sales System",
    description:
      "A thesis-level web-based gasoline inventory and sales management system inspired by real Petron station operations, developed using PHP MVC, JavaScript, Tailwind CSS, and MySQL with POS, inventory, delivery, and reporting functionalities.",
    longDescription:
      "Petron Inventory is a web-based inventory and sales management system designed for gasoline stations, specifically inspired by real-world Petron operations in the Philippines. The system streamlines fuel inventory tracking, POS transactions, delivery monitoring, and sales reporting through a modern and efficient management platform. It includes real-time fuel stock tracking, automatic low stock detection, secure authentication and session handling, organized MVC project architecture, an optimized database structure for scalability, and printable reports with a receipt-ready workflow. This project demonstrates my skills in backend system development, database management, MVC architecture, business logic implementation, and modern frontend design. The system was developed as a thesis-level full-stack project focused on solving real operational challenges in fuel station management.",
    tags: ["PHP", "MySQL", "Tailwind CSS", "JavaScript"],
    image: petronPreview,
    imageAlt: "Petron Inventory dashboard preview",
    color: "#ef4444",
    status: "Completed",
    github: "https://github.com/itswilgen/petron-system",
    demo: "https://petron-inventory.free.nf/",
    features: [
      "Fuel inventory monitoring",
      "POS transaction system",
      "Fuel delivery management",
      "Daily and monthly sales reports",
      "Low stock warning alerts",
      "Tank capacity validation",
      "Role-based authentication",
      "Dashboard analytics and KPI monitoring",
      "Printable reports and receipt-ready workflow",
    ],
    stack: {
      frontend: ["HTML", "JavaScript", "Tailwind CSS"],
      backend: ["PHP", "OOP", "MVC Architecture", "XAMPP"],
      database: ["MySQL"],
    },
  },
  {
    id: "whisper",
    title: "Whisper",
    subtitle: "Anonymous Confession Platform",
    description:
      "Whisper is a modern anonymous confession platform developed using Laravel, JavaScript, and SQLite, featuring responsive UI/UX, secure backend architecture, and real-time community interaction.",
    longDescription:
      "Whisper is a modern anonymous confession platform built for the NORSU community, allowing users to freely share thoughts, experiences, and stories in a safe and engaging environment. The platform focuses on clean UI/UX design, smooth user interaction, anonymity, and responsive performance across devices. Whisper showcases my full-stack development skills using Laravel and JavaScript, including backend logic, database management, MVC architecture, and responsive frontend design. The project demonstrates my ability to create modern, scalable, and user-centered web applications.",
    tags: ["Laravel", "JavaScript", "SQLite"],
    image: whisperPreview,
    imageAlt: "Whisper confession wall preview",
    color: "#22c55e",
    status: "In Development",
    github: "https://github.com/pinoywebs123/forum",
    demo: "https://norsuconfession.com/",
    features: [
      "Anonymous posting system",
      "Modern and responsive user interface",
      "Community confession feed",
      "Content moderation system",
      "Secure backend authentication and handling",
      "Lightweight SQLite database integration",
    ],
    stack: {
      frontend: ["JavaScript", "HTML", "CSS"],
      backend: ["Laravel Framework", "MVC Architecture"],
      database: ["SQLite"],
    },
  },
];
