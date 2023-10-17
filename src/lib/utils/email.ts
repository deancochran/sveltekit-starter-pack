export const sendEmailVerificationLink = async (email, token: string) => {
	const url = `http://localhost:3000/email-verification/${token}`;
	// await sendEmail(email, {
	// 	// ...
	// });
};