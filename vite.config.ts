import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import copy from 'rollup-plugin-copy';
import manifest from './manifest.json';

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    copy({
      verbose: true,
      hook: 'writeBundle',
      targets: [
        {
          src: 'images/sign_language_black_24dp.svg',
          dest: 'dist/images',
        },
        {
          src: 'options.js',
          dest: 'dist',
        },
      ],
    }),
  ],
});
