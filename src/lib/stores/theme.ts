import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const storeTheme = writable(
	browser ? document.body.getAttribute('data-theme') ?? '' : 'skeleton'
);
