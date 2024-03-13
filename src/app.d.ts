// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user?: import("lucia").User;
			session?: import("lucia").Session;
		}
		// interface Error {}
		// interface PageData {}
		interface PageData {
			// flash?: ToastSettings;
			session?: import('lucia').Session
			user?: import('lucia').User
			pathname?: string;
			// title?: string;
			// description?: string;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
