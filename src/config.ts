import type { GiscusProps } from "@giscus/react";
import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://kaascevich.github.io/",
  author: "Kaleb A. Ascevich",
  profile: "https://kaascevich.github.io/about",
  description: "my tiny little haven on the internet",
  title: "kaascevich",
  postsPerIndex: 5,
  postsPerPage: 5,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
};

export const SOCIALS: SocialObjects = [
  {
    name: "GitHub",
    href: "https://github.com/kaascevich",
    linkTitle: `${SITE.title} on GitHub`,
  },
  {
    name: "Mail",
    href: "mailto:cloths-fringe0s@icloud.com",
    linkTitle: `send an email to ${SITE.title}`,
  },
  {
    name: "Discord",
    href: "https://discord.com/users/1181742723917688882",
    linkTitle: `${SITE.title} on Discord`,
  },
  {
    name: "Steam",
    href: "https://steamcommunity.com/id/macOSisthebestOS/",
    linkTitle: `${SITE.title} on Steam`,
  },
];

export const GISCUS: GiscusProps = {
  repo: "kaascevich/kaascevich.github.io",
  repoId: "R_kgDOM1clig",
  category: "Comments",
  categoryId: "DIC_kwDOM1clis4CiycT",
  mapping: "og:title",
  strict: "1",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "top",
  lang: "en",
};
