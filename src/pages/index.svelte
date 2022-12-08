<script lang="ts">
	import { url } from '@roxi/routify'
	import { v4 as uuidv4 } from 'uuid'
	import CircleXmark from '../assets/icons/circle-xmark.svelte'
	import ConfirmButton from '../components/ConfirmButton.svelte'
	import InputField from '../components/InputField.svelte'
	import { stories } from '../lib/stories'

	let storyName = ''

	const add = () => {
		if (!storyName) return
		stories.update((prev) => [
			...prev,
			{
				ifid: uuidv4(),
				passages: [],
				createdWith: import.meta.env.VITE_VERSION ?? 'none',
				name: storyName
			}
		])

		storyName = ''
	}

	const remove = (index) => {
		stories.update((prev) => {
			prev.splice(index, 1)

			return [...prev]
		})
	}

	const importStory = async () => {
		const storyString = await navigator.clipboard.readText()

		const story = JSON.parse(storyString)

		stories.update((prev) => [...prev, story])
	}
</script>

<div class="flex items-center justify-center flex-wrap h-4/5 w-full gap-4 p-2">
	{#each $stories as story, index}
		<a
			href={$url(`./story/${story.ifid}`)}
			class="flex
      items-center 
      justify-center
      relative 
      cursor-pointer
      text-white rounded 
      transition-all
      bg-indigo-700
      p-4
      hover:bg-indigo-500
      "
		>
			<span>{story.name}</span>

			<ConfirmButton
				on:click={(e) => e.stopPropagation()}
				classes="cursor-pointer absolute -top-2 -right-2 w-auto h-auto"
				on:confirm={() => remove(index)}
			>
				<CircleXmark />
			</ConfirmButton>
		</a>
	{/each}
</div>

<form
	on:submit|preventDefault
	class="flex justify-center w-full p-2 gap-1 h-auto"
>
	<InputField bind:value={storyName} />
	<div class="flex items-center justify-center flex-wrap w-auto gap-1">
		<button
			class="flex justify-center w-16 bg-indigo-700 transition-all hover:bg-indigo-500 rounded p-2"
			on:click={add}>add</button
		>
		<button
			class="flex justify-center w-16 bg-indigo-700 transition-all hover:bg-indigo-500 rounded p-2"
			on:click={importStory}>import</button
		>
	</div>
</form>
