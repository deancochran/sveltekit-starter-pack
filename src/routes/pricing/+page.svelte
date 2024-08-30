<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { CheckCircle } from 'lucide-svelte';
	import { PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID } from '$env/static/public';
</script>

<section class="card m-auto mt-16 max-w-sm p-8">
	<h2>Member Plan</h2>
	<p class="description mt-8 text-gray-400">A plan that scales with you.</p>

	<div class="mt-8">
		<span class="mr-2 text-5xl font-extrabold">$30</span>
		<span class="text-gray-400">/year</span>
	</div>

	<ol class="mt-8 space-y-4">
		<li class="flex gap-4">
			<CheckCircle />
			<span>Individual configuration</span>
		</li>
		<li class="flex gap-4">
			<CheckCircle />
			<span>No hidden fees</span>
		</li>
		<li class="flex gap-4">
			<CheckCircle />
			<span>Free 30 day trial</span>
		</li>
		<li class="flex gap-4">
			<CheckCircle />
			<span>Email support</span>
		</li>
	</ol>

	<form id="checkout" method="POST" action="?/checkout" use:enhance>
		<input
			type="hidden"
			name="priceId"
			value={PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID}
		/>
		<Button
			type="submit"
			form="checkout"
			shadow="shadow-md"
			color="variant-filled-primary"
			class="btn mt-16 w-full">Checkout</Button
		>
	</form>
</section>
