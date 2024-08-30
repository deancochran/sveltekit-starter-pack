<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import AcceptFriendshipButton from '$lib/components/AcceptFriendshipButton/AcceptFriendshipButton.svelte';
	import FollowButton from '$lib/components/FollowButton/FollowButton.svelte';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import { Avatar, Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import { LucideUsers } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import { superForm } from 'sveltekit-superforms';
	import { debounce } from 'throttle-debounce';
	import type { PageData } from './$types';
	// import { enhance } from '$app/forms';

	export let data: PageData;

	const {
		delayed: delayed_consistency_chart,
		submit: submit_consistency_chart,
		enhance: enhance_consistency_chart,
		form: form_consistency_chart
	} = superForm(
		{ frequency: 'week' },
		{
			invalidateAll: false,
			applyAction: false,
			SPA: '?/consistency_chart',
			onSubmit({ cancel, formData }) {
				if (!$form_consistency_chart.frequency) cancel();
				formData.set('frequency', $form_consistency_chart.frequency);
			},
			onResult(event) {
				if (event.result.type === 'success') {
					if (consistency_chart) {
						consistency_chart.data = chartData;
						consistency_chart.update();
					}
				}
			}
		}
	);

	const throttle_consistency_chart = debounce(200, submit_consistency_chart);

	let consistency_tab_set = writable(0);

	function handleChartTabChange(): void {
		throttle_consistency_chart();
	}

	let chartData = {
		labels: [],
		datasets: [
			{
				label: 'Activity Duration',
				data: [],
				fill: false,
				borderColor: 'rgb(75, 192, 192)',
				tension: 0.1
			}
		]
	};

	$: if ($form_consistency_chart.frequency) {
		if (consistency_chart) submit_consistency_chart();
	}

	const config: ChartConfiguration = {
		type: 'line',
		data: chartData
	};

	let consistency_chart: Chart | null = null;
	function buildchart(canvas: HTMLCanvasElement): any {
		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error('No Chart Context');
		consistency_chart = new Chart(ctx, config);
	}
</script>

<form method="POST" use:enhance_consistency_chart />

<div class="flex flex-col gap-4 max-w-5xl mx-auto md:px-12">
	{#if data.profileUser.friendships_requesterId.at(0)?.status == 'REQUESTED'}
		<AcceptFriendshipButton />
	{/if}
	<div class="card">
		<!-- Header -->
		<header class="card-header">
			<!-- Avatar, Hero -->

			<div class="relative">
				<div class="h-[30vh] overflow-hidden group relative sm:flex hidden">
					{#if $page.data.user?.bannerFileId}
						<img
							src={`/api/images/${$page.data.user.bannerFileId}`}
							class="object-cover rounded-none overflow-hidden w-full group-hover:hidden"
							alt="Club Banner"
						/>
					{:else}
						<div
							class="placeholder bg-cover bg-gradient-to-br variant-gradient-tertiary-primary h-full w-full rounded-none"
						/>
					{/if}
				</div>
				<div class="flex flex-row items-start align-top justify-between">
					<div
						class="flex flex-row flex-wrap items-center align-middle justify-start py-2 gap-2"
					>
						<div class="flex relative w-24 md:w-32 p-2">
							{#if data.profileUser.avatarFileId}
								<Avatar
									src={`/api/images/${data.profileUser.avatarFileId}`}
									initials={String(data.profileUser.username).slice(0, 2)}
									shadow="shadow-lg"
									rounded="rounded-sm"
									fetchpriority="high"
									loading="eager"
									width="w-full"
								/>
							{:else}
								<Avatar
									initials={String(data.profileUser.username).slice(0, 2)}
									shadow="shadow-lg"
									rounded="rounded-sm"
									fetchpriority="high"
									background="bg-gradient-to-br variant-gradient-tertiary-primary"
									loading="eager"
									width="w-full"
								/>
							{/if}
							{#if data.profileUser.role != 'BASE'}
								<span
									class="absolute top-0 -right-2 chip variant-filled-surface px-1 p-px"
									>{data.profileUser.role}</span
								>
							{/if}
						</div>

						<div class="flex flex-col items-start align-middle justify-start">
							<!-- Created At -->
							<h1 class="h1">{data.profileUser.username}</h1>
							<p
								class="text-sm text-on-surface-token text-surface-600-300-token"
							>
								Joined: {data.profileUser.createdAt.toLocaleDateString(
									'en-US',
									{
										year: 'numeric',
										month: 'short',
										day: 'numeric'
									}
								)}
							</p>
						</div>
					</div>

					<FollowButton
						bind:_friendship={data.addressedFriendship}
						bind:addressed_user={data.profileUser}
					/>
				</div>
			</div>
		</header>
		<!-- Body -->
		<!-- Footer -->
		<footer class="card-footer"></footer>
	</div>

	<div class="py-4">
		<div class="card p-2">
			<div class="card-header p-1">
				<h1 class="h1 font-serif">Fitness Chart</h1>
			</div>
			<TabGroup>
				<Tab
					on:click={handleChartTabChange}
					bind:group={$consistency_tab_set}
					name="week"
					value={0}
				>
					<span>Week</span>
				</Tab>
				<Tab
					on:click={handleChartTabChange}
					bind:group={$consistency_tab_set}
					name="month"
					value={1}>Month</Tab
				>
				<Tab
					on:click={handleChartTabChange}
					bind:group={$consistency_tab_set}
					name="year"
					value={2}>Year</Tab
				>
				<!-- Tab Panels --->
				<svelte:fragment slot="panel">
					<div class="p-4 rounded-md">
						{#if $delayed_consistency_chart}
							<LoadingIcon />
						{:else}
							<canvas use:buildchart />
						{/if}
					</div>
				</svelte:fragment>
			</TabGroup>
		</div>
	</div>

	<!-- Member of these clubs -->
	{#if data.profileUser.clubMembers.length < 1}
		<div class="py-4">
			<div class="card py-20 gap-4 text-center">
				<h1 class="h3">No Clubs</h1>
			</div>
		</div>
	{:else}
		<div
			class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto p-4 -ml-4"
		>
			{#each data.profileUser.clubMembers as membership}
				<button
					on:click={() => {
						goto(`/clubs/${membership.club.id}`);
					}}
					class="snap-start shrink-0 card card-hover w-40 md:w-80 h-32 relative overflow-auto flex items-end align-middle justify-center"
				>
					{#if membership.club.bannerFileId}
						<!-- BAD -->
						<!-- <enhanced:img -->
						<!-- 	class="bg-cover brightness-75 z-0 absolute inset-0" -->
						<!-- 	src={membership.club.bannerFileId} -->
						<!-- 	alt="lost" -->
						<!-- /> -->
					{/if}
					<div class="isolate h-1/3 w-full flex flex-row bg-surface-500">
						<Avatar src={''} rounded="rounded-none"><LucideUsers /></Avatar>
						<h4
							class="w-full h4 flex items-center align-middle justify-center text-center"
						>
							{membership.club.name}
						</h4>
					</div>
				</button>
			{/each}
		</div>
	{/if}
	<div class="card">
		{#if data.canView}
			<h1 class="h3 text-center p-[20%]">Viewing!</h1>
		{:else}
			<h1 class="h3 text-center p-[20%]">This page is private</h1>
		{/if}
	</div>
</div>
