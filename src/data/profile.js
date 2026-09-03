import profilePhoto from "../components/images/profile-1.webp";
import aboutPhoto from "../components/images/profile-2.webp";
import { RESUME_DOWNLOAD, SOCIAL_LINKS } from "../constants/theme";

export const DEFAULT_PROFILE = {
  id: "local-profile",
  name: "Wilgen Rivas",
  professionalTitle: "Full-Stack Developer, UI/UX Designer, and Web Engineer",
  heroIntro: "I design and build reliable web products with thoughtful interfaces, clear architecture, and practical business value.",
  biography: [
    "I'm a self-driven full-stack developer based in Tanjay City, Philippines, focused on building modern, scalable, and user-centered web applications.",
    "I am pursuing a Bachelor of Science in Information Technology at Negros Oriental State University – Bais Campus, where I continue developing my skills in software engineering, database management, and product design.",
    "Beyond web development, I enjoy music and DJing. That sense of rhythm influences how I approach interface flow, visual hierarchy, and interactive experiences.",
  ].join("\n\n"),
  currentFocus: "Full-stack web development and UI/UX design",
  location: "Tanjay City, Philippines",
  education: "BS Information Technology, Negros Oriental State University – Bais Campus",
  availability: "Open to freelance projects and collaborations",
  profileImageUrl: profilePhoto,
  aboutImageUrl: aboutPhoto,
  resumeUrl: RESUME_DOWNLOAD.href,
  email: SOCIAL_LINKS.email,
  socialLinks: {
    github: SOCIAL_LINKS.github,
    linkedin: SOCIAL_LINKS.linkedin,
    facebook: SOCIAL_LINKS.facebook,
  },
  heroStats: [],
};

export const DEFAULT_PAYMENT_PROOFS = [];
