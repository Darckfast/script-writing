<script lang="ts">
	import CircleXmark from '~/assets/icons/circle-xmark.svelte'
	import { createEventDispatcher } from 'svelte'
	import ConfirmButton from './ConfirmButton.svelte'

	const dispatch = createEventDispatcher()
	export let name: string = ''
	export let placeholder: string = ''
	export let value: string | number | boolean = ''
	export let isNotRemovable = false

	const change = () => dispatch('change', { name, value })
	const remove = () => dispatch('remove')
</script>

<label
	class="w-full gap-2 flex items-center justify-start cursor-pointer transition-all hover:text-slate-300"
>
	<slot />
	{name}
	<input
		{placeholder}
		on:change={change}
		class="transition-all rounded w-full outline-none border-none px-2 bg-transparent ring-1 ring-indigo-700  focus:ring-indigo-500"
		bind:value
	/>
	{#if !isNotRemovable}
		<ConfirmButton on:confirm={remove}>
			<CircleXmark />
		</ConfirmButton>
	{/if}
</label>
