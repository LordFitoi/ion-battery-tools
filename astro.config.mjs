import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
const site = 'https://lordfitoi.github.io/ion-battery-tools/';
const base = process.env.NODE_ENV != "development" ? '/ion-battery-tools/': "";

export default defineConfig({
  site: site,
  base: base,
  integrations: [tailwind()]
});