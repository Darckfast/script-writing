<script lang="ts">
	import { params } from '@roxi/routify'
	import { Anchor, Node, generateInput, generateOutput } from 'svelvet'
	import { save } from '../../lib/loadSave'
	import { config } from '../../lib/stores/configs'
	import Trash from '../../styles/icons/trash.svelte'
	import ConfirmButton from '../button/ConfirmButton.svelte'
	import FileInput from '../input/FileInput.svelte'
	import {
		default as NumberInput,
		default as TextInput
	} from '../input/TextInput.svelte'
	import Toggle from '../input/Toggle.svelte'

	export let prop: TProp
	export let isAddable = false

	const dataTest = `node-prop-${prop.pid}-${prop.name}`

	$: configs = $config[$params.storyId]

	const inputs = generateInput(prop)
	const output = generateOutput(inputs, (input) => input.value)

	$: ({ position, pid, name, id, type, value } = $inputs)

	$: {
		save({ key: `prop-position-${$pid}-${$name}`, value: $position })
	}
</script>

<Node id={$id} bind:position={$position} let:destroy>
	<span
		class="w-full gap-2 flex items-center justify-start cursor-pointer transition-all hover:text-slate-300"
	>
		<slot />
		<span class="flex gap-2 items-center">
			{$name}
		</span>

		{#if typeof $output === 'boolean'}
			<Toggle
				parameterStore={$inputs.value}
				{isAddable}
				propName={name}
				data-test={dataTest}
			/>
		{:else if $type === 'number'}
			<NumberInput
				parameterStore={$inputs.value}
				{isAddable}
				propName={name}
				data-test={dataTest}
			/>
		{:else if $type === 'file' || $name === 'image'}
			<FileInput
				data-test={dataTest}
				parameterStore={$inputs.value}
				baseDir={configs?.baseDir.value}
				{isAddable}
				propName={name}
			/>
		{:else if $value !== undefined}
			<TextInput
				data-test={dataTest}
				parameterStore={$inputs.value}
				{isAddable}
				propName={name}
			/>
		{/if}

		<ConfirmButton
			data-test={`node-prop-remove-${$pid}-${$name}`}
			on:confirm={destroy}
			classes="cursor-pointer w-auto h-auto p-1 rounded"
		>
			<Trash />
		</ConfirmButton>

		<Anchor
			output
			outputStore={output}
			connections={[[`node-${$pid}`, $name]]}
		/>
	</span>
</Node>
