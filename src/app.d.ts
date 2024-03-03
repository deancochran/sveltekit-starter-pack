import type { PrismaClient } from '@prisma/client';
import type {  UserRole } from '@prisma/client';
import type { ToastSettings } from '@skeletonlabs/skeleton/index.js';

declare global {
	
	let prisma: PrismaClient;

	namespace App {
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
		interface Error {
			code: string;
		}
		interface PageData {
			flash?: ToastSettings;
			session?: Session;
			pathname?: string;
			title?: string;
			description?: string;
		}
	}

	/// <reference types="lucia" />
	declare namespace Lucia {
		type Auth = import('./lucia.js').Auth; // no change
		type DatabaseUserAttributes = {
			email: string;
			username: string;
			email_verified: boolean;
			created_at: Date | undefined;
			stripe_id: string | undefined;
			role: UserRole | undefined;
			bike_ftp: number | undefined;
			swim_ftp: number | undefined;
			run_ftp: number| undefined;
		};
		type DatabaseSessionAttributes = object;
	}

	
}

export {};
