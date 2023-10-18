import type { PrismaClient } from '@prisma/client';
import type { ToastSettings } from '@skeletonlabs/skeleton/index.js';
// import

declare global {
	namespace NodeJS {
		interface Global {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			prisma: any;
		}
	}
	namespace App {
		interface Locals {
			auth: import('lucia').AuthRequest;
			user;
		}
		interface Error {
			code: string;
		}
		interface PageData {
			flash?: ToastSettings;
		}
	}

	/// <reference types="lucia" />
	declare namespace Lucia {
		type Auth = import('./lucia.js').Auth; // no change
		type DatabaseUserAttributes = {
			email: string;
			username: string;
			email_verified: boolean;
		};
		type DatabaseSessionAttributes = object;
	}
	let prisma: PrismaClient;
}

export {};
