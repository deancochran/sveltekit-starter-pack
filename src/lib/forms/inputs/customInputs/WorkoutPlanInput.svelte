<script lang="ts">
	import type { WorkoutInterval } from "$lib/schemas";
	import type { Updater } from "svelte/motion";
	import { writable } from "svelte/store";
    
	export let totalDuration = 0;
	export let totalDistance = 0;

	export const WorkoutIntervalList = (initial?: WorkoutInterval[]) => {
		const store = writable<WorkoutInterval[]>(initial || []);

		store.subscribe((intervals) => {
			let totalDuration_ = 0;
			let totalDistance_ = 0;
			intervals.forEach(i => {
				totalDuration_ += i.duration;
				totalDistance_ += i.distance;
			})
			totalDuration = totalDuration_;
			totalDistance = totalDistance_;
		});

		return {
			subscribe: store.subscribe,
			set: store.set,
			update: store.update,
			addInterval: (interval: WorkoutInterval) =>
				store.update((state) => [...state, interval]),
			removeInterval: (index: number) =>
				store.update((state) => state.filter((_, i) => i !== index)),
            clear: () => store.set([]),
            updateInterval: (interval_index: number, updateInterval: WorkoutInterval) => {
                store.update((state) => {
                    state[interval_index] = updateInterval
                    return state
                })
            }
		};
	};
</script>


