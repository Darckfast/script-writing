<script lang="ts">
	import { url } from '@roxi/routify'
	import { readText, writeText } from '@tauri-apps/api/clipboard'
	import { v4 as uuidv4 } from 'uuid'
	import ConfirmButton from '../components/button/ConfirmButton.svelte'
	import { globalError } from '../lib/stores/globalError'
	import { stories, storiesFetching, storiesInit } from '../lib/stores/stories'
	import ArrowLeft from '../styles/icons/arrow-left.svelte'
	import Copy from '../styles/icons/copy.svelte'
	import Spinner from '../styles/icons/spinner.svelte'
	import Trash from '../styles/icons/trash.svelte'

	let storyName = ''
	let showStoryOptions = ''

	const add = () => {
		if (!storyName) return

		stories.update((prev) => [
			...prev,
			{
				ifid: uuidv4(),
				passages: [
					{
						cleanText: '',
						links: [],
						name: 1,
						pid: 'root'
					}
				],
				createdWith: import.meta.env.VITE_VERSION,
				storyName
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
		try {
			const story = JSON.parse(await readText())

			if (story.length) {
				stories.update((prev) => [...prev, ...story])
			} else {
				stories.update((prev) => [...prev, story])
			}
		} catch (err) {
			globalError.pushError(err)
		}
	}
</script>

<div class="flex items-center justify-center flex-wrap h-auto w-full gap-4 p-2">
	<div class="w-full flex justify-center gap-2 items-center h-4">
		{#if $storiesFetching}
			<Spinner />
			<span>syncing stories...</span>
		{/if}
	</div>

	{#each $stories as story, index}
		<a
			href={$url(`./story/${story.ifid}`)}
			class={`btn
      gap-2 
      relative no-animation ${
				showStoryOptions === story.ifid ? 'btn-success' : 'btn-primary'
			}`}
		>
			{#if showStoryOptions === story.ifid}
				<button
					class="btn btn-sm btn-primary"
					on:click={() => (showStoryOptions = '')}
				>
					<ArrowLeft />
				</button>

				<button
					class="btn btn-sm"
					on:click={() => writeText(JSON.stringify(story))}
				>
					<Copy />
				</button>

				<ConfirmButton on:confirm={() => remove(index)} classes="btn btn-sm">
					<Trash />
				</ConfirmButton>
			{:else}
				<span>{story.storyName}</span>
			{/if}
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

		<button
			class="btn btn-primary"
			on:click={() => writeText(JSON.stringify($stories))}
			>> export all stories</button
		>

		<button class="btn btn-primary" on:click={() => storiesInit()}
			>+ sync</button
		>
		<a href={$url(`./config`)} class="btn btn-primary">$ configuration</a>
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
