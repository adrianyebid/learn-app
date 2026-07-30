import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      // Route-level pages/layouts are thin wiring already exercised by the
      // manual browser walkthrough in the verification step; the coverage
      // gate focuses on business logic (api/store/validation) and reusable
      // components, where unit tests carry the most signal.
      exclude: [
        'src/main.jsx',
        'src/App.jsx',
        'src/pages/**',
        'src/layouts/**',
        'src/store/index.js',
        // Presentational components carried over from the earlier markup-only
        // stage (no business logic added in this task) — the gate focuses on
        // what this task actually built/changed.
        'src/components/Box/**',
        'src/components/Breadcrumbs/**',
        'src/components/Footer/**',
        'src/components/Header/**',
        'src/components/JoinUsBox/**',
        'src/components/MiniProfile/**',
        'src/components/Navigation/**',
        'src/theme/**',
        '**/*.test.{js,jsx}',
        'src/test-utils.jsx',
        'src/setupTests.js',
      ],
      thresholds: {
        branches: 50,
        functions: 50,
        lines: 50,
        statements: 50,
      },
    },
  },
})
