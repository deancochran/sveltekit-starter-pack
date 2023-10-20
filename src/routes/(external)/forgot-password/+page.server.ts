import { superValidate } from "sveltekit-superforms/server";
import type { Actions, PageServerLoad } from "./$types";
import { forgot_pass_schema, signin_schema } from "$lib/schemas";
import type { ToastSettings } from "@skeletonlabs/skeleton";
import { redirect } from "sveltekit-flash-message/server";
import { sendForgottenPasswordResetLink } from "$lib/utils/email";

export const load: PageServerLoad = async () => {
	const forgotPassForm = await superValidate(signin_schema);
	return { forgotPassForm };
};


export const actions: Actions = {
	forgot: async (event) => {
        const { url, request, locals } = event;
		const form = await superValidate(request, forgot_pass_schema);

		const session = await locals.auth.validate();
		if (session) throw redirect(302, '/');
        let t: ToastSettings
		try {
			const user = await prisma.user.findUniqueOrThrow({ where: { email: form.data.email } });
            if(user){
                await sendForgottenPasswordResetLink(user, url.origin);
            }
            t = {
                message: `A New Password Reset Link was Sent`,
                background: 'variant-filled-success'
            } as const;
            
		} catch (error) {
			let message;
			if (error instanceof Error) {
				message = error.message;
			} else {
				message = String(error);
			}
			t = {
				message: message,
				background: 'variant-filled-warning'
			} as const;
		}
        throw redirect('/',t,event);
	}
};
