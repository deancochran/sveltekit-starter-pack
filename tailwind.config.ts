import { join } from 'path';
import type { Config } from 'tailwindcss';

// 1. Import the Skeleton plugin
import { skeleton } from '@skeletonlabs/tw-plugin';

import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
// import aspect_ratio from '@tailwindcss/aspect-ratio';
// import container_queries from '@tailwindcss/container-queries';

const config = {
	// 2. Opt for dark mode to be handled via the class method
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		// 3. Append the path to the Skeleton package
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {}
	},
	plugins: [
		forms,
		typography,
		// 4. Append the Skeleton plugin (after other plugins)
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
