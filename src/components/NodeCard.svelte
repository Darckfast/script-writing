<script lang="ts">
	import CircleXmark from '~/assets/icons/circle-xmark.svelte'
	import { createEventDispatcher } from 'svelte'
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
  flex
  justify-between 
  items-center 
  cursor-pointer 
  place-self-center 
  flex-col 
  p-2 
  relative 
  h-fit 
  w-full 
  rounded 
  transition-all 
  bg-indigo-700
  hover:bg-indigo-600 
  border-transparent
  border-2
  shadow
  ${isSelected ? 'border-cyan-400' : ''}
  ${sentBy}
  `}
	on:click={select}
>
	<span class="text-sm self-start">{name}</span>
	<span class="text-xs">{cleanText}</span>

	<ConfirmButton
		on:click={(e) => e.stopPropagation()}
		on:confirm={remove}
		classes="cursor-pointer absolute -top-2 -right-2 w-auto h-auto"
	>
		<CircleXmark />
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
