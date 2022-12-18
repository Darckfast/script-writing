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

	const stringToColour = (str?: string): string => {
		if (!str) return '#fff'
		let hash = 0
		let colour = '#'

		for (var i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash)
		}

		for (var i = 0; i < 3; i++) {
			const value = (hash >> (i * 8)) & 0xff
			colour += ('00' + value.toString(16)).substr(-2)
		}

		return colour
	}
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
  `}
	on:click={select}
>
	<span class="text-xs self-start">{name}</span>
	<span class="text-sm">{cleanText}</span>

	<span
		class="
    w-5
    h-5
  bg-white
    absolute
    rounded-full
    -left-2
    -bottom-2
    "
		style={`background-color: ${stringToColour(sentBy)};`}
	/>
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
