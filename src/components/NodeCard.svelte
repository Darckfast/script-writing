<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import Trash from '../styles/icons/trash.svelte'
	import ConfirmButton from './ConfirmButton.svelte'

	const dispatch = createEventDispatcher()

	export let cleanText = ''
	export let name: string | number = ''
	export let pid = ''
	export let isSelected = false
	export let sentBy = ''

	const select = () => dispatch('select', { pid })
	const remove = () => dispatch('remove', { pid })
</script>

<button
	class={`
  btn 
  btn-primary
  no-animation
  flex-col 
  p-2 
  relative 
  h-fit 
  w-full 
  border-transparent
  border-2
  shadow
  ${isSelected ? 'border-cyan-400' : ''}
  ${sentBy}
  `}
	on:click={select}
>
	<span class="text-xs self-start">{name}</span>
	<span class="text-sm">{cleanText}</span>

	<ConfirmButton
		on:click={(e) => e.stopPropagation()}
		on:confirm={remove}
		classes="cursor-pointer absolute -top-2 -right-2 w-auto h-auto p-1 rounded btn-error"
	>
		<Trash />
	</ConfirmButton>
</button>

<!-- {#if node.time !== undefined}
	<div>
		<span
			class={`
    text-xs
    w-auto 
    z-10 
    relative 
    after:h-1 
    after:absolute
    top-1/2
    h-1/2
    border-2
    -translate-x-1/2
    -translate-y-1/2
    z-10
    `}>{node.time}</span
		>
	</div>
{/if} -->
