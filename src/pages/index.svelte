<script lang="ts">
	import { url } from '@roxi/routify'
	import { v4 as uuidv4 } from 'uuid'
	import CircleXmark from '../styles/icons/circle-xmark.svelte'
	import ConfirmButton from '../components/ConfirmButton.svelte'
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

	const remove = (index: number) => {
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

<div class="flex items-center justify-center flex-wrap h-auto w-full gap-4 p-2">
	{#each $stories as story, index}
		<a href={$url(`./story/${story.ifid}`)} class="btn btn-primary relative">
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
	class="flex self-end justify-center w-full p-2 gap-1 h-auto flex-wrap"
>
	<div class="w-full flex items-center justify-center flex-wrap gap-2 mb-2">
		<button class="btn btn-primary" on:click={add}>+ create new</button>
		<button class="btn btn-primary" on:click={importStory}
			>+ import from clipboard</button
		>
	</div>

	<label class="w-full text-sm">
		<input
			bind:value={storyName}
			class="
      h-20 
      w-full 
      input input-primary input-lg"
		/>
	</label>
</form>
