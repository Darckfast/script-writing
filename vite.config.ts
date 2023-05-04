import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [tsconfigPaths(), svelte()],
	server: {
		port: 5177
	},
	test: {
		reporters: 'junit',
		outputFile: 'results/report.xml'
	}
})
