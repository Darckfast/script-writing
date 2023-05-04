import { defineConfig } from 'cypress'

export default defineConfig({
	e2e: {
		baseUrl: 'http://localhost:5177'
	},
	reporter: 'junit',
	reporterOptions: {
		mochaFile: 'results/test-output.xml',
		toConsole: false
	}
})
