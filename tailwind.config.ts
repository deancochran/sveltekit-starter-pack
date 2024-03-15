import { join } from 'path';
import type { Config } from 'tailwindcss';

import { skeleton } from '@skeletonlabs/tw-plugin';
import plugin from 'tailwindcss/plugin';

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
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
		require('@tailwindcss/container-queries'),
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
