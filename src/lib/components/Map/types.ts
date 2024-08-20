import type { Map } from 'maplibre-gl';
import type { EventDispatcher } from 'svelte';

export type MapEvent = {
	load: Map;
};
export type MapEventDispatcher = EventDispatcher<MapEvent>;
