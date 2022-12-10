<script lang="ts">
	import NodeCard from '../../components/NodeCard.svelte'
	import PropInput from '../../components/PropInput.svelte'
	import { onDestroy } from 'svelte'
	import { v4 as uuidv4 } from 'uuid'
	import { load, save } from '../../lib/loadSave'
	import { add, props, remove, update } from '../../lib/nodesv2'
	import { stories } from '../../lib/stories'
	import { url } from '@roxi/routify'
	import ArrowLeft from '../../styles/icons/arrow-left.svelte'
	import Copy from '../../styles/icons/copy.svelte'

	export let storyId: string

	let storyProps = []
	let localProps = load<Props[]>(`props-${storyId}`)
	let propName = ''
	let propValue = null
	let story: Story

	let selectedPid = ''
	let propType = 'text'

	const propTypes = ['text', 'boolean', 'number']

	$: selectedNode = passages.find((p) => p.pid === selectedPid) ?? {
		cleanText: '',
		pid: uuidv4()
	}
	$: passages = story?.passages ?? []
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

		if (!story) return

		if (!selectedPid && story.passages.length) {
			selectedPid = story.passages[story.passages.length - 1].pid
		}

		storyProps = props(story)
	})

	const createProp = () => {
		localProps = [
			...localProps,
			{ name: propName, value: propValue, type: propType }
		]

		propName = ''
		propValue = ''
	}

	const removePropFromLocal = (index: number) => {
		localProps.splice(index, 1)

		localProps = [...localProps]
	}

	const removePropFromStory = (name: string) => {
		delete story[name]

		story = {
			...story
		}
	}

	const removePropFromNode = (name: string) => {
		delete selectedNode[name]

		passages = [...update({ nodes: story.passages, update: selectedNode })]
	}

	const addNode = (copyOfNode = {}) => {
		const newNodePid = uuidv4()
		passages = [
			...add({
				nodes: passages,
				add: {
					...copyOfNode,
					parentPid: selectedPid ?? uuidv4(),
					pid: newNodePid,
					name: passages.length + 1,
					cleanText: '',
					links: []
				}
			})
		]

		selectedPid = newNodePid
	}

	const deleteNode = (node: StoryNode) => {
		passages = [...remove({ nodes: passages, remove: node })]
	}

	const updateNode = (event: CustomEvent<Props>) => {
		const { name, value } = event.detail

		passages = [
			...update({
				nodes: story.passages,
				update: {
					pid: selectedPid,
					[name]: value
				}
			})
		]
	}

	const setProp = (event: CustomEvent<Props>) => {
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

<header class="flex justify-between items-center w-full gap-2 px-2">
	<a href={$url('..')} class="btn btn-primary"> <ArrowLeft /> go back</a>
	<h1>{story?.storyName}</h1>

	<button
		class="btn btn-xs gap-2"
		on:click={() => navigator.clipboard.writeText(storyId)}
	>
		<span class="text-xs">{storyId}</span><Copy /></button
	>

	<button
		class="btn btn-primary"
		on:click={() => navigator.clipboard.writeText(JSON.stringify(story))}
		>copy story</button
	>
	<button
		class="btn btn-primary"
		on:click={() => navigator.clipboard.writeText(JSON.stringify(getAsArray()))}
		>copy as array</button
	>
</header>
<div class="flex items-center justify-center w-full h-4/5 gap-2 p-2">
	<div
		class="flex items-center justify-center relative flex-wrap gap-2 p-4 w-1/2 h-auto max-h-full overflow-y-scroll custom-scroll "
	>
		{#each passages as node}
			<NodeCard
				{...node}
				isSelected={node?.pid === selectedPid}
				on:select={(e) => (selectedPid = e.detail.pid)}
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

	<div class="flex items-center justify-center flex-col w-1/2 h-full">
		<div
			class="flex justify-between items-center p-1 gap-2 flex-wrap overflow-y-scroll custom-scroll"
		>
			{#each storyProps as prop}
				<PropInput
					{...prop}
					on:change={setProp}
					on:remove={() => removePropFromStory(prop.name)}
				/>
			{/each}

			{#each nodeProps as prop}
				<PropInput
					{...prop}
					on:change={setProp}
					on:remove={() => removePropFromNode(prop.name)}
				/>
			{/each}

			<hr class="m-4 w-full border-t-2 border-primary" />

			{#each localProps as prop, index}
				<PropInput
					{...prop}
					on:change={updateNode}
					on:remove={() => removePropFromLocal(index)}
					on:add={updateNode}
					isAddable
				/>
			{/each}
		</div>

		<form
			on:submit|preventDefault
			class="mt-2 flex justify-center items-center flex-wrap ring-1 ring-primary p-2 rounded "
		>
			<div class="w-full flex justify-between items-center">
				<label>
					<input
						placeholder="name"
						class="input input-primary input-sm"
						bind:value={propName}
					/>
					<span>:</span>
				</label>

				<label class="p-1">
					{#if propType === 'boolean'}
						<input
							type="checkbox"
							bind:checked={propValue}
							class="toggle toggle-primary"
						/>
					{:else if propType === 'number'}
						<input
							placeholder="0"
							type="number"
							bind:value={propValue}
							class="input input-primary input-sm"
						/>
					{:else}
						<input
							placeholder="value"
							bind:value={propValue}
							class="input input-primary input-sm"
						/>
					{/if}
				</label>

				<button class="btn btn-primary" on:click={createProp}>add</button>
			</div>

			<div class="w-full flex gap-4">
				{#each propTypes as type}
					<label class="flex items-center gap-2">
						<input
							bind:group={propType}
							value={type}
							type="radio"
							name="radio-2"
							class="radio radio-primary"
						/>
						{type}
					</label>
				{/each}
			</div>
		</form>
	</div>
</div>

<form on:submit|preventDefault class="flex self-end w-full h-auto p-2 gap-1">
	<label class="w-full text-sm">
		<input
			bind:value={selectedNode.cleanText}
			class="
      h-20 
      w-full 
      input input-primary input-lg"
		/>
	</label>
</form>
