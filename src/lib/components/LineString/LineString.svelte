<script lang="ts">
	import { type GeoJSONSource, type LngLatLike, type Map } from 'maplibre-gl';

	export let map: Map;
	
	let zoom: number = 15;

	export let coordinates: Array<LngLatLike>
	let center: LngLatLike = coordinates[0]

	let data = {
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'LineString',
			coordinates: [coordinates[0]]
		}
	};

	function createLine(element: HTMLDivElement) {
		map.setZoom(zoom);
		map.setCenter(center);

		// add it to the map
		map.addSource('trace', { type: 'geojson', data });
		map.addLayer({
			id: 'traceLayer',
			type: 'line',
			source: 'trace',
			paint: {
				'line-color': 'red',
				'line-width': 5
			}
		});
		// setup the viewport
		map.jumpTo({ center: coordinates[0], zoom: 15 });
		map.setPitch(30);

		// on a regular basis, add more coordinates from the saved list and update the map
		let i = 0;
		const timer = window.setInterval(() => {
			if (i < coordinates.length) {
				data.geometry.coordinates.push(coordinates[i]);
                // @ts-expect-error
				(map.getSource('trace') as GeoJSONSource).setData(data)
				map.panTo(coordinates[i]);
				i++;
			} else {
				window.clearInterval(timer);
			}
		}, 100);
	}
</script>

<div class="linestring" use:createLine >
    <slot/>
</div>
