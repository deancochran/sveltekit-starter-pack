<script lang="ts">
	import { type GeoJSONSource, type LngLatLike, type Map } from 'maplibre-gl';

	export let map: Map;
	let center: LngLatLike = [-122.486052, 37.830348];
	let zoom: number = 15;

	const coordinates: Array<any> = [
		[-122.48369693756104, 37.83381888486939],
		[-122.48348236083984, 37.83317489144141],
		[-122.48339653015138, 37.83270036637107],
		[-122.48356819152832, 37.832056363179625],
		[-122.48404026031496, 37.83114119107971],
		[-122.48404026031496, 37.83049717427869],
		[-122.48348236083984, 37.829920943955045],
		[-122.48356819152832, 37.82954808664175],
		[-122.48507022857666, 37.82944639795659],
		[-122.48610019683838, 37.82880236636284],
		[-122.48695850372314, 37.82931081282506],
		[-122.48700141906738, 37.83080223556934],
		[-122.48751640319824, 37.83168351665737],
		[-122.48803138732912, 37.832158048267786],
		[-122.48888969421387, 37.83297152392784],
		[-122.48987674713133, 37.83263257682617],
		[-122.49043464660643, 37.832937629287755],
		[-122.49125003814696, 37.832429207817725],
		[-122.49163627624512, 37.832564787218985],
		[-122.49223709106445, 37.83337825839438],
		[-122.49378204345702, 37.83368330777276]
	];
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
		map.jumpTo({ center: coordinates[0], zoom: 13 });
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
