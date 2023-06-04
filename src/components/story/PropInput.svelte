<script lang="ts">
	import { params } from '@roxi/routify'
	import { createEventDispatcher } from 'svelte'
	import { getImagePromise } from '../../lib/images/imagePromise'
	import { config } from '../../lib/stores/configs'
	import Trash from '../../styles/icons/trash.svelte'
	import AddButton from '../button/AddButton.svelte'
	import ConfirmButton from '../button/ConfirmButton.svelte'

	const dispatch = createEventDispatcher()

	export let name: string = ''
	export let placeholder: string = ''
	export let type = ''
	export let value: string | number | TGetImagePromise | boolean | undefined
	export let isNotRemovable = false
	export let isAddable = false

	$: storyId = $params.storyId

	let files: FileList = null

	const add = () => dispatch('add', { name, value, type })
	const remove = () => dispatch('remove')

	const loadImage = () => {
		value = getImagePromise({
			config: $config[storyId]?.baseDir ?? {
				value: '/',
				enabled: true
			},
			file: files[0]
		})
	}
</script>

<span
	class="w-full gap-2 flex items-center justify-between cursor-pointer transition-all hover:text-slate-300"
>
	<slot />

	<span class="flex gap-2 items-center">
		{#if isAddable}
			<AddButton
				class="w-6"
				type="prop"
				on:click={add}
				data-test={`node-prop-add-${name}`}
			/>
		{/if}
		{name}
	</span>

	{#if value !== undefined}
		{#if typeof value === 'boolean'}
			<input
				data-test={`input-${isAddable ? 'local' : 'node'}-prop-${name}`}
				type="checkbox"
				bind:checked={value}
				class="toggle toggle-primary ml-auto"
			/>
		{:else if type === 'number'}
			<input
				{placeholder}
				data-test={`input-${isAddable ? 'local' : 'node'}-prop-${name}`}
				type="number"
				step="any"
				bind:value
				class="input w-full input-primary input-sm"
			/>
		{:else if type === 'file'}
			<input
				data-test={`input-${isAddable ? 'local' : 'node'}-prop-${name}`}
				type="file"
				bind:files
				on:change={loadImage}
				class="file-input file-input-sm file-input-bordered file-input-primary w-full"
			/>
		{:else}
			<input
				{placeholder}
				data-test={`input-${isAddable ? 'local' : 'node'}-prop-${name}`}
				bind:value
				class="input w-full input-primary input-sm"
			/>
		{/if}
	{/if}

	{#if !isNotRemovable}
		<ConfirmButton
			dataTest={`remove-${isAddable ? 'local' : 'node'}-prop-${name}`}
			on:confirm={remove}
			classes="cursor-pointer w-auto h-auto p-1 rounded"
		>
			<Trash />
		</ConfirmButton>
	{/if}
</span>
