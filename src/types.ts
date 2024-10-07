import type socialIcons from "@assets/socialIcons";

export type Site = {
  website: string,
  author: string,
  profile: string,
  description: string,
  title: string,
  postsPerIndex: number,
  postsPerPage: number,
  scheduledPostMargin: number,
};

export type SocialObjects = {
  name: keyof typeof socialIcons,
  href: string,
  linkTitle: string,
}[];
