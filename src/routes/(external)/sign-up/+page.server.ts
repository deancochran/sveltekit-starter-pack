// routes/signup/+page.server.ts
import { auth } from "$lib/server/lucia";
import { fail, redirect } from "@sveltejs/kit";

import type { PageServerLoad} from "./$types";
export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, "/");
};

import type { Actions } from "./$types";
import { generateEmailVerificationToken } from "$lib/utils/token";
import { LuciaError } from "lucia";

export const actions: Actions = {
	signup: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = String(formData.get("email"));
		const username = String(formData.get("username"));
		const password = String(formData.get("password"));
		try {
			const user = await auth.createUser({
				key: {
					providerId: "email", // auth method
					providerUserId: email.toLocaleLowerCase(), // unique id when using "email" auth method
					password // hashed by Lucia
				},
				attributes: {
					email,
					username,
					email_verified:false
				}
			});

			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});

			const token = await generateEmailVerificationToken(user.userId);
			await sendEmailVerificationLink(token);
			
			locals.auth.setSession(session); // set session cookie
			
		}catch(e){
			// this part depends on the database you're using
			// check for unique constraint error in user table
			if ( e instanceof LuciaError) {
				return new Response("Authentication Error", {
					status: 400
				});
			}
	
			return new Response("An unknown error occurred", {
				status: 500
			});
		}
		throw redirect(302, "/");
	}
};
