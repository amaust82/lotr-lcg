import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
	plugins: [svelte()],
	resolve: {
		conditions: ['browser', 'module', 'svelte', 'import', 'default'],
		alias: {
			$lib: resolve('./src/lib'),
			'$app/navigation': resolve('./src/test-mocks/app-navigation.ts'),
		},
	},
	test: {
		environmentMatchGlobs: [
			['src/lib/components/**', 'jsdom'],
		],
		environment: 'node',
		setupFiles: ['src/test-setup.ts'],
	},
});
