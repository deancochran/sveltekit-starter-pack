import { json } from '@sveltejs/kit';
import matter from 'gray-matter';

const patterns: Record<string, RegExp> = {
	frontmatter: /---.*?---/gs,
	code: /```.*?\n|```/gs,
	inline: /`([^`]*)`/g,
	heading: /^#{1,6}\s.*$/gm,
	link: /\[([^\]]+)\]\(([^)]+)\)/g,
	image: /!\[.*?\]\(.*?\)/g,
	blockquote: /> /gm,
	bold: /\*\*/g,
	italic: /\b_([^_]+)_(?!\w)/g,
	special: /{%.*?%}/g,
	tags: /[<>]/g
};

const htmlEntities: Record<string, string> = {
	'<': '&lt;',
	'>': '&gt;'
};

function stripMarkdown(markdown: string) {
	for (const pattern in patterns) {
		switch (pattern) {
			case 'inline':
				markdown = markdown.replace(patterns[pattern], '$1');
				break;
			case 'tags':
				markdown = markdown.replace(patterns[pattern], (match) => htmlEntities[match]);
				break;
			case 'link':
				markdown = markdown.replace(patterns[pattern], '$2');
				break;
			case 'italic':
				markdown = markdown.replace(patterns[pattern], '$1');
				break;
			default:
				markdown = markdown.replace(patterns[pattern], '');
		}
	}

	return markdown;
}

export async function GET() {
	const paths = import.meta.glob('../../../../posts/*.md', {
		query: 'raw',
		import: 'default',
		eager: true
	});
	const posts = Object.entries(paths)
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		.map(([_, content]) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-expect-error
			const frontmatter = matter(content);

			if (frontmatter.data.published == false) {
				return null;
			}

			return {
				...frontmatter.data,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				//@ts-expect-error
				content: stripMarkdown(content)
			};
		})
		.filter(Boolean);
	return json(posts);
}

export const prerender = false;
