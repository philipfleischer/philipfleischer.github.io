import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// One id per build. Every page carries it, and /version.json always has the
// latest one, so a page can tell when the browser served it from its cache.
const BUILD_ID = (process.env.GITHUB_SHA ?? Date.now().toString(36)).slice(0, 12);

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
    define: {
      __BUILD_ID__: JSON.stringify(BUILD_ID),
    },
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src'),
      },
    },
  },
});
