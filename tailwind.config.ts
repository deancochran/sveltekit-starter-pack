import { join } from 'path';
import type { Config } from 'tailwindcss';

import { skeleton } from '@skeletonlabs/tw-plugin';

import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {}
	},
	// corePlugins: {
	// 	aspectRatio: false,
	// },
	plugins: [
		forms,
		typography,
		require('@tailwindcss/container-queries'),
		// require('@tailwindcss/aspect-ratio'),
		skeleton({
			themes: {
				preset: [
					'crimson',
					'gold-nouveau',
					'hamlindigo',
					'modern',
					'rocket',
					'sahara',
					'seafoam',
					'skeleton',
					'vintage',
					'wintry'
				]
			}
		})
	]
} satisfies Config;

export default config;
