import type { EventDispatcher } from 'svelte';
import type { Map } from 'maplibre-gl';

export type MapEvent = {
	load: Map;
};
export type MapEventDispatcher = EventDispatcher<MapEvent>;
