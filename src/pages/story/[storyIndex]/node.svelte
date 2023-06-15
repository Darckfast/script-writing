<script lang="ts">
	import { slide } from 'svelte/transition'
	import { Background, Svelvet } from 'svelvet'
	import ShowHideButton from '../../../components/button/ShowHideButton.svelte'
	import Header from '../../../components/header/Header.svelte'
	import Passage from '../../../components/story/Passage.svelte'
	import PropAnchor from '../../../components/story/PropAnchor.svelte'
	import PropsMenu from '../../../components/story/PropsMenu.svelte'
	import { remove } from '../../../lib/nodes.utils'
	import {
		calculateLeafPositions,
		copyStory,
		organizePropsPosition,
		stories,
		storiesFetching,
		storiesSync
	} from '../../../lib/stores/stories'

	export let storyIndex

	let sorting = false
	let showPropMenu = false

	$: story = $stories[storyIndex]

	const addNode = ({ detail: nodeToAdd }: CustomEvent<StoryNode>) => {
		nodeToAdd.name = story.passages.length + 1

		story.latestPid ||= 1
		story.latestPid++

		story.passages.push(nodeToAdd)
	}

	const deleteNode = (node: StoryNode) => {
		if (story.passages.length !== 1) {
			story.passages = [...remove({ nodes: story.passages, removeNode: node })]
			return
		}

		story.passages[0] = {
			cleanText: '',
			links: [],
			name: 1,
			pid: 1
		}
	}

	const changeRoot = (index: number) => {
		const current = story.passages[index]
		story.passages.splice(index, 1, story.passages[0])
		story.passages[0] = current

		story.passages = [...story.passages]
	}

	const organizeNodes = () => {
		sorting = true
		calculateLeafPositions(story.passages, story.ifid)

		story.passages = [...story.passages]

		setTimeout(() => {
			sorting = false
		}, 1)
	}
</script>

<!-- TODO: add duplicate node function -->
<div class="w-full h-full overflow-hidden flex flex-wrap">
	<Header
		onSync={storiesSync}
		isFetching={storiesFetching}
		onCopy={() => copyStory(story)}
		onOrganize={organizeNodes}
		headerName={story?.storyName}
		onReturn={() => ($stories = [...$stories])}
		id={story?.ifid}
	/>

	<div
		class={`${showPropMenu ? 'w-2/3' : 'w-full'} relative transition-all`}
		style="height: 93%;"
	>
		<Svelvet theme="dark">
			{#if story && !sorting}
				{#each story.passages as node, index (`${node.pid}`)}
					<Passage
						let:showProps
						bind:node
						fetchOnLoad={index === 0}
						isRoot={index === 0}
						on:addNode={addNode}
						on:changeRoot={() => changeRoot(index)}
						on:remove={() => deleteNode(node)}
					>
						{#if showProps}
							{#each organizePropsPosition(node, story.ifid) as prop (prop.id)}
								<PropAnchor {prop} />
							{/each}
						{/if}
					</Passage>
				{/each}
			{/if}

			<Background
				dotColor="#fff"
				bgColor="transparent"
				gridWidth={40}
				dotSize={3}
				slot="background"
			/>
		</Svelvet>

		<ShowHideButton
			class="absolute right-4 bottom-1/2 w-6"
			bind:show={showPropMenu}
		/>
	</div>

	{#if showPropMenu}
		<div class="w-1/3" style="height: 93%;" transition:slide={{ axis: 'x' }}>
			<PropsMenu />
		</div>
	{/if}
</div>
