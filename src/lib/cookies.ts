import type { RequestEvent } from '@sveltejs/kit';

export const CONSENT_COOKIE_NAME = 'cookie-consent';

export function checkConsentCookie(event: RequestEvent) {
	return event.cookies.get(CONSENT_COOKIE_NAME) === 'true';
}

export function setConsentCookie(event: RequestEvent) {
	event.cookies.set(CONSENT_COOKIE_NAME, 'true', { path: '/' });
}
