<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { genColor } from '../../lib/colorGen'
	import { dbx } from '../../lib/stores/dbx'
	import { globalError } from '../../lib/stores/globalError'
	import Spinner from '../../styles/icons/spinner.svelte'
	import Trash from '../../styles/icons/trash.svelte'
	import ConfirmButton from '../button/ConfirmButton.svelte'

	const dispatch = createEventDispatcher()

	export let cleanText: string
	export let name: string | number = ''
	export let image: Promise<string> | string = ''
	export let isSelected = false
	export let sentBy = ''

	let imagePrm = Promise.resolve('')

	$: if (image) {
		imagePrm =
			image instanceof Promise
				? image.then((path) => getLink(path))
				: getLink(image)
	}

	const getLink = (path: string): Promise<string> =>
		$dbx
			.filesGetTemporaryLink({ path })
			.then(({ result: { link } }) => link)
			.catch((err) => {
				globalError.pushError(err)

				return ''
			})

	const select = () => dispatch('select')
	const remove = () => dispatch('remove')
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
	on:focus={select}
	type="button"
>
	<span class="text-xs self-start">{name}</span>
	<span class="text-sm">{cleanText}</span>

	{#if image}
		{#await imagePrm}
			<div class="flex h-96">
				<Spinner />
			</div>
		{:then src}
			<img {src} alt="message" style="min-height: 24rem;" loading="lazy" />
		{/await}
	{/if}
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
		style={`background-color: ${genColor(sentBy)};`}
	/>
	<ConfirmButton
		on:click={(e) => e.stopPropagation()}
		on:confirm={remove}
		classes="cursor-pointer absolute -top-2 -right-2 w-auto h-auto p-1 rounded"
	>
		<Trash />
	</ConfirmButton>
</button>
