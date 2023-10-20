<script lang="ts">
	import type { PageData } from "./$types";

    export let data:PageData
</script>
<div class="flex card p-4 h-80 items-center justify-center align-middle">
    <h1 class="h1 font-serif">Welcome {#if data.session} {data.session.user.username} {:else} Alien {/if}</h1>
</div>
