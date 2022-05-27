import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { chromeExtension } from "rollup-plugin-chrome-extension";
import copy from "rollup-plugin-copy";
import manifest from './manifest.json'

export default defineConfig({
  plugins: [
    react(),
    chromeExtension({ manifest }),
    copy({
      verbose: true,
      hook: 'writeBundle',
      targets: [
        {
          src: 'images/sign_language_black_24dp.svg',
          dest: 'dist/images'
        }
      ],
    }),
  ],
});

