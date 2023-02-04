<script lang="ts">
	import { url } from '@roxi/routify'
	import { readText } from '@tauri-apps/api/clipboard'
	import { v4 as uuidv4 } from 'uuid'
	import ConfirmButton from '../components/button/ConfirmButton.svelte'
	import { dbxAuth } from '../lib/stores/dbx'
	import { globalError } from '../lib/stores/globalError'
	import { stories, storiesFetching, storiesInit } from '../lib/stores/stories'
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

	const copyStory = () => {}
</script>

<div class="flex items-center justify-center flex-wrap h-auto w-full gap-4 p-2">
	<div class="w-full flex justify-center gap-2 items-center h-4">
		{#if $storiesFetching}
			<Spinner />
			<span>syncing stories...</span>
		{/if}
	</div>

	{#each $stories as story, index}
		<div>
			<a
				data-test={`a-story-node-${index}`}
				href={$url(`./story/${story.ifid}`)}
				class="gap-2 btn btn-primary relative no-animation"
			>
				{story.storyName}
			</a>

			<ConfirmButton
				dataTest="btn-delete-story"
				on:click={(e) => e.stopImmediatePropagation()}
				on:confirm={() => remove(index)}
				classes="cursor-pointer w-auto h-auto p-1 rounded"
			>
				<Trash />
			</ConfirmButton>
		</div>
	{/each}
</div>

<form
	on:submit|preventDefault
	class="flex self-end justify-center w-full p-2 gap-1 h-auto flex-wrap"
>
	<div class="w-full flex items-center justify-center flex-wrap gap-2 mb-2">
		<button class="btn btn-primary" data-test="btn-create-story" on:click={add}
			>+ create new</button
		>
		<button
			class="btn btn-primary"
			data-test="btn-import-story"
			on:click={importStory}>+ import from clipboard</button
		>

		<button
			class="btn btn-primary"
			data-test="btn-export-story"
			on:click={() => copyStory()}>> export all stories</button
		>

		<button
			data-test="btn-sync-story"
			class="btn btn-primary"
			disabled={!$dbxAuth.getAccessToken()}
			on:click={() => storiesInit()}>+ sync</button
		>
		<a href={$url(`./config`)} class="btn btn-primary" data-test="a-config"
			>$ configuration</a
		>
	</div>

	<label class="w-full text-sm">
		<input
			data-test="input-story-name"
			bind:value={storyName}
			class="
      h-20 
      w-full 
      input input-primary input-lg"
		/>
	</label>
</form>
