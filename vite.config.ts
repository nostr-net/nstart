import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			preprocess: vitePreprocess(),
			adapter: adapter(),
			csp: {
				mode: 'auto',
				directives: {
					'default-src': ['self'],
					// SvelteKit appends hashes/nonces for the scripts it renders
					'script-src': ['self', 'wasm-unsafe-eval'],
					'style-src': ['self', 'unsafe-inline'],
					'img-src': ['self', 'https:', 'data:', 'blob:'],
					'connect-src': ['self', 'https:', 'wss:'],
					'worker-src': ['self', 'blob:'],
					'font-src': ['self', 'data:'],
					'object-src': ['none'],
					'base-uri': ['self'],
					'form-action': ['self']
					// no frame-ancestors: this app is intentionally embedded in
					// third-party sites as an iframe modal
				}
			}
		})
	],
	optimizeDeps: {
		exclude: ['hash-wasm']
	}
});
