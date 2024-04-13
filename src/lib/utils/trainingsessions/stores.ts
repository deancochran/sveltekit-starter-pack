import { writable } from "svelte/store";
import type { WorkoutInterval } from "./types";



export function WorkoutIntervalService(init?:WorkoutInterval[]) {
	const { subscribe, set, update } = writable<WorkoutInterval[]>(init??[]);
	return {
		subscribe,
		set,
		update,
	};
}

export type WorkoutIntervalStore = ReturnType<typeof WorkoutIntervalService>;
