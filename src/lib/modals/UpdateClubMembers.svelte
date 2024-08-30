<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import {
		Avatar,
		Paginator,
		focusTrap,
		getModalStore,
		type PaginationSettings
	} from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { type Infer } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	const acceptClubMember = z.object({
		userId: z.string()
	});

	type AcceptClubMember = typeof acceptClubMember;

	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;
	const modal = getModalStore();
	let meta = $modal[0].meta as {
		form: SuperValidated<Infer<AcceptClubMember>>;
		potential_members: Array<any>;
	};

	const { enhance, delayed, formId } = superForm(meta.form, {
		id: 'UpdateClubMembers',
		applyAction: true,
		delayMs: 0,
		timeoutMs: 8000,
		onResult(event) {
			const { result } = event;
			if (result.type == 'success') {
				if ($modal[0].response) $modal[0].response(true);
				meta.potential_members = meta.potential_members.filter(
					(obj) => String(obj.user.id) == $formId
				);
			}
			return;
		}
	});
	let isFocused: boolean = false;

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm =
		'border border-surface-500 p-4 space-y-4 rounded-container-token';

	$: paginationSettings = {
		page: 0,
		limit: 10,
		size: meta.potential_members?.length ?? 0,
		amounts: [10]
	} as PaginationSettings;

	$: paginated_members = meta.potential_members.slice(
		paginationSettings.page * paginationSettings.limit,
		paginationSettings.page * paginationSettings.limit +
			paginationSettings.limit
	);
</script>

{#if $modal[0] && $page.data.user}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}><h1>Manage Requested Members</h1></header>
		<form
			id="UpdateClubMembers"
			use:enhance
			use:focusTrap={isFocused}
			method="POST"
			class="modal-form {cForm}"
		>
			<div class="flex flex-col gap-2 table-container">
				<!-- Native Table Element -->
				<table class="table table-hover table-interactive">
					<tbody>
						{#each paginated_members as member}
							<tr class="flex w-full h-full items-center align-middle">
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
								<td
									class="flex w-full h-full items-center align-middle justify-evenly"
								>
									{#if $delayed}
										<LoadingIcon />
									{:else}
										<Button
											shadow="shadow-md"
											formaction="?/accept"
											name="userId"
											value={member.userId}
											on:click={() => ($formId = member.userId.toString())}
											color="variant-filled-primary"
											class="btn {parent.buttonPositive}"
											type="submit">Accept</Button
										>
										<Button
											shadow="shadow-md"
											formaction="?/reject"
											name="userId"
											value={member.userId}
											on:click={() => ($formId = member.userId.toString())}
											color="variant-filled-primary"
											class="btn {parent.buttonPositive}"
											type="submit">Reject</Button
										>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				{#if meta.potential_members.length < 1}
					<div
						class="flex items-center align-middle justify-center py-20 w-full"
					>
						<h3 class="h3">No Members Found</h3>
					</div>
				{/if}
				<Paginator bind:settings={paginationSettings}></Paginator>
			</div>
			<div class="modal-footer {parent.regionFooter}"></div>
		</form>
	</div>
{/if}
