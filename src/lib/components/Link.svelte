<script lang="ts">
	export let href: string;
</script>

<a
	class:text-surface-500={true}
	class:hover:text-primary-500={true}
	class:hover:variant-soft-primary={true}
	class:transition-colors={true}
	class:duration-300={true}
	data-sveltekit-preload-data="tap"
	{href}
	{...$$props}><slot /></a
>
