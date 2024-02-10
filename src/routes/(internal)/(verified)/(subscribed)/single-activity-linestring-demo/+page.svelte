<script lang="ts">
	import type { PageData } from './$types';
	import Map from '$lib/components/Map/Map.svelte';
	import LineString from '$lib/components/LineString/LineString.svelte';
	import polyline from '@mapbox/polyline';
	import type { LngLatLike } from 'maplibre-gl';
	const {decode} = polyline;

	export let data: PageData;
	// polyline decodes the coordinates in Lat Lng output, but it is needed to be in Lng Lat.
	$: coordinates = (decode(data.activity.map?.polyline as string).map(coord => [coord[1], coord[0]]) as LngLatLike[]);

	$: loaded=false
	function handledMapLoaded() {
		loaded=true
	}
</script>
{#if data.activity}
	<div class="relative page-container">
		<div class="col-span-1 h-[70vh]">
			<Map let:map on:load={()=>{handledMapLoaded()}}>
				{#if map && loaded}
					<!-- {#each markers as { lngLat, label, name }, i}
						<Marker {map} {lngLat} on:click={(e)=>{console.log(e)}}/>
					{/each} -->
					<LineString {coordinates} {map}/>
				{/if}
					
			</Map>
		</div>
	</div>
{/if}

