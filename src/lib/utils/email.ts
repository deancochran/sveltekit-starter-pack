
import nodemailer from 'nodemailer';
import {NODEMAILER_GMAIL_PASSWORD, NODEMAILER_GMAIL} from "$env/static/private"
import { render } from 'svelte-email';

import VerifyEmail from "$lib/emails/VerifyEmail.svelte"
import ResetPassword from "$lib/emails/ResetPassword.svelte"
import { generateEmailVerificationToken, generatePasswordResetToken } from './token';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: NODEMAILER_GMAIL,
		pass: NODEMAILER_GMAIL_PASSWORD
	}
});

export async function sendEmail(to_email: string, to_subject: string, html: string) {

	const options = {
		from: NODEMAILER_GMAIL,
		to: to_email,
		subject: to_subject,
		html: html
	};
	transporter.sendMail(options, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}



// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendPasswordResetLink(user:any, url_origin:string){
	const token = await generatePasswordResetToken(user.id);
	const emailHtml = render({
		template: ResetPassword,
		props: {
			origin: url_origin,
			token: token
		}
	});
	await sendEmail(user.email, "Reset your Password", emailHtml);
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendEmailVerificationLink(user:any, url_origin:string){
	const token = await generateEmailVerificationToken(user.id);
	const emailHtml = render({
		template: VerifyEmail,
		props: {
			origin: url_origin,
			token: token
		}
	});
	await sendEmail(user.email, "Verify your email", emailHtml);
}