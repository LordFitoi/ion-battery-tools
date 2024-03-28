import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import vue from "@astrojs/vue";
const site = 'https://lordfitoi.github.io/ion-battery-tools/';
const base = process.env.NODE_ENV != "development" ? '/ion-battery-tools/' : "";

// https://astro.build/config
export default defineConfig({
  site: site,
  base: base,
  integrations: [tailwind(), vue()]
});