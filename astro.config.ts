import fs from "node:fs";
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import opengraphImages, { presets } from "astro-opengraph-images";
import { ogRender } from "./src/ogRender";
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
            name: "Iosevka Etoile Web",
            weight: 600,
            style: "normal",
            data: fs.readFileSync("public/fonts/IosevkaEtoile/TTF/IosevkaEtoile-SemiBold.ttf"),
          },
        ],
      },
      render: ogRender,
    }),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [remarkCollapse, { test: "Table of contents", }],
    ],
    rehypePlugins: [],
    shikiConfig: {
      themes: { light: "catppuccin-latte", dark: "catppuccin-frappe" },
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
