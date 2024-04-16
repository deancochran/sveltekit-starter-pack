import type { PrismaClient } from '@prisma/client';
import type { ToastSettings } from '@skeletonlabs/skeleton/index.js';

declare global {
	let prisma: PrismaClient;

	namespace App {
		interface Locals {
			user?: import('lucia').User;
			session?: import('lucia').Session;
			consent_cookie?: boolean;
		}
		interface Error {
			code: string;
		}
		interface PageData {
			flash?: ToastSettings;
			session?: Session;
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
