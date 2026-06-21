import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://philipfleischer.github.io',
  base: '/',
  output: 'static',
  vite: {
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src'),
      },
    },
  },
});
