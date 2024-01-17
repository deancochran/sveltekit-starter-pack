<script setup lang="ts">
	import maplibre, { type Map, type LngLatLike } from 'maplibre-gl';
	import { createEventDispatcher, onMount } from 'svelte';
	import { type MapEvent, type MapEventDispatcher } from './types';
	import { getMapContext } from './stores';

	export let map_id = 'map';
	export let map_style = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
	export let center: LngLatLike = [0, 0];
	export let zoom = 1;

	const MapDisptacher: MapEventDispatcher = createEventDispatcher<MapEvent>();
	const mapStore = getMapContext();
	function createMap(element: HTMLDivElement) {
		$mapStore = new maplibre.Map({ container: element, style: map_style, center, zoom });
		// Add geolocate control to the map.
		$mapStore.addControl(
			new maplibre.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true
				},
				trackUserLocation: true
			})
		);

		$mapStore.on('load', () => {
			MapDisptacher('load', $mapStore!);
		});

		return {
			destroy() {
				$mapStore?.remove();
			}
		};
	}
	
</script>

<div class="relative h-full w-full">
	<div class="absolute inset-0" id={map_id} use:createMap>
		<slot map={$mapStore} />
	</div>
</div>
