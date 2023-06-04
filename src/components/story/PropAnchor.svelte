<script lang="ts">
	import { params } from '@roxi/routify'
	import { Anchor, Node, generateInput, generateOutput } from 'svelvet'
	import { v4 as uuidv4 } from 'uuid'
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

	export let propName: string = ''
	export let type = ''
	export let value: string | number | TGetImagePromise | boolean
	export let isAddable = false
	export let pid: string | number = ''
	export let position = { x: 0, y: 0 }

	const id = uuidv4()

	$: configs = $config[$params.storyId]

	const inputs = generateInput({ value })
	const output = generateOutput(inputs, (input) => input.value)

	$: {
		save({ key: `${pid}-${propName}`, value: position })
	}
</script>

<Node {id} bind:position let:destroy>
	<span
		class="w-full gap-2 flex items-center justify-start cursor-pointer transition-all hover:text-slate-300"
	>
		<slot />
		<span class="flex gap-2 items-center">
			{propName}
		</span>

		{#if typeof $output === 'boolean'}
			<Toggle
				parameterStore={$inputs.value}
				{isAddable}
				{propName}
				data-test={`node-prop-${pid}-${propName}`}
			/>
		{:else if type === 'number'}
			<NumberInput
				parameterStore={$inputs.value}
				{isAddable}
				{propName}
				data-test={`node-prop-${pid}-${propName}`}
			/>
		{:else if type === 'file' || propName === 'image'}
			<FileInput
				data-test={`node-prop-${pid}-${propName}`}
				parameterStore={$inputs.value}
				baseDir={configs?.baseDir.value}
				{isAddable}
				{propName}
			/>
		{:else if value !== undefined}
			<TextInput
				data-test={`node-prop-${pid}-${propName}`}
				parameterStore={$inputs.value}
				{isAddable}
				{propName}
			/>
		{/if}

		<ConfirmButton
			data-test={`node-prop-remove-${pid}-${propName}`}
			on:confirm={destroy}
			classes="cursor-pointer w-auto h-auto p-1 rounded"
		>
			<Trash />
		</ConfirmButton>

		<Anchor
			output
			outputStore={output}
			connections={[[`node-${pid}`, propName]]}
		/>
	</span>
</Node>
