<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1 class="h1">You need to verify your email</h1>
	</header>
	<section class="flex p-4 items-center align-middle justify-center">
		<div class="flex max-w-md text-center">
			<p>
				Your verification Link was sent to your email. <span class="text-secondary-500"
					>However</span
				>, if you need a new verification link, please click below
			</p>
		</div>
		<div class="flex">
			<form id="resend" method="post" action="?/resend" use:enhance />
		</div>
	</section>
	<footer class="card-footer flex flex-wrap p-4 items-center align-middle justify-center">
		<Button
			shadow="shadow-md"
			color="variant-filled-primary"
			form="resend"
			type="submit"
			class="btn">Resend</Button
		>
	</footer>
</div>
