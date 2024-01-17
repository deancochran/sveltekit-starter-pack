<script lang="ts">
	import type { PageData } from './$types';
	import Map from '$lib/components/Map/Map.svelte';
	import LineString from '$lib/components/LineString/LineString.svelte';
	export let data: PageData;

	$: loaded=false
	function handledMapLoaded() {
		loaded=true
	}
</script>

<div class="relative page-container">
	<div class="col-span-1 h-[70vh]">
		<Map let:map on:load={()=>{handledMapLoaded()}}>
			{#if map && loaded}
				<!-- {#each markers as { lngLat, label, name }, i}
					<Marker {map} {lngLat} on:click={(e)=>{console.log(e)}}/>
				{/each} -->
				<LineString {map}/>
			{/if}
				
		</Map>
	</div>
</div>

