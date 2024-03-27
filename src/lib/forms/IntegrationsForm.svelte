<script lang="ts">
	import IntegrationDisConnectButton from '$lib/components/IntegrationDisConnectButton.svelte';
	import IntegrationConnectButton from '$lib/components/IntegrationConnectButton.svelte';
	import {
		disconnect_user_integration_schema,
		type DisconnectUserIntegrationSchema
	} from '$lib/schemas';
	import { ThirdPartyIntegrationProvider, type thirdPartyIntegrationToken } from '@prisma/client';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	export let integrations: thirdPartyIntegrationToken[];
	export let form_data: SuperValidated<Infer<DisconnectUserIntegrationSchema>>;
	$: integration_providers = Object.values(
		ThirdPartyIntegrationProvider
	) as ThirdPartyIntegrationProvider[];
	$: user_integration_providers = integrations.map(
		(integration) => integration.provider as ThirdPartyIntegrationProvider
	);
	$: unconnected_providers = integration_providers.filter(
		(integration) => !user_integration_providers.includes(integration)
	);
	const { form, errors, constraints, enhance, delayed } = superForm(form_data, {
		applyAction: true,
		invalidateAll: true,
		resetForm: true,
		validators: zod(disconnect_user_integration_schema),
		delayMs: 0,
		timeoutMs: 8000
	});
	let isFocused: boolean = false;
	let selectedProvider: ThirdPartyIntegrationProvider;
</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1>Integrations</h1>
	</header>
	<section class="p-4 space-y-4">
		<form
			use:focusTrap={isFocused}
			id="disconnect"
			method="post"
			action="?/disconnectIntegration"
			class="logo-cloud grid-cols-1 gap-1"
			use:enhance
		>
			<input type="hidden" name="provider" bind:value={selectedProvider} />
			{#each integration_providers as provider}
				{#key provider}
					{#if unconnected_providers.includes(provider)}
						<IntegrationConnectButton {provider} />
					{:else}
						<IntegrationDisConnectButton
							on:disconnect={(e) => (selectedProvider = e.detail)}
							{provider}
						/>
					{/if}
				{/key}
			{/each}
		</form>
	</section>
</div>
