import matter from 'gray-matter';
import path from 'path';
import fs from 'fs/promises';
import type { Post, ContentType } from './types';
import { compile } from 'mdsvex';

export async function getPosts() {
	let posts: Post[] = [];

	const paths = import.meta.glob('/src/posts/*.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];
		const slug = path.split('/').at(-1)?.replace('.md', '');

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug'>;
			const post = { ...metadata, slug } satisfies Post;
			post.published && posts.push(post);
		}
	}

	posts = posts.sort(
		(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	);

	return posts;
}

// async function parseMarkdownFiles() {
// 	try {
// 		const posts: Post[] = [];
// 		const postsPath = path.resolve('./src/posts');
// 		const post_filenames = await fs.readdir(postsPath);
// 		for (const filename of post_filenames) {
// 			const markdownFilePath = path.join(postsPath, `${filename}`);
// 			const markdownContent = await fs.readFile(markdownFilePath, 'utf-8');
// 			const { data } = matter(markdownContent);

// 			posts.push(data as Post);
// 		}
// 		return posts;
// 	} catch (e) {
// 		throw new Error('Could not parse Markdown files');
// 	}
// }

async function parseMarkdownFile(slug: string) {
	const postPath = path.resolve(`./src/posts/${slug}.md`);
	const markdownContent = await fs.readFile(postPath, 'utf-8');
	return markdownToHTML(markdownContent);
}

// export async function getPosts() {
// 	let posts = await parseMarkdownFiles();

// 	posts = posts.sort((firstItem, secondItem) => {
// 		return new Date(secondItem.date).getTime() - new Date(firstItem.date).getTime();
// 	});

// 	return posts;
// }

// export async function getPostsByCategory(category: string) {
// 	const posts = await getPosts();
// 	return posts.filter((post) => post.published && post.categories.includes(category as Categories));
// }

export async function getPost(slug: string): Promise<ContentType> {
	return parseMarkdownFile(slug);
}
export async function getDetailPosts(): Promise<ContentType[]> {
	const posts: ContentType[] = [];
	const postsPath = path.resolve('./src/posts');
	const post_filenames = await fs.readdir(postsPath);
	for (const filename of post_filenames) {
		const file_slug = `${filename.split('.')[0]}`;
		posts.push(await getPost(file_slug));
	}
	return posts;
}
export async function markdownToHTML(markdown: string): Promise<ContentType> {
	const { content, data } = matter(markdown);
	const c = await compile(content);

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

	//     // Adds syntax highlight, line numbers and highlight
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
