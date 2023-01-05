<script lang="ts">
	import { params } from '@roxi/routify'
	import { createEventDispatcher } from 'svelte'
	import { config } from '../../lib/stores/configs'
	import { dbx } from '../../lib/stores/dbx'
	import { globalError } from '../../lib/stores/globalError'
	import Trash from '../../styles/icons/trash.svelte'
	import ConfirmButton from '../button/ConfirmButton.svelte'

	const dispatch = createEventDispatcher()

	export let name: string = ''
	export let placeholder: string = ''
	export let type = ''
	export let value: any
	export let isNotRemovable = false
	export let isAddable = false

	$: storyId = $params.storyId

	let files: FileList = null

	const add = () => dispatch('add', { name, value })
	const remove = () => dispatch('remove')

	const loadImage = () => {
		value = new Promise<any>((resolve, reject) => {
			if (!files || !files.length) return reject(new Error('no file selected'))

			const [file] = files

			const reader = new FileReader()

			reader.onload = (event) =>
				resolve({ imageBuffer: event.target.result, fileName: file.name })

			reader.readAsArrayBuffer(file)
		})
			.then((image) => {
				let { value: configValue, enabled } = $config[storyId]?.baseDir ?? {
					value: '/',
					enabled: true
				}

				if (!enabled) {
					configValue = '/'
				}

				return {
					...image,
					path: `/data/assets${configValue}${image.fileName}`
				}
			})
			.then(({ path, imageBuffer }) =>
				$dbx.filesUpload({
					path,
					contents: imageBuffer
				})
			)
			.then(({ result: { path_display } }) => path_display)
			.catch((err) => globalError.pushError(err))
	}
</script>

<label
	class="
  w-full 
  gap-2 
  flex 
  items-center 
  justify-start 
  cursor-pointer 
  transition-all 
  hover:text-slate-300
  "
>
	<slot />
	{#if isAddable}
		<button on:click={add}>+</button>
	{/if}

	{name}

	{#if typeof value === 'boolean'}
		<input
			type="checkbox"
			bind:checked={value}
			class="toggle toggle-primary ml-auto"
		/>
	{:else if type === 'number'}
		<input
			{placeholder}
			type="number"
			bind:value
			class="input w-full input-primary input-sm"
		/>
	{:else if type === 'file'}
		<input
			type="file"
			bind:files
			on:change={loadImage}
			class="file-input file-input-sm	file-input-bordered file-input-primary w-full"
		/>
	{:else}
		<input
			{placeholder}
			bind:value
			class="input w-full input-primary input-sm"
		/>
	{/if}

	{#if !isNotRemovable}
		<ConfirmButton
			on:confirm={remove}
			classes="cursor-pointer w-auto h-auto p-1 rounded"
		>
			<Trash />
		</ConfirmButton>
	{/if}
</label>
