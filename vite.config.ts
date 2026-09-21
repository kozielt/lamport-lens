import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the app from /<repo>/; the deploy workflow sets this.
  base: process.env.VITE_BASE ?? '/',
  resolve: {
    // @solana/web3.js v1 and its deps import Node's `buffer`, which Vite
    // stubs out in the browser. Point every importer at the npm package.
    alias: { buffer: 'buffer/' },
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
})
