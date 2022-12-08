<script lang="ts">
	import Button from '../../components/Button.svelte'
	import NodeCard from '../../components/NodeCard.svelte'
	import PropInput from '../../components/PropInput.svelte'
	import { onDestroy } from 'svelte'
	import { v4 as uuidv4 } from 'uuid'
	import InputField from '../../components/InputField.svelte'
	import { load, save } from '../../lib/loadSave'
	import { add, props, remove, update } from '../../lib/nodesv2'
	import { stories } from '../../lib/stories'

	export let storyId: string

	let storyProps = []
	let localProps = load<Props[]>(`props-${storyId}`)
	let story: Story
	let propName = ''
	let propValue = null
	let nodeText = ''
	let selectedPid = ''

	$: selectedNode =
		passages.find((p) => p.pid === selectedPid) ?? passages[passages.length - 1]
	$: passages = story.passages
	$: nodeProps = props(selectedNode)
	$: {
		stories.update((values: Story[]) =>
			values.map((value) => {
				if (value.ifid === story.ifid) {
					return {
						...story,
						passages
					}
				}

				return value
			})
		)

		localProps.sort((a, b) => a.name.localeCompare(b.name))
		save(`props-${storyId}`, localProps)
	}

	const unSubStory = stories.subscribe((value: Story[]) => {
		story = value.find((v) => v.ifid === storyId)

		if (!selectedPid) {
			selectedPid = story.passages[story.passages.length - 1].pid
		}

		storyProps = props(story)
	})

	const createProp = () => {
		localProps = [...localProps, { name: propName, value: propValue }]

		propName = ''
		propValue = ''
	}

	const removePropFromLocal = (index: number) => {
		localProps.splice(index, 1)

		localProps = [...localProps]
	}

	const removePropFromNode = (name: string) => {
		delete selectedNode[name]

		passages = [...update({ nodes: story.passages, update: selectedNode })]
	}

	const addNode = (copyOfNode = {}) => {
		passages = [
			...add({
				nodes: passages,
				add: {
					...copyOfNode,
					parentPid: selectedPid ?? uuidv4(),
					pid: uuidv4(),
					name: passages.length + 1,
					cleanText: nodeText,
					links: []
				}
			})
		]

		nodeText = ''
	}

	const deleteNode = (node: StoryNode) => {
		passages = [...remove({ nodes: passages, remove: node })]
	}

	const updateNode = (prop: Props) => {
		passages = [
			...update({
				nodes: story.passages,
				update: {
					pid: selectedPid,
					[prop.name]: prop.value
				}
			})
		]
	}

	const setProp = (event: CustomEvent<any>) => {
		const { name, value } = event.detail

		passages = [
			...passages.map((passage) => {
				if (passage.pid === selectedPid) {
					return {
						...passage,
						[name]: value
					}
				}

				return passage
			})
		]
	}

	const getAsArray = () =>
		passages.map((passage) => {
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

	onDestroy(() => unSubStory())
</script>

<div class="flex items-center justify-center w-full h-4/5 gap-2 p-2">
	<div
		class="flex items-center justify-center relative flex-wrap gap-2 p-2 w-1/2 h-full overflow-y-scroll custom-scroll "
	>
		{#each passages as node}
			<NodeCard
				{...node}
				isSelected={node?.pid === selectedPid}
				on:select={(e) => (selectedPid = e.detail.pid)}
				on:remove={() => deleteNode(node)}
			/>
		{/each}
	</div>

	<div class="flex items-center justify-center flex-col w-1/2 h-full">
		<div
			class="flex justify-between items-center p-1 gap-2 flex-wrap overflow-y-scroll custom-scroll"
		>
			{#each storyProps as prop}
				<PropInput {...prop} on:change={setProp} isNotRemovable />
			{/each}

			<hr class="m-2 w-full border-t-2 border-indigo-700" />

			{#each nodeProps as prop}
				<PropInput
					{...prop}
					on:change={setProp}
					on:remove={() => removePropFromNode(prop.name)}
				/>
			{/each}

			<hr class="m-2 w-full border-t-2 border-indigo-700" />

			{#each localProps as prop, index}
				<PropInput
					{...prop}
					on:change={updateNode}
					on:remove={() => removePropFromLocal(index)}
					><button on:click={() => updateNode(prop)}>+</button></PropInput
				>
			{/each}
		</div>

		<form on:submit|preventDefault class="mt-2">
			<label>
				<input
					placeholder="name"
					class="transition-all rounded w-32 outline-none border-none px-2 bg-transparent ring-1 ring-indigo-700 ml-auto focus:ring-indigo-500"
					bind:value={propName}
				/>
			</label>

			<label
				>:
				<input
					placeholder="value"
					bind:value={propValue}
					class="transition-all rounded w-32 outline-none border-none px-2 bg-transparent ring-1 ring-indigo-700 ml-auto focus:ring-indigo-500"
				/>
			</label>
			<Button onClick={createProp}>add</Button>
		</form>
	</div>
</div>

<form on:submit|preventDefault class="flex w-full h-auto p-2 gap-1">
	<InputField bind:value={selectedNode.cleanText} />
	<div class="flex justify-center items-center flex-wrap w-fit gap-1">
		<Button onClick={addNode}>add</Button>
		<Button onClick={() => addNode(selectedNode)}>add as copy</Button>

		<Button onClick={() => navigator.clipboard.writeText(JSON.stringify(story))}
			>copy</Button
		>
		<Button
			onClick={() =>
				navigator.clipboard.writeText(JSON.stringify(getAsArray()))}
			>copy as array</Button
		>
	</div>
</form>
