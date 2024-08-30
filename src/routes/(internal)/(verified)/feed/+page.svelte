<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import TrainingSessionZoneDistribution from '$lib/components/WorkoutIntervals/TrainingSessionZoneDistribution.svelte';
	import { userFeedSchema } from '$lib/schemas.js';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { onDestroy, onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	export let data;
	let items = data.init_items;
	let fetching: boolean = false;

	const { form, enhance, delayed, submit } = superForm(data.userFeedForm, {
		id: 'UserFeed',
		validators: zod(userFeedSchema),
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
				listElement.scrollTop + listElement.clientHeight >=
					listElement.scrollHeight - threshold
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
				items = [...items, ...new_data?.newItems];
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
</script>

{#if items.length > 0}
	<form id="UserFeed" method="POST" use:enhance>
		<ul
			class="snap-y p-4 scroll-smooth flex flex-col gap-16 max-h-[85vh] overflow-visible overflow-y-scroll after:gap-16 before:gap-16"
			bind:this={listElement}
		>
			{#each items as item}
				{#key item.id}
					<a
						href="/clubs/{item.clubId}/events/{item.id}"
						class="card card-hover snap-both shrink-0 overflow-auto"
					>
						<header class="card-header flex flex-col">
							<div
								class="flex flex-row items-center align-middle justify-between gap-4"
							>
								<Link
									color="variant-soft-surface"
									label="Club Profile"
									href="/clubs/{item.clubId}"
									class="flex flex-row items-center gap-2 rounded-sm p-2"
								>
									{#if item.club?.avatarFileId}
										<Avatar
											src={`/api/images/${item.club?.avatarFileId}`}
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
							{#if item.trainingSession}
								<section class="p-4 flex flex-col">
									<TrainingSessionZoneDistribution
										_trainingSession={item.trainingSession}
									/>
									<!-- <TrainingSessionPlanIntervals _trainingSession={item.trainingSession} /> -->
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
