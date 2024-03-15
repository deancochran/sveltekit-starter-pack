<script lang="ts">
	import { enhance } from '$app/forms';

	import { storeTheme } from '$lib/stores/theme';
	import { LightSwitch, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import type { SubmitFunction } from '@sveltejs/kit';
	export let showLightSwitch = false;

	const themes = [
		'crimson',
		'gold-nouveau',
		'hamlindigo',
		'modern',
		'rocket',
		'sahara',
		'seafoam',
		'skeleton',
		'vintage',
		'wintry'
	];
	const setTheme: SubmitFunction = ({ formData }) => {
		const theme = formData.get('theme')?.toString();

		if (theme) {
			document.body.setAttribute('data-theme', theme);
			$storeTheme = theme;
		}
	};

	const popupClick: PopupSettings = {
		event: 'click',
		target: 'popupClick',
		placement: 'bottom'
	};
</script>

<button type="button" form="theme" class="btn shadow-md variant-filled" use:popup={popupClick}
	>Theme</button
>
<div class="card p-2 soft-filled-primary shadow-2xl" data-popup="popupClick">
	{#if showLightSwitch}
		<div class="flex py-2 items-center justify-center align-middle gap-1">
			<LightSwitch />
		</div>
		<hr class="variant-filled-active py-2" />
	{/if}

	<form id="theme" action="/?/setTheme" method="POST" use:enhance={setTheme}>
		<ul class="w-full h-full gap-2">
			{#each themes as name}
				<li class="w-full h-full hover:variant-soft-secondary">
					<button
						class="w-full h-full btn"
						name="theme"
						value={name}
						class:variant-soft-primary={$storeTheme === name}
					>
						<span class="w-full h-full flex-auto text-center">{name}</span>
					</button>
				</li>
			{/each}
		</ul>
	</form>
</div>
