import {
	NODE_ENV,
	NODEMAILER_GMAIL,
	NODEMAILER_GMAIL_PASSWORD
} from '$env/static/private';
import nodemailer from 'nodemailer';
import { render } from 'svelte-email';
import {
	generateEmailVerificationToken,
	generatePasswordResetToken
} from './token';

import ForgottenPassword from '$lib/emails/FogottenPassword.svelte';
import NewEmailCode from '$lib/emails/NewEmailCode.svelte';
import VerifyEmail from '$lib/emails/VerifyEmail.svelte';
import type { user } from '$lib/drizzle/schema';
import type { InferSelectModel } from 'drizzle-orm';
import type { User } from 'lucia';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	port: 587,
	secure: NODE_ENV == 'production', //TODO figure out this config
	auth: {
		user: NODEMAILER_GMAIL,
		pass: NODEMAILER_GMAIL_PASSWORD
	}
});

export async function sendEmail(
	toEmail: string,
	toSubject: string,
	html: string
) {
	const options = {
		from: NODEMAILER_GMAIL,
		to: toEmail,
		subject: toSubject,
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

export async function sendForgottenPasswordResetLink(
	_user: InferSelectModel<typeof user> | User,
	urlOrigin: string
) {
	const code = await generatePasswordResetToken(_user.id);
	const emailHtml = render({
		template: ForgottenPassword,
		props: {
			origin: urlOrigin,
			code: code
		}
	});
	await sendEmail(_user.email, 'Reset your Forgotten Password', emailHtml);
}

export async function sendEmailVerificationLink(
	_user: InferSelectModel<typeof user> | User
) {
	const token = await generateEmailVerificationToken(_user.id);
	const emailHtml = render({
		template: VerifyEmail,
		props: {
			token: token
		}
	});
	await sendEmail(_user.email, 'Verify your email', emailHtml);
}

export async function sendEmailChangeCode(
	_user: InferSelectModel<typeof user> | User,
	email: string
) {
	const token = await generateEmailVerificationToken(_user.id);
	if (!token.id) throw new Error('token has no id');
	const emailHtml = render({
		template: NewEmailCode,
		props: {
			_emailVerificationToken: token
		}
	});
	await sendEmail(email, 'Validate your change of email', emailHtml);
}
