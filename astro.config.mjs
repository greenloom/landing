// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Custom domain: https://www.greenloom.com
// Alias @greenloom/ui to the design-system package (or local shim when the private
// package is not resolvable in this environment). The landing imports the recipes
// rather than copying them. When @greenloom/ui is published from the ui branch or
// available via auth, switch the alias back or remove it.
export default defineConfig({
	output: 'static',
	site: 'https://www.greenloom.com',
	base: '/',
	integrations: [react()],
	vite: {
		resolve: {
			alias: {
				'@greenloom/ui': new URL('./design-system/@greenloom/ui', import.meta.url).pathname,
			},
		},
	},
});
