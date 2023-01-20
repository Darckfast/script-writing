<script lang="ts">
	import { url } from '@roxi/routify'
	import { writeText } from '@tauri-apps/api/clipboard'
	import { v4 as uuidv4 } from 'uuid'
	import NodeCard from '../../components/story/NodeCard.svelte'
	import ConfigsMenu from '../../components/story/props/ConfigsMenu.svelte'
	import PropsMenu from '../../components/story/props/PropsMenu.svelte'
	import { add, remove } from '../../lib/nodesv2'
	import { storiesFetching, storiesSync } from '../../lib/stores/stories'
	import { getStory } from '../../lib/stores/story'
	import ArrowLeft from '../../styles/icons/arrow-left.svelte'
	import Copy from '../../styles/icons/copy.svelte'
	import Gear from '../../styles/icons/gear.svelte'
	import Magnet from '../../styles/icons/magnet.svelte'
	import Spinner from '../../styles/icons/spinner.svelte'

	export let storyId: string

	let selectedIndex = 0
	let tabOpen = 'props'
	const story = getStory(storyId)

	$: selectedNode = $story.passages[selectedIndex]

	const addNode = (node = {}) => {
		$story.passages = [
			...add({
				nodes: $story.passages,
				add: {
					...node,
					parentPid: selectedNode.pid ?? uuidv4(),
					pid: uuidv4(),
					name: $story.passages.length + 1,
					cleanText: '',
					links: []
				}
			})
		]

		selectedIndex = $story.passages.length - 1
	}

	const deleteNode = (node: StoryNode) => {
		if (selectedIndex === 0) return

		selectedIndex -= 1

		$story.passages = [...remove({ nodes: $story.passages, remove: node })]
	}

	const getAsArray = () =>
		$story.passages.map((passage) => {
			delete passage.links
			delete passage.parentPid

			if (!passage.pid) passage.pid = uuidv4()

			for (const key in passage) {
				if (
					Object.prototype.hasOwnProperty.call(passage, key) &&
					!passage[key]
				) {
					delete passage[key]
				}
			}

			return passage
		})
</script>

<form on:submit|preventDefault class="w-full h-full">
	<header class="flex justify-between items-center w-full gap-2 px-2">
		<a href={$url('../../..')} class="btn btn-primary">
			<ArrowLeft /> go back</a
		>
		<h1>{$story.storyName}</h1>

		<button
			class="btn btn-xs gap-2 w-auto text-sm overflow-auto overflow-ellipsis"
			on:click={() => writeText(storyId)}
		>
			{storyId}<Copy /></button
		>

		<button
			class="btn btn-primary w-auto "
			on:click={() => writeText(JSON.stringify(story))}>> copy</button
		>

		<button class="btn btn-primary w-auto " on:click={() => storiesSync()}
			>{#if $storiesFetching}
				<Spinner />saving...
			{:else}
				> save
			{/if}</button
		>
		<button
			class="btn btn-primary"
			on:click={() => writeText(JSON.stringify(getAsArray()))}>> array</button
		>
	</header>
	<div class="flex items-center justify-center w-full h-4/5 gap-2 p-2">
		<div
			class="flex items-center justify-center relative flex-wrap gap-2 p-4 w-1/2 h-auto max-h-full overflow-y-scroll custom-scroll "
		>
			{#each $story.passages as node, index}
				<NodeCard
					cleanText={node.cleanText}
					image={node.image}
					name={node.name}
					sentBy={node.sentBy}
					isSelected={index === selectedIndex}
					on:select={() => (selectedIndex = index)}
					on:remove={() => deleteNode(node)}
				/>
			{/each}

			<div class="mt-2">
				<button class="btn btn-primary" on:click={addNode}>+ new</button>
				<button class="btn btn-primary" on:click={() => addNode(selectedNode)}
					>+ duplicate node</button
				>
			</div>
		</div>

		<div class="flex items-center justify-center flex-wrap w-1/2 h-full">
			<div class="tabs tabs-boxed w-full self-start">
				<button
					on:click={() => (tabOpen = 'props')}
					class="tab gap-2"
					class:tab-active={tabOpen === 'props'}><Magnet /> Props</button
				>
				<button
					on:click={() => (tabOpen = 'configs')}
					class="tab gap-2"
					class:tab-active={tabOpen === 'configs'}
				>
					<Gear /> Config</button
				>
			</div>
			{#if tabOpen === 'props'}
				<PropsMenu bind:node={$story.passages[selectedIndex]} />
			{:else if tabOpen === 'configs'}
				<ConfigsMenu {storyId} />
			{/if}
		</div>
	</div>

	<div class="flex self-end w-full h-auto p-2 gap-1">
		<label class="w-full text-sm">
			<input
				bind:value={$story.passages[selectedIndex].cleanText}
				class="
      h-20 
      w-full 
      input input-primary input-lg"
			/>
		</label>
	</div>
</form>
