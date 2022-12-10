<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import Trash from '../styles/icons/trash.svelte'
	import ConfirmButton from './ConfirmButton.svelte'

	const dispatch = createEventDispatcher()
	export let name: string = ''
	export let placeholder: string = ''
	export let value: string | number | boolean = ''
	export let isNotRemovable = false
	export let isAddable = false

	const add = () => dispatch('add', { name, value })
	const change = () => dispatch('change', { name, value })
	const remove = () => dispatch('remove')
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
	{:else if typeof value === 'number'}
		<input
			{placeholder}
			on:change={change}
			type="number"
			bind:value
			class="input w-full input-primary input-sm"
		/>
	{:else}
		<input
			{placeholder}
			on:change={change}
			bind:value
			class="input w-full input-primary input-sm"
		/>
	{/if}
	<!-- <input
		{placeholder}
		on:change={change}
		class="input w-full input-primary input-sm"
		bind:value
	/> -->

	{#if !isNotRemovable}
		<ConfirmButton
			on:confirm={remove}
			classes="cursor-pointer w-auto h-auto p-1 rounded"
		>
			<Trash />
		</ConfirmButton>
	{/if}
</label>
