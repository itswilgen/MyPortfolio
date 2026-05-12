# Wilgen — Full Stack Developer Portfolio

A modern, professional portfolio built with **React + Vite + Tailwind CSS**.

## Tech Stack

- React 18
- React Router v6
- Vite 5
- Tailwind CSS 3
- Deployed on Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Copy env example and fill in your keys
cp .env.example .env

# Run dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── assets/          Static images and icons
├── constants/       Theme colors, nav links
├── data/            Projects, skills, experiences arrays
├── hooks/           Custom React hooks
├── layouts/         MainLayout, PageWrapper
├── pages/           Home, ProjectDetail, NotFound
├── components/
│   ├── ui/          Generic UI primitives
│   ├── sections/    Portfolio sections (Hero, About…)
│   ├── navigation/  Navbar, MobileMenu
│   └── cards/       ProjectCard, SkillCard
└── utils/           scrollTo helper
```

## Customization

1. Edit `src/data/projects.js` to add your own projects
2. Edit `src/data/skills.js` to adjust skill levels
3. Update `src/constants/theme.js` for colors and nav links
4. Replace images in `src/assets/images/`

## Deployment

Push to GitHub and connect the repo to [Vercel](https://vercel.com). The `vercel.json` handles SPA routing automatically.
