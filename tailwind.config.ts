import { join } from 'path';
import type { Config } from 'tailwindcss';

import { skeleton } from '@skeletonlabs/tw-plugin';

export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(
			require.resolve('@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
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
		// require('@tailwindcss/line-clamp'),
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
