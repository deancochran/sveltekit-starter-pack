<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	const lostQuotes: string[] = [
		'Lost in the vastness of my own mind, searching for a breadcrumb of clarity.',
		'Wandering through the fog of uncertainty, hoping to stumble upon a guiding light.',
		'In the labyrinth of life, I find myself lost amidst the twists and turns of fate.',
		'Adrift in the sea of possibilities, unsure of which path leads to solid ground.',
		'Lost, but not without hope, for every wrong turn brings me closer to the right one.',
		'Navigating the wilderness of my thoughts, seeking a trail that leads me home.',
		'Like a compass without a north, I spin in circles, searching for direction.',
		'In the silence of solitude, I am lost, yet somehow found, in the depths of my own soul.',
		'Lost in translation, where words fail to convey the depth of my wandering.',
		'Wandering aimlessly, I find solace in the beauty of the unknown.'
	];

	let currentQuote: string | undefined = undefined;

	function pickRandomQuote() {
		const randomIndex = Math.floor(Math.random() * 10);
		currentQuote = lostQuotes[randomIndex];
	}

	onMount(() => {
		pickRandomQuote();
	});
</script>

<div class="relative flex h-[80vh] w-[80vw] flex-col items-center justify-center align-middle">
	<div class="realtive flex flex-col items-center justify-center align-middle">
		{#key currentQuote}
			<h1 in:fade class="z-10 -mb-[5vw] font-serif text-[20vw] font-semibold text-white">
				{currentQuote ? $page.status : ''}
			</h1>
			<p in:fade class="z-10 font-serif text-[2vw] text-white">{currentQuote ?? ''}</p>
		{/key}
		<img class="absolute z-0 w-full resize-none brightness-75" src="/lost.gif" alt="lost" />
	</div>
</div>
