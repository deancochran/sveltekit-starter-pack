import { dev } from "$app/environment";

export const site_name = 'Cadence'

export const title = 'Cadence Blog'
export const description = 'Edurance Athletics Insights, findings, and news'
export const url = dev ? 'http://localhost:5173/' : 'http://example.com'


export type NavItem = {
	title: string;
	href?: string;
	disabled?: boolean;
	label?: string;
};


interface DocsConfig {
	mainNav: NavItem[];
}

export const docsConfig: DocsConfig = {
	mainNav: [
		{
			title: "Dashboard",
			href: "/",
		},
		{
			title: "Blog",
			href: "/blog",
		},
		// {
		// 	title: "Components",
		// 	href: "/docs/components/accordion",
		// },
		// {
		// 	title: "Themes",
		// 	href: "/themes",
		// },
		// {
		// 	title: "Examples",
		// 	href: "/examples/dashboard",
		// },
		// {
		// 	title: "GitHub",
		// 	href: "https://github.com/huntabyte/shadcn-svelte",
		// },
	],
};
