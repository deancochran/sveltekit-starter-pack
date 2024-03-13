
// src/hooks.server.ts
import { lucia } from "$lib/server/lucia/auth";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const session_id = event.cookies.get(lucia.sessionCookieName);
	if (!session_id) {
		event.locals.user = undefined;
		event.locals.session = undefined;
		return await resolve(event)
	}

	const { session, user } = await lucia.validateSession(session_id);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		// sveltekit types deviates from the de-facto standard
		// you can use 'as any' too
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
	}
	event.locals.user = user ?? undefined;
	event.locals.session = session ?? undefined;
	console.log(`${event.locals.user?.email} at ${event.route.id}`);
	return await resolve(event)
};


