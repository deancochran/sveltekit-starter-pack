<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import TrainingSessionPlanIntervals from '$lib/components/WorkoutIntervals/TrainingSessionPlanIntervals.svelte';
	import TrainingSessionZoneDistribution from '$lib/components/WorkoutIntervals/TrainingSessionZoneDistribution.svelte';
	import { user_feed_schema } from '$lib/schemas.js';
	import type { club, club_event, trainingSession } from '@prisma/client';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { onDestroy, onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	export let data;
	let items: Array<club_event & { club: club; training_session: trainingSession }> = <any>(
		data.init_items
	);
	let fetching: boolean = false;

	const { form, enhance, delayed, submit } = superForm(data.user_feed_form, {
		id: 'UserFeed',
		validators: zod(user_feed_schema),
		delayMs: 0,
		timeoutMs: 8000,
		dataType: 'json',
		resetForm: false,
		onSubmit: ({ cancel }) => {
			const threshold = 400;
			if (
				!$delayed &&
				!fetching &&
				$form.limit * ($form.page + 1) < $form.size &&
				items.length <= $form.size &&
				listElement.scrollTop + listElement.clientHeight >= listElement.scrollHeight - threshold
			) {
				fetching = true;
				$form.page++;
			} else {
				cancel();
			}
		},
		onResult: ({ result }) => {
			const { type, data: new_data } = <any>result;
			if (type == 'success') {
				items = [...items, ...new_data?.new_items];
			}
			fetching = false;
		}
	});

	let listElement: HTMLUListElement;

	onMount(() => {
		if (listElement) {
			listElement.addEventListener('scroll', submit);
		}
	});

	onDestroy(() => {
		if (listElement) {
			listElement.removeEventListener('scroll', submit);
		}
	});
	//
	// $: {
	// 	console.log(items);
	// }
</script>

{#if items.length > 0}
	<form id="UserFeed" method="POST" use:enhance>
		<ul
			class="snap-y p-4 scroll-smooth flex flex-col gap-16 max-h-[85vh] overflow-visible overflow-y-scroll after:gap-16 before:gap-16"
			bind:this={listElement}
		>
			{#each items as item, i}
				{#key item.id}
					<a
						href="/clubs/{item.club_id}/events/{item.id}"
						class="card card-hover snap-both shrink-0 overflow-auto"
					>
						<header class="card-header flex flex-col">
							<div class="flex flex-row items-center align-middle justify-between gap-4">
								<Link
									color="variant-soft-surface"
									label="Club Profile"
									href="/clubs/{item.club_id}"
									class="flex flex-row items-center gap-2 rounded-sm p-2"
								>
									<!-- <span class="chip variant-filled">Chip</span> -->
									{#if item.club?.avatar_file_id}
										<Avatar
											src={`/api/images/${item.club?.avatar_file_id}`}
											initials={String(item.club.name).slice(0, 2)}
											width="w-16"
											shadow="shadow-lg"
											rounded="rounded-sm"
											fetchpriority="high"
											loading="eager"
											class="group-hover:hidden"
										/>
									{:else}
										<Avatar
											initials={String(item.club?.name).slice(0, 2)}
											width="w-16"
											shadow="shadow-lg"
											rounded="rounded-sm"
											fetchpriority="high"
											loading="eager"
											class="group-hover:hidden"
										/>
									{/if}
									<span>{item.club.name}</span>
								</Link>
								<div class="flex flex-row gap-2">
									<span>{item.date.toLocaleDateString()}</span>
									<span>{item.date.toLocaleTimeString()}</span>
								</div>
							</div>
						</header>
						<section class="p-4">
							<h1 class="h2">{item.name}</h1>
							<p class="py-2 indent-2">{item.description}</p>
							{#if item.training_session_id}
								<section class="p-4 flex flex-col">
									<TrainingSessionZoneDistribution training_session={item.training_session} />
									<!-- <TrainingSessionPlanIntervals training_session={item.training_session} /> -->
								</section>
							{/if}
						</section>
						<!-- <footer class="card-footer"> -->
						<!---->
						<!--       </footer> -->
					</a>
				{/key}
			{/each}
		</ul>
	</form>
{:else}
	<h1>No Club Events Found</h1>
{/if}
