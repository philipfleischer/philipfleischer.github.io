import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://philipfleischer.github.io',
  base: '/',
  output: 'static',
  // Inline CSS into each page so a browser-cached page never points at a
  // stylesheet hash that a newer deploy has already removed.
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src'),
      },
    },
  },
});
