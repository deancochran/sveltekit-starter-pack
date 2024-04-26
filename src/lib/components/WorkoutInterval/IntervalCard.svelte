<script lang="ts">
	import { secondsToHHMMSS } from '$lib/utils/datetime';
	import { type WorkoutInterval } from '$lib/utils/trainingsessions/types';
	import { ActivityType } from '@prisma/client';
	import Button from '../Button.svelte';

	import { CopyIcon, TrashIcon } from 'lucide-svelte';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let editing = false;
	export let item: { id: number; data: WorkoutInterval };
	export let activity_type: ActivityType;

	function getIntervalIntensityDisplay(
		interval: WorkoutInterval,
		activity_type: ActivityType
	): string {
		// Get the activity type
		let display_text: string;
		switch (activity_type) {
			case ActivityType.SWIM:
				// assign display_text to be equal to the
				return '';
			case ActivityType.BIKE:
				return '';
			case ActivityType.RUN:
				return '';
			default:
		}
		throw new Error('Function not implemented.');
	}
</script>

<div
	class="card relative variant-filled-surface flex flex-col justify-between w-full h-full snap-center"
>
	<section class="p-2">
		<!-- Interval Display -->
		<div class="flex flex-col gap-1">
			<span class="text-sm whitespace-nowrap line-clamp-1"
					>@{item.data.intensity.toFixed(2)}% FTP</span
				>
			<span class="text-sm">for {secondsToHHMMSS(item.data.duration)}</span>
		</div>
	</section>

	<footer class="card-footer p-1 gap-1 w-full flex items-end align-middle justify-end">
		<Button
			disabled={!editing}
			type="button"
			on:click={() => dispatch('duplicate', item)}
			color="variant-soft-tertiary"
			class=" rounded-md p-2"
		>
			<CopyIcon />
		</Button>

		<Button
			disabled={!editing}
			type="button"
			on:click={() => dispatch('delete', item)}
			color="variant-soft-tertiary"
			class=" rounded-md p-2"
		>
			<TrashIcon />
		</Button>
	</footer>
</div>
