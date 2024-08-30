<script setup lang="ts">
	import maplibre, { type LngLatLike, type Map } from 'maplibre-gl';
	import { v4 as uuid } from 'uuid';

	let map_id = uuid();
	let style =
		'https://api.maptiler.com/maps/outdoor-v2/style.json?key=vcLMPIc3W2UdFOStWLDw';
	export let coordinates: Array<LngLatLike>;

	let center = coordinates[0];
	let zoom = 12;
	let map: Map;

	let data = {
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'LineString',
			coordinates: coordinates
		}
	};
	const bounds = coordinates.reduce(
		(bounds, coord) => {
			return bounds.extend(coord);
		},
		new maplibre.LngLatBounds(coordinates[0], coordinates[0])
	);
	function createMap(mapContainer: HTMLDivElement): any {
		map = new maplibre.Map({
			container: mapContainer,
			style,
			center,
			zoom,
			bounds,
			fitBoundsOptions: {
				padding: { top: 20, bottom: 20, left: 20, right: 20 }
			},
			interactive: false
		});

		return {
			destroy() {
				map?.remove();
			}
		};
	}
</script>

<div class="relative h-full w-full">
	<div class="absolute inset-0" id={map_id} use:createMap />
</div>
