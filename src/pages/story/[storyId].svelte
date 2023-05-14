<script lang="ts">
	import { v4 as uuidv4 } from 'uuid'
	import Header from '../../components/header/Header.svelte'
	import NodeCard from '../../components/story/NodeCard.svelte'
	import ConfigsMenu from '../../components/story/props/ConfigsMenu.svelte'
	import PropsMenu from '../../components/story/props/PropsMenu.svelte'
	import { copy } from '../../lib/copy'
	import { add, remove } from '../../lib/nodesv2'
	import { config } from '../../lib/stores/configs'
	import {
		stories,
		storiesFetching,
		storiesSync
	} from '../../lib/stores/stories'
	import { EmptyStory, findStory, updateStory } from '../../lib/stores/story'
	import Gear from '../../styles/icons/gear.svelte'
	import Magnet from '../../styles/icons/magnet.svelte'

	export let storyId: string

	let selectedIndex = 0
	let tabOpen = 'props'

	const story = $stories.find(findStory(storyId)) ?? EmptyStory

	$: storyConfigs = $config[storyId]
	$: selectedNode = story.passages[selectedIndex]

	const addNode = (node = {}) => {
		story.passages = [
			...add({
				nodes: story.passages,
				beginning: $config[storyId]?.reverseOrder?.value,
				add: {
					...node,
					parentPid: selectedNode.pid ?? uuidv4(),
					pid: uuidv4(),
					name: story.passages.length + 1,
					cleanText: '',
					links: []
				}
			})
		]

		selectedIndex = $config[storyId]?.reverseOrder
			? 0
			: story.passages.length - 1
	}

	const deleteNode = (node: StoryNode) => {
		if (selectedIndex !== 0) selectedIndex -= 1

		if (story.passages.length !== 1) {
			story.passages = [...remove({ nodes: story.passages, remove: node })]

			return
		}

		story.passages[0] = {
			cleanText: '',
			links: [],
			name: '1',
			pid: 'root',
			parentPid: null
		}
	}

	$: if (
		(storyConfigs?.reverseOrder?.enabled && story.passages[0].name === '1') ||
		(!storyConfigs?.reverseOrder?.enabled && story.passages[0].name !== '1')
	) {
		story.passages = [...story.passages.reverse()]
	}

	$: if (story?.name) {
		$stories = { ...$stories.map(updateStory(story)) }
	}
</script>

<div class="w-full h-full">
	<Header
		headerName={story.storyName}
		onSync={storiesSync}
		onCopy={() => copy(story)}
		isFetching={storiesFetching}
		id={storyId}
	/>

	<div class="flex items-center justify-center w-full h-4/5 gap-2 px-2">
		<div
			class="flex items-center justify-center relative flex-wrap gap-2 p-4 w-1/2 h-auto max-h-full overflow-y-scroll custom-scroll"
		>
			<div
				class="flex items-center justify-center relative flex-wrap w-full gap-2"
			>
				{#each story.passages as node, index}
					<NodeCard
						cleanText={node.cleanText}
						image={node.image}
						name={node.name}
						fetchOnLoad={index === 0}
						sentBy={node.sentBy}
						isSelected={index === selectedIndex}
						on:select={() => (selectedIndex = index)}
						on:remove={() => deleteNode(node)}
					/>
				{/each}
			</div>

			<div
				class="mt-2 sticky bottom-0 rounded flex items-center justify-center bg-slate-900 p-4 gap-2"
			>
				<button class="btn btn-primary" data-test="add-node" on:click={addNode}
					>+ new</button
				>
				<button
					class="btn btn-primary"
					data-test="duplicate-node"
					on:click={() => addNode(selectedNode)}>+ duplicate node</button
				>
			</div>
		</div>

		<div class="flex items-center justify-center flex-wrap w-1/2 h-full">
			<div class="tabs tabs-boxed w-full self-start">
				<button
					on:click={() => (tabOpen = 'props')}
					class="tab gap-2"
					data-test="prop-menu"
					class:tab-active={tabOpen === 'props'}><Magnet /> Props</button
				>
				<button
					on:click={() => (tabOpen = 'configs')}
					class="tab gap-2"
					data-test="prop-confi"
					class:tab-active={tabOpen === 'configs'}
				>
					<Gear /> Config</button
				>
			</div>
			{#if tabOpen === 'props'}
				<PropsMenu bind:node={story.passages[selectedIndex]} />
			{:else if tabOpen === 'configs'}
				<ConfigsMenu {storyId} />
			{/if}
		</div>
	</div>

	<form
		class="flex self-end w-full h-auto p-2 gap-1"
		on:submit|preventDefault={addNode}
	>
		<label class="w-full text-sm">
			<input
				data-test="input-node"
				bind:value={story.passages[selectedIndex].cleanText}
				class="h-20 w-full input input-primary input-lg"
			/>
		</label>
	</form>
</div>
