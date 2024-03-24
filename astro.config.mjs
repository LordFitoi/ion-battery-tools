import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
const site = 'https://lordfitoi.github.io/ion-battery-tools/';
const base = import.meta.env.MODE != "development" ? 'https://lordfitoi.github.io/ion-battery-tools/': "";

export default defineConfig({
  site: site,
  base: base,
  integrations: [tailwind()]
});