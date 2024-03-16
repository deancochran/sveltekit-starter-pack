export const APP_NAME = 'cadence';
export const APP_DESCRIPTION = 'A Full Stack SvelteKit Subscription SaaS Web App Example';

export type NavItem = {
	title: string;
	icon_name: string;
	href: string;
	requires_account: boolean;
};

export const mainNav: NavItem[] = [
	{
		title: 'Dashboard',
		icon_name: 'dashboard',
		href: '/dashboard',
		requires_account: true
	},
	{
		title: 'Pricing',
		icon_name: 'pricing',
		href: '/pricing',
		requires_account: false
	},
	{
		title: 'Blog',
		icon_name: 'blog',
		href: '/blog',
		requires_account: false
	},
	{
		title: 'Settings',
		icon_name: 'settings',
		href: '/settings',
		requires_account: true
	}
];
