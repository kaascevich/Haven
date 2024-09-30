import fs from "node:fs";
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import opengraphImages from "astro-opengraph-images";

import remarkCollapse from "remark-collapse";
import remarkReadingTime from "./src/utils/plugins/remarkReadingTime.mjs";
import remarkToc from "remark-toc";
import rehypeFigure from "rehype-figure";
import rehypeNewTab from "./src/utils/plugins/rehypeNewTab.ts";

import sitemap from "@astrojs/sitemap";
import renderOgImage from "./src/utils/renderOgImage";
import { SITE } from "./src/config";

export default defineConfig({
  site: SITE.website,
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    sitemap(),
    opengraphImages({
      options: {
        fonts: [
          {
            name: "Recursive",
            weight: 600,
            style: "normal",
            data: fs.readFileSync("public/fonts/recursive-sans-semibold.ttf"),
          },
        ],
      },
      render: renderOgImage,
    }),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [remarkCollapse, { test: "Table of contents", }],
      remarkReadingTime,
    ],
    rehypePlugins: [
      rehypeFigure,
      [rehypeNewTab, { domain: SITE.website }],
    ],
    shikiConfig: {
      themes: { light: "catppuccin-latte", dark: "catppuccin-macchiato" },
      wrap: true,
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  scopedStyleStrategy: "where",
});
