<script lang="ts">
	import { CodeBlock } from '@skeletonlabs/skeleton';
</script>

<!-- <p class=" blur-md"> -->
{#if $$props.code && $$props.language}
	<CodeBlock
        shadow={'shadow-md'}
		code={$$props.code}
		language={$$props.language}
		buttonLabel={'Copy'}
		buttonCopied="Copied!"
		lineNumbers={true}
	/>
{/if}
<br/>