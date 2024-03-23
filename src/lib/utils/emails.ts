import nodemailer from 'nodemailer';
import { NODEMAILER_GMAIL_PASSWORD, NODEMAILER_GMAIL } from '$env/static/private';
import { render } from 'svelte-email';

import VerifyEmail from '$lib/emails/VerifyEmail.svelte';
import ForgottenPassword from '$lib/emails/FogottenPassword.svelte';
import { generateEmailVerificationToken, generatePasswordResetToken } from './token';
import type { User } from 'lucia';
import NewEmailCode from '$lib/emails/NewEmailCode.svelte';
import { dev } from '$app/environment';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	port: 587,
	secure: !dev, //TODO figure out this config
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
			console.log('FAILED TO Send email: ' + info.response);
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
			// break
		}
	});
}

export async function sendForgottenPasswordResetLink(user: User, url_origin: string) {
	const code = await generatePasswordResetToken(user.id);
	const emailHtml = render({
		template: ForgottenPassword,
		props: {
			origin: url_origin,
			code: code
		}
	});
	await sendEmail(user.email, 'Reset your Forgotten Password', emailHtml);
}

export async function sendEmailVerificationLink(user: User, url_origin: string) {
	const token = await generateEmailVerificationToken(user.id);
	const emailHtml = render({
		template: VerifyEmail,
		props: {
			origin: url_origin,
			token: token
		}
	});
	await sendEmail(user.email, 'Verify your email', emailHtml);
}

export async function sendEmailChangeCode(user: User, email: string) {
	const token = await generateEmailVerificationToken(user.id);
	const emailHtml = render({
		template: NewEmailCode,
		props: {
			token: token
		}
	});
	await sendEmail(email, 'Validate your change of email', emailHtml);
}
