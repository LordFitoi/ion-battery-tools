import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
// const site = 'https://lordfitoi.github.io';
// const base = import.meta.env.MODE != "development" ? 'https://lordfitoi.github.io': "";

export default defineConfig({
//   site: site,
//   base: base,
  integrations: [tailwind()]
});