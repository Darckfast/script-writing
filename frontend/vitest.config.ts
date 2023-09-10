import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],
    reporters: ['default', 'junit'],
    coverage: {
      provider: 'istanbul',
      reportsDirectory: 'results',
      reporter: [
        'text-summary',
        ['cobertura', { file: 'cobertura.xml' }]
      ]
    },
    outputFile: {
      junit: 'results/report.xml',
      lcov: 'results/lcov.info'
    }
  },
  resolve: {
    alias: {
      '@/stores': path.resolve(
        __dirname,
        './src/lib/stores'
      ),
      '@': path.resolve(__dirname, './src')
    }
  }
})
