import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import type { Map } from 'maplibre-gl';

function initMap() {
	const { subscribe, set, update } = writable<Map | undefined>(undefined);
	return {
		subscribe,
		set,
		update,
		/** Clear Map */
		clear: () => set(undefined)
	};
}

export type MaplibreMap = ReturnType<typeof initMap>;
const MAP_CONTEXT_KEY: string = 'mapStore';

export function getMapContext(): MaplibreMap {
	const mapStore = getContext<MaplibreMap>(MAP_CONTEXT_KEY);
	if (!mapStore) throw new Error('mapStore is not initialized.');
	return mapStore;
}

export function setMapContext(): MaplibreMap {
	const mapStore = initMap();
	return setContext(MAP_CONTEXT_KEY, mapStore);
}
