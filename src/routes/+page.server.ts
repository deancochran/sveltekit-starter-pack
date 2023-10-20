import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	setTheme: async ({ cookies, request }) => {
		const formData = await request.formData();
		const theme = formData.get('theme')?.toString() ?? 'skeleton';
		cookies.set('theme', theme, { path: '/' });
		return { theme };
	}
};
