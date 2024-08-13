<script lang="ts">
	import { Paginator, type PaginationSettings } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { goto, invalidateAll } from '$app/navigation';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import Button from '$lib/components/Button.svelte';
	import { new_club_event_schema, type NewClubEventSchema } from '$lib/schemas';
	import { zod } from 'sveltekit-superforms/adapters';
	import { superValidate } from 'sveltekit-superforms';
	import { page } from '$app/stores';

	export let data: PageData;
	let modal = getModalStore();
	let paginationSettings = {
		page: 0,
		limit: 5,
		size: data.events.length,
		amounts: [5]
	} satisfies PaginationSettings;

	$: paginatedSource = data.events.slice(
		paginationSettings.page * paginationSettings.limit,
		paginationSettings.page * paginationSettings.limit + paginationSettings.limit
	);

	async function handleNewEvent() {
		modal.trigger({
			type: 'component',
			component: 'CreateClubEvent',
			meta: {
				form: await superValidate(zod(new_club_event_schema))
			},
			response: async (res: NewClubEventSchema) => {
				await invalidateAll();
			}
		});
	}
</script>

<div class="flex items-center align-middle justify-between flex-nowrap">
	<h1 class="h1">Upcoming Events</h1>
	{#if data.user_membership?.admin}
		<Button
			color="variant-filled-primary"
			label="Create Event"
			type="btn"
			shadow="shadow-md"
			on:click={handleNewEvent}>Create Event</Button
		>
	{/if}
</div>
<br />

<div class="flex flex-col gap-2 table-container">
	<!-- Native Table Element -->
	<table class="table table-hover table-interactive">
		<tbody>
			{#each paginatedSource as event}
				<tr
					class="flex w-full h-full items-center align-middle"
					on:click={() => goto(`${$page.url.href}/${event.id}`)}
				>
					<td>
						{event.name}
					</td>
					<td>
						{event.description}
					</td>
					<td>
						{event.date}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	{#if data.events.length < 1}
		<div class="flex items-center align-middle justify-center py-20 w-full">
			<h3 class="h3">No Upcoming Events Found</h3>
		</div>
	{/if}

	<Paginator bind:settings={paginationSettings}></Paginator>
</div>
