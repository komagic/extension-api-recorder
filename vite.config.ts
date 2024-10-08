/// <reference types="vitest" />
/** @type {import('vite').UserConfig} */

import react from '@vitejs/plugin-react';

import type { InlineConfig } from 'vitest';

import type { UserConfig } from 'vite';

import autoprefixer from 'autoprefixer';

import { defineConfig } from 'vite';

import tailwindcss from 'tailwindcss';

import path, { resolve } from 'path';

import { getPlugins } from './utils/vite';


type ViteConfig = UserConfig & { test: InlineConfig };
const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');
const pagesDir = resolve(srcDir, 'pages');

const isDev = process.env.__DEV__ === 'true';
const isProduction = !isDev;


export default defineConfig({
  resolve: {
    alias: {
      '@root': rootDir,
      '@src': srcDir,
      '@assets': resolve(srcDir, 'assets'),
      '@pages': pagesDir,
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [...getPlugins(isDev), react()],
  publicDir: resolve(rootDir, 'public'),

  build: {
    outDir: resolve(rootDir, 'dist'),
    /** Can slow down build speed. */
    // sourcemap: isDev,
    minify: isProduction,
    modulePreload: false,
    reportCompressedSize: isProduction,
    emptyOutDir: !isDev,
    rollupOptions: {
      input: {
        contentInjected: resolve(pagesDir, 'content', 'injected', 'index.ts'),
        contentUI: resolve(pagesDir, 'content', 'ui', 'index.ts'),
        background: resolve(pagesDir, 'background', 'index.ts'),
        contentStyle: resolve(pagesDir, 'content', 'style.scss'),
        popup: resolve(pagesDir, 'popup', 'index.html'),
        options: resolve(pagesDir, 'options', 'index.html'),
      },

      output: {
        entryFileNames: 'src/pages/[name]/index.js',
        // chunkFileNames: isDev ? 'assets/js/[name].[hash].js' : 'assets/js/[name].[hash].js',
        chunkFileNames: isDev ? 'assets/js/[name].js' : 'assets/js/[name].js',
        assetFileNames: assetInfo => {
          const { name } = path.parse(assetInfo.name);
          const assetFileName = name === 'contentStyle' ? `${name}` : name;
          return `assets/[ext]/${assetFileName}.chunk.[ext]`;
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.test.ts', '**/*.test.tsx'],
    setupFiles: './test-utils/vitest.setup.js',
  },
} as ViteConfig);
