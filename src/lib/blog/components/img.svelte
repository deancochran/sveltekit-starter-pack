<script lang="ts">
	export let src: string;
	export let alt: string;	
</script>
<img class="rounded-sm drop-shadow-xl" alt={alt} src={src} fetchpriority="high" loading="eager" />