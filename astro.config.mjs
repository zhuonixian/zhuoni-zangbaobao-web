// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwind()],
  },
  site: 'https://zangbaobao-zhuonixian.pages.dev',
});
