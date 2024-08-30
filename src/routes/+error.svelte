<script lang="ts">
	import { page } from '$app/stores';
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

	async function pickRandomQuote() {
		const randomIndex = Math.floor(Math.random() * 10);
		return lostQuotes[randomIndex];
	}
</script>

<div
	class="flex flex-col items-center align-middle justify-center h-[80vh] gap-4"
>
	{#await pickRandomQuote()}
		<br />
		<br />
		<br />
	{:then currentQuote}
		{#key currentQuote}
			<h1 in:fade class="font-serif font-semibold text-white z-10 text-4xl">
				{currentQuote ? $page.error?.message : ''}
			</h1>
			<p in:fade class="z-10 font-serif text-white">{currentQuote ?? ''}</p>
		{/key}
	{/await}
	<img class=" object-cover" src="/lost.gif" alt="lost" />
</div>
