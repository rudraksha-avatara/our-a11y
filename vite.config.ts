import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'OurA11y',
      formats: ['es', 'iife'],
      fileName: (format) => `our-a11y.${format}.js`
    },
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2019',
    rollupOptions: {
      output: {
        exports: 'named'
      }
    }
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
    setupFiles: []
  }
});
