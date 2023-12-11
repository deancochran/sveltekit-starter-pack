// src/hooks.server.ts
import { auth } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	let user_email;
	let session;
	if (event.locals?.auth) {
		session = await event.locals.auth.validate();
		if (session) {
			user_email = session.user.email;
		} else {
			user_email = 'unknown_user';
		}
	} else {
		session = undefined;
	}

	let theme = '';

	const cookieTheme = event.cookies.get('theme');

	if (cookieTheme) {
		theme = cookieTheme;
	} else {
		event.cookies.set('theme', 'skeleton');
		theme = 'skeleton';
	}

	const start = performance.now();
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${theme}"`)
	});
	const end = performance.now();

	const responseTime = end - start;

	const route = event.url;
	if (responseTime > 2000) {
		console.log(`${user_email} at ${route} took 🐢 ${responseTime.toFixed(2)} ms`);
	}

	if (responseTime < 1000) {
		console.log(`${user_email} at ${route} took 🚀 ${responseTime.toFixed(2)} ms`);
	}

	return response;
};
