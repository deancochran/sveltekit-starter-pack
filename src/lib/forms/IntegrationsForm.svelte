<script lang="ts">
	import IntegrationDisconnectButton from '$lib/components/IntegrationDisconnectButton.svelte';
	import IntegrationConnectButton from '$lib/components/IntegrationConnectButton.svelte';
	import {
		disconnect_user_integration_schema,
		type DisconnectUserIntegrationSchema
	} from '$lib/schemas';
	import { ThirdPartyIntegrationProvider, type thirdPartyIntegrationToken } from '@prisma/client';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';

	export let integrations: thirdPartyIntegrationToken[];
	export let form_data: SuperValidated<Infer<DisconnectUserIntegrationSchema>>;
	const integration_providers = Object.values(
		ThirdPartyIntegrationProvider
	) as ThirdPartyIntegrationProvider[];
	let user_integration_providers = integrations.map(
		(integration) => integration.provider as ThirdPartyIntegrationProvider
	);
	let unconnected_providers = integration_providers.filter(
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
				{#if unconnected_providers.includes(provider)}
					<IntegrationConnectButton {provider} />
				{:else if $delayed && selectedProvider === provider}
					<LoadingIcon />
				{:else}
					<IntegrationDisconnectButton
						on:disconnect={(e) => (selectedProvider = e.detail)}
						{provider}
					/>
				{/if}
			{/each}
		</form>
	</section>
</div>
