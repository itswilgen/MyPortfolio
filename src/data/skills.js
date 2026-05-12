const DEVICON_BASE =
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";
const SIMPLE_ICON_BASE = "https://cdn.simpleicons.org";

const devicon = (path, label, version = "latest") => ({
  src:
    version === "latest"
      ? `${DEVICON_BASE}/${path}`
      : `https://cdn.jsdelivr.net/gh/devicons/devicon@${version}/icons/${path}`,
  label,
});

const simpleIcon = (slug, color, label) => ({
  src: `${SIMPLE_ICON_BASE}/${slug}/${color}`,
  label,
});

export const SKILLS = {
  Frontend: [
    {
      name: "React / Vite",
      level: 90,
      logos: [
        devicon("react/react-original.svg", "React"),
        devicon("vitejs/vitejs-original.svg", "Vite"),
      ],
    },
    {
      name: "JavaScript (ES6+)",
      level: 88,
      logos: [devicon("javascript/javascript-original.svg", "JavaScript")],
    },
    {
      name: "HTML5 / CSS3",
      level: 92,
      logos: [
        devicon("html5/html5-original.svg", "HTML5"),
        devicon("css3/css3-original.svg", "CSS3"),
      ],
    },
    {
      name: "Tailwind CSS",
      level: 85,
      logos: [devicon("tailwindcss/tailwindcss-original.svg", "Tailwind CSS")],
    },
  ],
  Backend: [
    {
      name: "Node.js / Express",
      level: 84,
      logos: [
        devicon("nodejs/nodejs-original.svg", "Node.js"),
        devicon("express/express-original.svg", "Express"),
      ],
    },
    {
      name: "REST API Design",
      level: 86,
      logos: [
        simpleIcon("postman", "FF6C37", "Postman"),
        simpleIcon("openapiinitiative", "6BA539", "OpenAPI"),
      ],
    },
    {
      name: "PHP / Laravel",
      level: 75,
      logos: [
        devicon("php/php-original.svg", "PHP"),
        devicon("laravel/laravel-original.svg", "Laravel"),
      ],
    },
    {
      name: "JWT / Auth",
      level: 80,
      logos: [
        simpleIcon("jsonwebtokens", "000000", "JSON Web Tokens"),
        simpleIcon("auth0", "EB5424", "Auth0"),
      ],
    },
  ],
  Database: [
    {
      name: "MySQL / MariaDB",
      level: 82,
      logos: [
        devicon("mysql/mysql-original.svg", "MySQL"),
        devicon("mariadb/mariadb-original.svg", "MariaDB"),
      ],
    },
    {
      name: "phpMyAdmin",
      level: 78,
      logos: [simpleIcon("phpmyadmin", "6C78AF", "phpMyAdmin")],
    },
    {
      name: "Firebase",
      level: 76,
      logos: [devicon("firebase/firebase-original.svg", "Firebase")],
    },
    {
      name: "SQLite / MongoDB",
      level: 68,
      logos: [
        devicon("sqlite/sqlite-original.svg", "SQLite"),
        devicon("mongodb/mongodb-original.svg", "MongoDB"),
      ],
    },
  ],
  Tools: [
    {
      name: "Git / GitHub",
      level: 87,
      logos: [
        devicon("git/git-original.svg", "Git"),
        devicon("github/github-original.svg", "GitHub"),
      ],
    },
    {
      name: "XAMPP / Linux",
      level: 80,
      logos: [
        simpleIcon("xampp", "FB7A24", "XAMPP"),
        devicon("linux/linux-original.svg", "Linux"),
      ],
    },
    {
      name: "Vercel / Deploy",
      level: 78,
      logos: [devicon("vercel/vercel-original.svg", "Vercel")],
    },
    {
      name: "Figma",
      level: 70,
      logos: [devicon("figma/figma-original.svg", "Figma")],
    },
  ],
};

export const SKILL_TABS = Object.keys(SKILLS);
