<script lang="ts">
	export let href: string;
	export let primary_color_text:boolean = false
</script>

<a	
	class:text-primary-500={primary_color_text}
	class:hover:text-primary-500={true}
	class:hover:variant-soft-primary={true}
	class:transition-colors={true}
	class:duration-300={true}
	data-sveltekit-preload-data="tap"
	{href}
	{...$$props}><slot /></a
>
