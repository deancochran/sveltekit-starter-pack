<script lang="ts">
	export let href: string;
	export let type: 'btn' | 'btn-icon' | 'logo-item' = 'btn';
	export let target: '_blank' | undefined = undefined;
	export let rel: 'noreferrer' | undefined = undefined;
	export let color:
		| 'variant-soft-primary'
		| 'variant-soft-secondary'
		| 'variant-soft-tertiary'
		| undefined = undefined;
	export let shadow: 'shadow-md' | undefined = undefined;
	let classes = `${type} ${color} ${shadow}`;
</script>

<a
	class:transition-colors={true}
	class:duration-300={true}
	class={classes}
	{target}
	{rel}
	data-sveltekit-preload-data="tap"
	{href}><slot /></a
>
