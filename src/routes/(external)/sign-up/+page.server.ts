// routes/signup/+page.server.ts
import { auth } from "$lib/server/lucia";
import { redirect } from "@sveltejs/kit";



import type { Actions } from "./$types";
// import { generateEmailVerificationToken } from "$lib/utils/token";
import { LuciaError } from "lucia";
import { sendEmailVerificationLink } from "$lib/utils/email";

import type { PageServerLoad} from "./$types";
export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) {
		if (!session.user.email_verified) throw redirect(302, "/verify-email");
		throw redirect(302, "/");
	}
};


export const actions: Actions = {
	signup: async ({ request, locals, url }) => {
		const formData = await request.formData();
		const email = String(formData.get("email"));
		const username = String(formData.get("username"));
		const password = String(formData.get("password"));
		let session
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

			session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			await sendEmailVerificationLink(user, url.origin);
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
		if(session){
			if(session.user.email_verified){
				throw redirect(302, "/");
			}else{
				throw redirect(302, "/verify-email");
			}
		}
	}
};
