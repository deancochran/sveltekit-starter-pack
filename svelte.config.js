import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import preprocess from 'svelte-preprocess';
import {
	mdsvex
	// escapeSvelte
} from 'mdsvex';
import remarkUnwrapImages from 'remark-unwrap-images';
import remarkToc from 'remark-toc';
import remarkParse from 'remark-parse';
import rehypeSlug from 'rehype-slug';
// import { getHighlighter } from 'shiki';
import autoprefixer from 'autoprefixer';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	layout: {
		_: './src/mdsvex.svelte'
	},
	// highlight: {
	// 	highlighter: (code, language) => {
	// 		return `<Components.pre code={\`${escapeSvelte(code)}\`} language={\`${language}\`} />`;
	// 	},
	// },
	highlight: {
		highlighter(code, language = '') {
			return `<Components.pre code={\`${code}\`} language={\`${language}\`} />`;
		}
	},
	remarkPlugins: [remarkParse, remarkUnwrapImages, [remarkToc, { tight: true }]],
	rehypePlugins: [rehypeSlug]
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	extensions: ['.svelte', '.md'],
	preprocess: [
		vitePreprocess(),
		preprocess({
			postcss: true
		}),
		mdsvex(mdsvexOptions),
		autoprefixer()
	],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter()
	}
};

export default config;
