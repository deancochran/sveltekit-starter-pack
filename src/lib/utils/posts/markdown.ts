import matter from 'gray-matter';
import type { ContentType, Post } from './types';
import { compile } from 'mdsvex';
import { mdsvexOptions } from '../../../../svelte.config';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function searchAndReplace(content: string, slug: string): string {
	const embed = /{% embed src="(.*?)" title="(.*?)" %}/g;
	// const video = /{% video src="(.*?)" %}/g
	// const image = /{% img src="(.*?)" alt="(.*?)" %}/g
	// const youtube = /{% youtube id="(.*?)" title="(.*?)" %}/g

	return content.replace(embed, (_, src, title) => {
		return `
        <iframe
          title="${title}"
          src="${src}"
          loading="lazy"
        ></iframe>
      `.trim();
	});
	//     .replace(video, (_, src) => {
	//         return `
	//     <video controls>
	//       <source
	//         src="${config.imagesUrl}/${slug}/images/${src}"
	//         type="video/mp4"
	//       />
	//     </video>
	//   `.trim()
	//     })
	//         .replace(image, (_, src, alt) => {
	//             return `
	//       <img
	//         src="${config.imagesUrl}/${slug}/images/${src}"
	//         alt="${alt}"
	//         loading="lazy"
	//       />
	//   `.trim()
	//         })
	//         .replace(youtube, (_, id, title) => {
	//             return `
	// 				<lite-youtube videoid="${id}" playlabel="${title}"></lite-youtube>
	// 			`.trim()
	//         })
}

export async function markdownToHTML(markdown: string): Promise<ContentType> {
	const { content, data } = matter(markdown);
	const c = await compile(content, mdsvexOptions);

	// I could use `compile` from mdsvex to get
	// Svelte components working inside Markdown
	// let result = await unified()
	//     // .use(c)
	//     .use(fromMarkdown)
	//     .use([
	//         // GitHub flavored Markdown
	//         // remarkGfm,

	//         // Unique identifier for headings
	//         // remarkHeadings,

	//         // Links for headings
	//         // remarkSlug,

	//         // Typographic punctuation like real quotes
	//         // remarkSmartypants,

	//         // Generates table of contents from headings
	//         // `tight` removes <p> from <li> when nested
	//         [remarkTableofContents, { tight: true }],
	//     ])
	//     // To be able to parse a mix of Markdown and HTML
	//     // `remark-rehype` is required with `rehype-raw`
	//     // https://github.com/rehypejs/rehype-raw
	//     .use(fromMarkdownToHtml, { allowDangerousHtml: true })

	//     // Adds code titles above code blocks
	//     // .use(rehypeCodeTitles)

	//     // Adds syntax highlight, line numbers and higlight
	//     // .use(rehypePrism)

	//     // For further processing turn content into a regular syntax tree
	//     .use(parseHtmlAndMarkdown)

	//     // Remove paragraph around images
	//     // .use(rehypeUnwrapImages)

	//     // Copy code to clipboard
	//     // .use(rehypeCopyCode)

	//     .use(toHtml)
	//     .process(searchAndReplace(content, data.slug))

	// const processedMarkdown = result.value

	return {
		content: c?.code as string,
		post: data as Post
	};
}
