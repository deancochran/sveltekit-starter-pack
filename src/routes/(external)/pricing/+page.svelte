<script lang="ts">
	import { enhance } from '$app/forms'
	// import { CheckCircle } from 'lucide-svelte'
</script>

<section class="card m-auto mt-16 max-w-sm p-8">
	<h2>Member Plan</h2>
	<p class="description mt-8 text-gray-400">A plan that scales with you.</p>

	<div class="mt-8">
		<span class="mr-2 text-5xl font-extrabold">$30</span>
		<span class="text-gray-400">/month</span>
	</div>

	<ol class="mt-8 space-y-4">
		<li class="flex gap-4">
			<!-- <CheckCircle /> -->
			<span>Individual configuration</span>
		</li>
		<li class="flex gap-4">
			<!-- <CheckCircle /> -->
			<span>No hidden fees</span>
		</li>
		<li class="flex gap-4">
			<!-- <CheckCircle /> -->
			<span>Free updates</span>
		</li>
		<li class="flex gap-4">
			<!-- <CheckCircle /> -->
			<span>Email support</span>
		</li>
	</ol>

	<form method="POST" action="?/checkout" use:enhance>
		<input
			type="hidden"
			name="priceId"
			value="price_1O9CX7I9mNvJDW3qQ1ezKUw1"
		/>
		<button class="btn variant-filled-primary mt-16 w-full">Checkout</button>
	</form>
</section>