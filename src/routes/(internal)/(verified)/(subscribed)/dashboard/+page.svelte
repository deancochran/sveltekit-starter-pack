<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="page-container flex items-center justify-center align-middle">
	<div class="card p-4 flex-col gap-2 flex items-center justify-center align-middle">
		<h1 class="h2 font-serif font-thin">
			Subscription Tier: <span class="h1 font-serif font-thin">{data.session.user.role}</span>
		</h1>
	</div>
</div>
