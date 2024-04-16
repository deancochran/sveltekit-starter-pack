import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	setTheme: async (event) => {
		const { cookies, request, locals } = event;
		const formData = await request.formData();
		const theme = formData.get('theme')?.toString() ?? 'skeleton';
		if(locals.consent_cookie){
			cookies.set('theme', theme, { path: '/' });
		}
		return { theme };
	}
};
