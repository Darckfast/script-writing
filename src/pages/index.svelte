<script lang="ts">
	import { url } from '@roxi/routify'
	import { save } from '@tauri-apps/api/dialog'
	import { writeTextFile } from '@tauri-apps/api/fs'
	import dayjs from 'dayjs'
	import { v4 as uuidv4 } from 'uuid'
	import NodeButton from '../components/button/NodeButton.svelte'
	import { copy } from '../lib/copy'
	import { config } from '../lib/stores/configs'
	import { dbxAuth } from '../lib/stores/dbx'
	import { documents, documentsSync } from '../lib/stores/documents'
	import {
		replaceImage,
		stories,
		storiesFetching,
		storiesSync
	} from '../lib/stores/stories'
	import Spinner from '../styles/icons/spinner.svelte'

	let storyName = ''

	const addDocument = () => {
		if (!storyName) return

		$documents.push({
			id: uuidv4(),
			name: storyName,
			content: {
				json: {}
			}
		})

		storyName = ''

		$documents = [...$documents]
	}

	const add = () => {
		if (!storyName) return

		const ifid = uuidv4()

		$stories.push({
			ifid,
			latestPid: 1,
			passages: [
				{
					cleanText: '',
					links: [],
					name: 1,
					pid: 1,
					position: {
						x: 150,
						y: 60
					}
				}
			],
			createdWith: import.meta.env.VITE_VERSION,
			storyName
		})

		$config[ifid] = {
			baseDir: { value: `public/${storyName}`, enabled: true },
			reverseOrder: { value: true, enabled: true },
			group: {
				enabled: true,
				value: ''
			},
			type: {
				enabled: true,
				value: 'story'
			}
		}

		storyName = ''
		$stories = [...$stories]
	}

	const removeDoc = (index: number) => {
		$documents.splice(index, 1)
		$documents = [...$documents]
	}

	const remove = (index: number) => {
		$stories.splice(index, 1)
		$stories = [...$stories]
	}

	const bundleStories = async () => {
		const tempIndex = {}

		$stories.forEach((story) => {
			const newStory = replaceImage(story)
			const configs = $config[newStory.ifid]

			if (!configs?.group.value) return

			tempIndex[configs.group.value] ||= []

			if (configs?.type?.value === 'array') {
				tempIndex[configs.group.value] = [
					...tempIndex[configs.group.value],
					...newStory.passages
				]

				return
			}

			tempIndex[configs.group.value].push(newStory)
		})

		$documents.forEach((document) => {
			tempIndex[document.name] = JSON.parse(document.content.text)
		})

		const exportedIndex = []

		for (const key of Object.keys(tempIndex)) {
			exportedIndex.push({
				name: key,
				contents: tempIndex[key]
			})
		}

		if (!(window as any).__TAURI_IPC__) {
			copy(exportedIndex)

			return
		}

		const fileName = `${dayjs().format('YYYY-MM-DD')}.json`

		// TODO: set default path to Documents folder
		const filePath = await save({
			title: fileName,
			defaultPath: fileName,
			filters: [
				{
					name: 'JSON',
					extensions: ['json']
				}
			]
		})

		await writeTextFile({
			contents: JSON.stringify(exportedIndex),
			path: filePath
		})
	}
</script>

<div class="flex items-center justify-center flex-wrap h-auto w-full gap-4 p-2">
	<div class="w-full flex justify-center gap-2 items-center h-4">
		{#if $storiesFetching}
			<Spinner />
			<span>syncing stories...</span>
		{/if}
	</div>

	<h1 class="text-2xl justify-start w-full">stories</h1>
	<hr class="border-b border-gray-400 w-full" />

	{#each $stories as story, index}
		<NodeButton
			href={$url(`./story/:storyIndex/node`, {
				storyIndex: index,
				storyId: story.ifid
			})}
			name={story.storyName}
			{index}
			onRemove={() => remove(index)}
			type="story"
		/>
	{/each}

	<h1 class="text-2xl justify-start w-full">documents</h1>
	<hr class="border-b border-gray-400 w-full" />

	{#if !$documents.length}
		<span class="text-slate-400" data-test="empty-doc-placeholder"
			>no documents available</span
		>
	{/if}

	{#each $documents as document, index}
		<NodeButton
			href={$url(`./document/:documentIndex`, {
				documentIndex: index,
				documentId: document.id
			})}
			name={document.name}
			{index}
			onRemove={() => removeDoc(index)}
			type="document"
		/>
	{/each}
</div>

<div class="flex self-end justify-center w-full p-2 gap-1 h-auto flex-wrap">
	<div class="w-full flex items-center justify-center flex-wrap gap-2 mb-2">
		<button class="btn btn-primary" data-test="btn-create-story" on:click={add}
			>+ story</button
		>

		<button
			class="btn btn-primary"
			data-test="btn-create-document"
			on:click={addDocument}>+ document</button
		>

		<button
			class="btn btn-primary"
			data-test="btn-export-story"
			on:click={() => bundleStories()}>> generate bundle</button
		>

		<button
			data-test="btn-sync-story"
			class="btn btn-primary"
			disabled={!$dbxAuth.getAccessToken()}
			on:click={() => {
				storiesSync()
				documentsSync()
			}}>= sync</button
		>
		<a href={$url(`./config`)} class="btn btn-primary" data-test="a-config"
			>$ configurations</a
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
</div>
