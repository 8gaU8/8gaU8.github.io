// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import icon from "astro-icon";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://8gaU8.github.io",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), icon(), mdx()],
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "dracula",
      },
    },
  },
});
