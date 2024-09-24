import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://kaascevich.github.io/", // replace this with your deployed domain
  author: "Kaleb A. Ascevich",
  profile: "https://kaascevich.github.io/",
  desc: "my tiny little haven on the internet",
  title: "kaascevich",
  // ogImage: "og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 5,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/kaascevich",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:cloths-fringe0s@icloud.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
  {
    name: "Discord",
    href: "https://discord.com/users/1181742723917688882",
    linkTitle: `${SITE.title} on Discord`,
    active: true,
  },
  {
    name: "Steam",
    href: "https://steamcommunity.com/id/macOSisthebestOS/",
    linkTitle: `${SITE.title} on Steam`,
    active: true,
  },
];
