<script lang='ts'>
	import loadStripe from 'stripe'
	import { Elements } from 'svelte-stripe';
	import { onMount } from 'svelte';
	import { PUBLIC_STRIPE_KEY } from '$env/static/public';

	let stripe:any

	onMount(async () => {
		stripe = await new loadStripe(PUBLIC_STRIPE_KEY);
	});
</script>

{#if stripe}
	<Elements {stripe}>
		<!-- this is where your Stripe components go -->
	</Elements>
{/if}
