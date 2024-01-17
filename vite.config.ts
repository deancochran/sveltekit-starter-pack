import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	// Vite uses Chokidar under the hood to watch files,
	// and its default method of doing so doesn't work in Docker containers.
	// set server.watch.usePolling to true to enable HMR
	server: {
		watch: {
			usePolling: true
		}
	}
});
