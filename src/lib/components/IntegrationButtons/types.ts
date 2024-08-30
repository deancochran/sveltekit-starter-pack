import type { EventDispatcher } from 'svelte';

export type DisconnectEvent = {
	disconnect: 'STRAVA' | 'WAHOO';
};
export type DisconnectEventDispatcher = EventDispatcher<DisconnectEvent>;
