<script lang="ts">
	export let href: string;
</script>

<a class="btn p-0 hover:scale-[1.02] text-primary-500 font-sans hover:underline" {href}><slot /></a>
