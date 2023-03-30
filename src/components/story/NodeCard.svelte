<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'
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
	export let fetchOnLoad = false
	export let sentBy = ''

	let container
	let canFetch = false

	onMount(() => {
		let observer = new IntersectionObserver(
			([entry], self) => {
				if (entry.isIntersecting && image) {
					canFetch = true

					self.unobserve(entry.target)
				}
			},
			{
				threshold: 0
			}
		)

		observer.observe(container)

		return () => observer.unobserve(container)
	})

	let imagePrm = null

	$: if ((image && canFetch) || (image && fetchOnLoad)) {
		if (image instanceof Promise) {
			imagePrm = image.then((path) =>
				dbx
					.filesGetTemporaryLink({ path })
					.then(({ result: { link } }) => link)
					.catch((err) => {
						globalError.pushError(err)

						return '/unicorn.svg'
					})
			)
		} else {
			let path = image

			imagePrm = dbx
				.filesGetTemporaryLink({ path })
				.then(({ result: { link } }) => link)
				.catch((err) => {
					globalError.pushError(err)

					return '/unicorn.svg'
				})
		}
	}

	const select = () => dispatch('select')
	const remove = () => dispatch('remove')
</script>

<button
	bind:this={container}
	class:!border-cyan-400={isSelected}
	class="btn   btn-primary  no-animation  flex-col   p-2   relative   h-fit  w-full   border-transparent  border-2  shadow"
	on:click={select}
	on:focus={select}
	type="button"
>
	<span data-test={`node-name-${name}`} class="text-xs self-start">{name}</span>
	<span data-test={`node-text-${name}`} class="text-sm">{cleanText}</span>

	{#if image}
		{#await imagePrm}
			<div class="flex h-96">
				<Spinner />
			</div>
		{:then src}
			<img
				{src}
				alt="message"
				style="width: 100%;"
				loading="lazy"
				data-lazy-load
			/>
		{:catch}
			<img
				src="/unicorn.svg"
				alt="error"
				style="width: 100%;"
				loading="lazy"
				data-lazy-load
			/>
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
