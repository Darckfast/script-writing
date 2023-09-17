<script lang="ts">
	import type { CustomWritable } from 'svelvet'
	import FileInput from './FileInput.svelte'
	import NumberInput from './NumberInput.svelte'
	import TextInput from './TextInput.svelte'
	import Toggle from './Toggle.svelte'

	export let parameterStore: CustomWritable<any>
  export let baseDir = ''
  export let type = ''
</script>

{#if type === 'boolean'}
	<Toggle {parameterStore} data-test={$$props['data-test']} />
{:else if type === 'number'}
	<NumberInput {parameterStore} data-test={$$props['data-test']} />
{:else if type === 'file'}
	<FileInput
		data-test={$$props['data-test']}
		{parameterStore}
		baseDir={baseDir}
	/>
{:else}
	<TextInput data-test={$$props['data-test']} {parameterStore} />
{/if}