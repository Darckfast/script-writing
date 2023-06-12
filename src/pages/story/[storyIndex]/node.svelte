<script lang="ts">
	import { Background, Svelvet } from 'svelvet'
	import Header from '../../../components/header/Header.svelte'
	import Passage from '../../../components/story/Passage.svelte'
	import PropAnchor from '../../../components/story/PropAnchor.svelte'
	import PropsConfigsV2 from '../../../components/story/PropsConfigs.svelte'
	import PropsMenuV2 from '../../../components/story/PropsMenu.svelte'
	import { props, remove } from '../../../lib/nodes.utils'
	import {
		copyStory,
		stories,
		storiesFetching,
		storiesSync
	} from '../../../lib/stores/stories'

	export let storyIndex

	$: story = $stories[storyIndex]

	$: storyProps = story?.passages
		.map((passage) => {
			const basePosition = { ...passage.position } ?? { x: 0, y: 0 }
			basePosition.x = basePosition.x - 350

			const propArray = props(passage).map((prop, index) => {
				const defaultValue = {
					x: basePosition.x,
					y: basePosition.y + index * 50
				}
				prop.id = `${prop.pid}-${prop.name}`
				prop.position = defaultValue

				return prop
			})

			return propArray
		})
		.flat()

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
</script>

<!-- TODO: add duplicate node function -->
<div class="w-full h-full overflow-hidden">
	<Header
		floatHeader
		onSync={storiesSync}
		isFetching={storiesFetching}
		onCopy={() => copyStory(story)}
		headerName={story?.storyName}
		onReturn={() => ($stories = [...$stories])}
		id={story?.ifid}
	/>

	<Svelvet theme="dark" controls minimap>
		{#if story}
			{#each story.passages as node, index (`${node.pid}`)}
				<Passage
					bind:node
					fetchOnLoad={index === 0}
					isRoot={index === 0}
					on:addNode={addNode}
					on:changeRoot={() => changeRoot(index)}
					on:remove={() => deleteNode(node)}
				/>
			{/each}

			<PropsMenuV2 />

			<PropsConfigsV2 />

			{#each storyProps as { value, name, type, pid, position, id } (id)}
				<PropAnchor {value} propName={name} {type} {pid} {position} />
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
</div>
