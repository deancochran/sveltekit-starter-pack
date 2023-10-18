import { z } from 'zod';
export const signup_schema = z
	.object({
		email: z.string().email(),
		username: z.string(),
		password: z.string(),
		val_password: z.string()
	})
	.superRefine(({ val_password, password }, ctx) => {
		if (val_password !== password) {
			ctx.addIssue({ code: 'custom', message: 'The passwords did not match', path: ["val_password"]});
		}
	});
export type SignUpSchema = typeof signup_schema;
