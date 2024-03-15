import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type { Categories, ContentType, Post } from './types';
import { markdownToHTML } from './markdown';

async function parseMarkdownFiles() {
	try {
		const posts: Post[] = [];
		const postsPath = path.resolve('./src/posts');
		const post_filenames = await fs.readdir(postsPath);
		for (const filename of post_filenames) {
			const markdownFilePath = path.join(postsPath, `${filename}`);
			const markdownContent = await fs.readFile(markdownFilePath, 'utf-8');
			const { data } = matter(markdownContent);

			posts.push(data as Post);
		}
		return posts;
	} catch (e) {
		throw new Error('Could not parse Markdown files');
	}
}

async function parseMarkdownFile(slug: string) {
	const postPath = path.resolve(`./src/posts/${slug}.md`);
	const markdownContent = await fs.readFile(postPath, 'utf-8');
	return markdownToHTML(markdownContent);
}

export async function getPosts() {
	let posts = await parseMarkdownFiles();

	posts = posts.sort((firstItem, secondItem) => {
		return new Date(secondItem.date).getTime() - new Date(firstItem.date).getTime();
	});

	return posts;
}

export async function getPostsByCategory(category: string) {
	const posts = await getPosts();
	return posts.filter((post) => post.published && post.categories.includes(category as Categories));
}

export async function getPost(slug: string): Promise<ContentType> {
	return parseMarkdownFile(slug);
}
export async function getDeatilPosts(): Promise<ContentType[]> {
	const posts: ContentType[] = [];
	const postsPath = path.resolve('./src/posts');
	const post_filenames = await fs.readdir(postsPath);
	for (const filename of post_filenames) {
		const file_slug = `${filename.split('.')[0]}`;
		posts.push(await getPost(file_slug));
	}
	return posts;
}
