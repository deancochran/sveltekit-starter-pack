<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { time_schema } from '$lib/schemas';

	import { zod } from 'sveltekit-superforms/adapters';
	import InputLabel from '../InputLabel.svelte';
	import NumberInput from '../NumberInput.svelte';

	import {
		formFieldProxy,
		type SuperForm,
		type FormPathLeaves,
		defaults,
		superForm
	} from 'sveltekit-superforms';

	export let superform: SuperForm<T>;
	export let field: FormPathLeaves<T>;

	const { value, errors, constraints } = formFieldProxy<T, FormPathLeaves<T>, number>(
		superform,
		field
	);

	const time_superform = superForm(defaults(zod(time_schema)), {
		id: 'time_form',
		SPA: true
	});
	const { form } = time_superform;
	$: {
		$value = $form.hours * 3600 + $form.minutes * 60 + $form.seconds;
	}
</script>

<InputLabel label="Duration">
	<NumberInput superform={time_superform} field="hours" min="0" max="23" />
	<NumberInput superform={time_superform} field="minutes" min="0" max="59" />
	<NumberInput superform={time_superform} field="seconds" min="0" max="59" />
</InputLabel>
{#if $errors}<span class="invalid">{$errors}</span>{/if}
