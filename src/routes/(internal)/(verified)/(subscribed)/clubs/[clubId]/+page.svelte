<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Link from '$lib/components/Link.svelte';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import {
		acceptClubMember,
		consistencyChartSchema,
		newClubSchema,
		newImageSchema
	} from '$lib/schemas';
	import {
		Avatar,
		focusTrap,
		getModalStore,
		Paginator,
		type PaginationSettings
	} from '@skeletonlabs/skeleton';
	import {
		LucideUsers,
		MoveLeftIcon,
		MoveRightIcon,
		PencilIcon
	} from 'lucide-svelte';
	import { superForm, superValidate } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';

	let modal = getModalStore();

	export let data: PageData;

	$: active_memebers =
		data.members.filter((obj) => obj.status == 'ACCEPTED') ?? [];
	$: paginationSettings = {
		page: 0,
		limit: 10,
		size: active_memebers?.length ?? 0,
		amounts: [10]
	} as PaginationSettings;

	$: paginated_members = active_memebers.slice(
		paginationSettings.page * paginationSettings.limit,
		paginationSettings.page * paginationSettings.limit +
			paginationSettings.limit
	);
	let elEvents: HTMLDivElement;

	function multiColumnLeft(): void {
		let x = elEvents.scrollWidth;
		if (elEvents.scrollLeft !== 0)
			x = elEvents.scrollLeft - elEvents.clientWidth;
		elEvents.scroll(x, 0);
	}

	function multiColumnRight(): void {
		let x = 0;
		// -1 is used because different browsers use different methods to round scrollWidth pixels.
		if (elEvents.scrollLeft < elEvents.scrollWidth - elEvents.clientWidth - 1)
			x = elEvents.scrollLeft + elEvents.clientWidth;
		elEvents.scroll(x, 0);
	}

	async function triggerUpdateClubModal() {
		modal.trigger({
			type: 'component',
			component: 'UpdateClub',
			meta: {
				avatar_form: await superValidate(zod(newImageSchema)),
				banner_form: await superValidate(zod(newImageSchema)),
				club_form: await superValidate(data.club, zod(newClubSchema)),
				club: data.club
			},
			response: async () => {
				await invalidateAll();
			}
		});
	}

	async function triggerManageMembersModal() {
		modal.trigger({
			type: 'component',
			component: 'UpdateClubMembers',
			meta: {
				form: await superValidate(zod(consistencyChartSchema)),
				potential_members: data.members.filter(
					(obj) => obj.status == 'REQUESTED'
				)
			},
			response: async () => {
				await invalidateAll();
			}
		});
	}

	const { formId, enhance, delayed } = superForm(data.adminForm, {
		applyAction: true,
		validators: zod(acceptClubMember),
		delayMs: 0,
		timeoutMs: 8000,
		onResult: async ({ result }) => {
			if (result.type == 'success') {
				await invalidateAll();
			}
		}
	});
	let isFocused: boolean = false;
</script>

<div class="card">
	<div class="card-header relative h-[30vh] overflow-hiddenc">
		{#if data.club.bannerFileId}
			<img
				src={`/api/images/${data.club.bannerFileId}`}
				class="object-cover rounded-none overflow-hidden w-full group-hover:hidden"
				alt="Club Banner"
			/>
		{:else}
			<div
				class="placeholder bg-cover bg-surface-backdrop-token h-full w-full rounded-none"
			/>
		{/if}
	</div>
	<div class="flex flex-row h-24 items-start align-baseline justify-start px-4">
		<div
			class="flex flex-row h-24 -mt-6 items-end align-baseline justify-start px-12 w-fit"
		>
			{#if data.club?.avatarFileId}
				<Avatar
					src={`/api/images/${data.club?.avatarFileId}`}
					initials={String(data.club.name).slice(0, 2)}
					width="w-36"
					shadow="shadow-lg"
					rounded="rounded-sm"
					fetchpriority="high"
					loading="eager"
					class="group-hover:hidden"
				/>
			{:else}
				<Avatar
					initials={String(data.club?.name).slice(0, 2)}
					width="w-36"
					shadow="shadow-lg"
					rounded="rounded-sm"
					fetchpriority="high"
					loading="eager"
					class="group-hover:hidden"
				/>
			{/if}

			<h4 class="h4 p-4">
				{data.club.name}
			</h4>
		</div>
		<div
			class="flex flex-row w-full h-full items-center align-middle justify-end gap-4 px-4"
		>
			{#if data.user?.id}
				<form method="POST" name="membership">
					{#if !data.userMembership}
						<Button
							color="variant-ghost-surface"
							formaction="?/request"
							type="submit"
							class="btn"
							>{#if data.club.private}
								Request
							{:else}
								Join
							{/if}</Button
						>
					{:else if data.userMembership.status == 'REQUESTED'}
						<Button
							color="variant-ghost-surface"
							type="button"
							disabled
							class="btn">Pending</Button
						>
					{:else if data.userMembership.status == 'ACCEPTED'}
						<Button
							color="variant-ghost-surface"
							formaction="?/leave"
							type="submit"
							class="btn"
						>
							Leave</Button
						>
					{:else if data.userMembership.status == 'DECLINED'}
						<Button
							color="variant-ghost-surface"
							formaction="?/request"
							type="submit"
							class="btn"
							>{#if data.club.private}
								Request
							{:else}
								Join
							{/if}</Button
						>
					{/if}
				</form>
			{/if}
			<div
				class="flex flex-row flex-nowrap items-end align-bottom justify-center gap-1"
			>
				<LucideUsers />
				{data.members.length}
			</div>
			<Button
				color="variant-ghost-surface"
				type="button"
				class="btn"
				on:click={triggerUpdateClubModal}><PencilIcon /></Button
			>
		</div>
	</div>
	<div
		class="flex w-full h-full items-center align-middle justify-start py-8 px-16"
	>
		<p>{data.club.description}</p>
	</div>
</div>

<!-- Upcoming Events -->
<br />
<h1 class="h1">Upcoming Events</h1>
<br />

<div class="card flex flex-col p-2">
	{#if data.upcomingEvents.length > 1}
		<div class=" p-3 grid grid-cols-[auto_1fr_auto] gap-4 items-center">
			<!-- Button: Left -->
			<button type="button" class="btn-icon" on:click={multiColumnLeft}>
				<MoveLeftIcon />
			</button>
			<!-- Carousel -->
			<div
				bind:this={elEvents}
				class="snap-x snap-mandatory scroll-smooth flex gap-4 overflow-x-auto"
			>
				{#each data.upcomingEvents as clubEvent}
					<a
						href={$page.url.href + `/events/${clubEvent.id}`}
						class="card card-hover p-1 shrink-0 w-full sm:w-[50%] lg:w-[25%] snap-start space-y-2"
					>
						<h4 class="card-header h3 font-bold line-clamp-1">
							{clubEvent.name}
						</h4>
						<p class="px-4 line-clamp-3 h-18">
							{clubEvent.description}
						</p>
						<p class="card-footer text-right">
							{clubEvent.date.toDateString()}
						</p>
					</a>
				{/each}
			</div>
			<!-- Button-Right -->
			<button type="button" class="btn-icon" on:click={multiColumnRight}>
				<MoveRightIcon />
			</button>
		</div>
	{:else}
		<span class="h4 p-4"> No Upcoming Events...</span>
	{/if}
	<div
		class=" card-footer p-2 w-full flex items-center align-middle justify-end"
	>
		<Link
			color="variant-soft-primary"
			label={'Club Events'}
			href="{$page.url.href}/events">See More Events</Link
		>
	</div>
</div>

<br />
<div class="flex w-full flex-row items-center align-middle justify-between">
	<h1 class="h1">Members</h1>
	{#if data.userMembership?.admin}
		<Button
			color="variant-ghost-surface"
			type="button"
			on:click={triggerManageMembersModal}>Membership Requests</Button
		>
	{/if}
</div>
<br />

<form
	id="UpdateClubMembers"
	use:enhance
	use:focusTrap={isFocused}
	method="POST"
>
	<div class="flex flex-col gap-2 table-container">
		<!-- Native Table Element -->
		<table class="table table-hover table-interactive">
			<tbody>
				{#each paginated_members as member}
					<tr
						class="flex w-full h-full items-center align-middle"
						on:click={() => goto(`/${member.user.username}`)}
					>
						<td>
							{#if member.user.avatarFileId}
								<Avatar
									src={`/api/images/${member.user.avatarFileId}`}
									initials={String(member.user.username).slice(0, 2)}
									border="border-4 border-surface-300-600-token hover:!border-primary-500"
								/>
							{:else}
								<Avatar
									initials={String(member.user.username).slice(0, 2)}
									border="border-4 border-surface-300-600-token hover:!border-primary-500"
								/>
							{/if}
						</td>
						<td class="flex h-full items-center space-x-2">
							<span class="flex h-full h4 font-bold">
								{member.user.username}
							</span>
							{#if member.admin}<span class=" chip variant-filled p-1"
									>Admin</span
								>{/if}
						</td>
						{#if data.userMembership?.admin && member.userId != data.user?.id}
							<td
								class="flex w-full h-full items-center align-middle justify-end"
							>
								{#if $delayed}
									<LoadingIcon />
								{:else if member.admin}
									<Button
										shadow="shadow-md"
										formaction="?/removeAdmin"
										name="userId"
										value={member.userId}
										on:click={() => ($formId = member.userId.toString())}
										color="variant-filled-primary"
										class="btn"
										type="submit">Remove Admin</Button
									>
								{:else}
									<Button
										shadow="shadow-md"
										formaction="?/addAdmin"
										name="userId"
										value={member.userId}
										on:click={() => ($formId = member.userId.toString())}
										color="variant-filled-primary"
										class="btn"
										type="submit">Add Admin</Button
									>
								{/if}
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
		{#if data.members.length < 1}
			<div class="flex items-center align-middle justify-center py-20 w-full">
				<h3 class="h3">No Members Found</h3>
			</div>
		{/if}
		<Paginator bind:settings={paginationSettings}></Paginator>
	</div>
</form>
