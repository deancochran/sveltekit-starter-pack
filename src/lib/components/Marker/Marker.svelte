<script lang="ts">
	import { MapPin } from 'lucide-svelte';
	import maplibre, { type Marker, type LngLatLike, type Map } from 'maplibre-gl';
	import { createEventDispatcher } from 'svelte';
	export let lngLat: LngLatLike;
	export let map: Map;
	export { classNames as class };

	let classNames: string | undefined = undefined;
	let marker: Marker;

	$: marker?.setLngLat(lngLat);

	const dispatch = createEventDispatcher();
	function manageClasses(node: HTMLDivElement, initialAddedClasses: string | undefined) {
		// These classes are added by MapLibre and we don't want to mess with them.
		const frozenClasses = node.className;

		function updateClasses(newClassNames: string | undefined) {
			if (newClassNames) {
				node.className = `${frozenClasses} ${newClassNames}`;
			} else {
				node.className = frozenClasses;
			}
		}

		updateClasses(initialAddedClasses);

		return {
			update: updateClasses
		};
	}
	function addMarker(element: HTMLDivElement) {
		new maplibre.Marker({ element})
			.setLngLat(lngLat)
			.addTo(map);
	}

	function sendEvent() {
		let loc = marker?.getLngLat();
		if (!loc) {
			return;
		}

		const lngLat: [number, number] = [loc.lng, loc.lat];
		let data = {
			map: map,
			marker: marker,
			lngLat,
			features: [
				{
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: lngLat
					}
				}
			]
		};

		dispatch('click', data);
	}
</script>

<div use:addMarker use:manageClasses={classNames} role={undefined} on:click={sendEvent} >
	
	<slot>
		<MapPin size={48} color="#000000" />
	</slot>
</div>
