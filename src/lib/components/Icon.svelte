<script lang="ts">
	import { Dock, FileQuestion, Book, CreditCard, Settings } from 'lucide-svelte';
	export let icon_name: string;

	let component = handleIconName() as unknown as any;

	function handleIconName() {
		switch (icon_name) {
			case 'dashboard': {
				return Dock;
			}
			case 'blog': {
				return Book;
			}
			case 'pricing': {
				return CreditCard;
			}
			case 'settings': {
				return Settings;
			}
			default: {
				return FileQuestion;
			}
		}
	}
</script>

<svelte:component this={component} />
