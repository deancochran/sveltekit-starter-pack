// routes/login/github/callback/+server.ts
import { auth, githubAuth } from "$lib/server/lucia.js";
import { OAuthRequestError } from "@lucia-auth/oauth";
// import type { GithubUser } from "@lucia-auth/oauth/providers";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { ToastSettings } from "@skeletonlabs/skeleton";
import { redirect } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";

export const GET = async (event) => {
	const { url, cookies, locals } = event
	const storedState = cookies.get("github_oauth_state");
	const state = url.searchParams.get("state");
	const code = url.searchParams.get("code");
	let githubUserError

	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}
	try {
		const { getExistingUser, githubUser, createUser } =
			await githubAuth.validateCallback(code);
		githubUserError=githubUser

		const getUser = async () => {
			const existingUser = await getExistingUser();
			if (existingUser) return existingUser;
			console.log(githubUser)
			if(!githubUser.email){
				throw new Error('Github Users must sign-up with a publicly available email.');
			}
			const user = await createUser({
                attributes: {
					// user:email scope used for github authentication
                    email: githubUser.email!,
                    username: githubUser.login,
                    email_verified: false
                }
			});
			return user;
		};

		const user = await getUser();
		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});
		locals.auth.setSession(session);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
	} catch (error) {
		console.log(error)
		let t: ToastSettings;
		if (error instanceof PrismaClientKnownRequestError && githubUserError) {
			t = {
				message: 'Request Error',
				background: 'variant-filled-warning'
			} as const;
			if (error.meta) {
				if (error.meta.target == 'email')
					t = {
						message: `Github Email: ${githubUserError.email} Already Exists`,
						background: 'variant-filled-warning'
					} as const;
				if (error.meta.target == 'username')
					t = {
						message: `Github Username: ${githubUserError.login} Already Exists`,
						background: 'variant-filled-warning'
					} as const;
			}
		}else if(error instanceof OAuthRequestError){
			// invalid code
			return new Response(null, {
				status: 400
			});
		}else {
			t = {
				message: 'Unknown Error',
				background: 'variant-filled-warning'
			} as const;
		}
		setFlash(t, event);
		throw redirect(301,'/sign-up')
	}
};