// routes/signup/+page.server.ts
import { auth } from "$lib/server/lucia";
import { fail, redirect } from "@sveltejs/kit";

import type { PageServerLoad} from "./$types";
export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, "/");
};

import type { Actions } from "./$types";

export const actions: Actions = {
	signin: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = String(formData.get("email"));
		const password = String(formData.get("password"));

		try{
			const key = await auth.useKey(
				"email",
				email,
				password
			);
			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});
			locals.auth.setSession(session); // set session cookie
		}catch(e){
			return fail(500, {
				message: "An unknown error occurred"
			});
		}

		throw redirect(302, "/");
	}
	
};