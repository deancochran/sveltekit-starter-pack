import { writable } from "svelte/store";

export function ItemsStoreService<T>(initial?: { id: number, data:T }[]) {
    const store = writable<{ id: number, data:T }[]>(initial);
    return {
        subscribe: store.subscribe,
        set: store.set,
        update: store.update,
        clear: () => store.set([])
    }
};
export type ItemsStore<T> = ReturnType<typeof ItemsStoreService<T>>;

