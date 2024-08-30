import type { ToastSettings } from '@skeletonlabs/skeleton/index.js';

declare global {
	namespace App {
		interface Locals {
			user?: import('lucia').User | null;
			session?: import('lucia').Session | null;
			consent_cookie?: boolean;
		}
		interface Error {
			code: string;
		}
		interface PageData {
			flash?: ToastSettings;
			session?: import('lucia').Session;
			user?: import('lucia').User;
			consent_cookie?: boolean;
			pathname?: string;
			title?: string;
			description?: string;
		}
	}
}

export {};
