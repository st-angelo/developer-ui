import { defineConfig } from 'vite';
import * as path from 'path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

import * as pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: format => (format === 'es' ? 'index.mjs' : 'index.cjs'),
    },
    rollupOptions: {
      external: [...Object.keys(pkg.dependencies)],
    },
  },
});
