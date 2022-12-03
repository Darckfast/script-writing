<script lang="ts">
	import { v4 as uuidv4 } from 'uuid'
	import ArrowRotate from '../../assets/icons/arrow-rotate.svelte'
	import CircleXmark from '../../assets/icons/circle-xmark.svelte'
	import ConfirmButton from '../../components/ConfirmButton.svelte'
	import InputField from '../../components/InputField.svelte'
	import { load, save } from '../../lib/loadSave'
	import { add, props, remove, update } from '../../lib/nodesv2'
	import { stories } from '../../lib/stories'

	export let storyId: string

	let selectedNode = null
	let nodeProps = []
	let storyProps = []
	let localProps = load<Props[]>(`props-${storyId}`)
	let story: any = null
	let propName = ''
	let propValue = null
	let nodeText = ''
	let randomRange = 1

	$: {
		stories.update((values: StoryNode[]) =>
			values.map((value) => {
				if (value.ifid === story.ifid) {
					return story
				}

				return value
			})
		)

		localProps.sort((a, b) => a.name.localeCompare(b.name))
		save(`props-${storyId}`, localProps)
	}

	stories.subscribe((value: StoryNode[]) => {
		story = value.find((v) => v.ifid === storyId)

		if (selectedNode === null) {
			selectedNode = story.passages[story.passages.length - 1]
		}

		storyProps = props(story)
		nodeProps = props(selectedNode)
	})

	const selectNode = (node: StoryNode) => {
		selectedNode = node

		nodeProps = props(selectedNode)
	}

	const addProp = () => {
		localProps = [...localProps, { name: propName, value: propValue }]

		propName = ''
		propValue = ''
	}

	const removeProp = (index: number) => {
		localProps.splice(index, 1)

		localProps = [...localProps]
	}

	const removePropFromNode = (name: string) => {
		delete selectedNode[name]

		story = {
			...story,
			passages: update({ nodes: story.passages, update: selectedNode })
		}
	}

	const addCopyOfNode = () => {
		addNode(selectedNode)
	}

	const addNode = (copyOfNode = {}) => {
		const nodeToAdd = {
			...copyOfNode,
			parentPid: selectedNode?.pid ?? uuidv4(),
			pid: uuidv4(),
			name: `line-${story.passages.length + 1}`,
			cleanText: nodeText,
			links: []
		}

		story = {
			...story,
			passages: add({
				nodes: story.passages,
				add: nodeToAdd
			})
		}

		selectedNode = nodeToAdd
		nodeText = ''
	}

	const removeNode = (node: StoryNode) => {
		story = {
			...story,
			passages: remove({ nodes: story.passages, remove: node })
		}
	}

	const updateNode = (prop: Props) => {
		selectedNode = {
			[prop.name]: prop.value,
			...selectedNode
		}

		story = {
			...story,
			passages: update({ nodes: story.passages, update: selectedNode })
		}
	}

	const updateProp = (prop: Props) => {
		story = {
			...story,
			passages: story.passages.map((passage) => {
				if (passage.pid === selectedNode.pid) {
					const newPassage = {
						...passage,
						[prop.name]: prop.value
					}

					selectedNode = newPassage

					return newPassage
				}

				return passage
			})
		}
	}

	const getStoryAsArray = () => {
		return story.passages.map((passage) => {
			delete passage.links
			delete passage.parentPid

			if (!passage.pid) passage.pid = uuidv4()

			for (const key in passage) {
				if (Object.prototype.hasOwnProperty.call(passage, key)) {
					const element = passage[key]

					if (element === '' || element === undefined) {
						delete passage[key]
					}
				}
			}

			return passage
		})
	}
</script>

<div class="story-container">
	<div class="story-grid">
		{#if story !== undefined}
			{#each story.passages as node}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class={[
						'story-node',
						selectedNode.pid === node.pid ? 'active' : '',
						node.sentBy
					].join(' ')}
					on:click={() => selectNode(node)}
				>
					<span class="node-name">{node.name}</span>
					<span class="node-text">{node.cleanText}</span>

					<ConfirmButton
						on:click={(e) => e.stopPropagation()}
						onConfirm={() => removeNode(node)}
						classes="floating-remove-button"
						icon={CircleXmark}
					/>
				</div>

				{#if node.time !== undefined}
					<div>
						<span class="node-time">{node.time}</span>
					</div>
				{/if}
			{/each}
		{/if}
	</div>

	<div class="props">
		<div class="story-props">
			{#each storyProps as prop}
				<div class="story-prop">
					<label>
						{prop.name}
						<input class="prop-input" value={prop.value} />
					</label>
				</div>
			{/each}

			<hr />

			{#each nodeProps as prop}
				<div class="node-prop">
					<label>
						{prop.name}
						<!-- {#if propIsNumber(prop)}
							<label class="random-number">
								<input bind:value={randomRange} type="number" min="1" max="5" />
							</label>
							<a
								on:click={() => setRandomValue({ maxValue: randomRange, prop })}
							>
								<ArrowRotate />
							</a>
						{/if} -->

						<input
							on:change={() => updateProp(prop)}
							class="prop-input"
							bind:value={prop.value}
						/>

						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<a on:click={() => removePropFromNode(prop.name)}>
							<CircleXmark />
						</a>
					</label>
				</div>
			{/each}

			<hr />

			{#each localProps as prop, index}
				<div class="local-props">
					<label class="checkbox">
						<button class="add-button" on:click={() => updateNode(prop)}
							>+</button
						>
						{prop.name}
					</label>
					<label>
						<input class="prop-input" value={prop.value} />
					</label>

					<a on:click={() => removeProp(index)}>
						<CircleXmark />
					</a>
				</div>
			{/each}
		</div>

		<form on:submit|preventDefault class="add-props">
			<button on:click={addProp}>add</button>
			<fieldset>
				<legend>name</legend>
				<input bind:value={propName} class="prop-input" />
			</fieldset>

			<fieldset>
				<legend>value</legend>
				<input bind:value={propValue} class="prop-input" />
			</fieldset>
		</form>
	</div>
</div>
<form on:submit|preventDefault class="input-container">
	<InputField bind:value={nodeText} />
	<div class="horizontal-container">
		<button on:click={addNode}>add</button>
		<button on:click={addCopyOfNode}>add as copy</button>
		<button
			on:click={() => navigator.clipboard.writeText(JSON.stringify(story))}
			>copy</button
		>
		<button
			on:click={() =>
				navigator.clipboard.writeText(JSON.stringify(getStoryAsArray()))}
			>copy as array</button
		>
	</div>
</form>

<style lang="scss">
	@import '../../styles/pages/home.scss';
	@import '../../styles/variables.scss';

	.random-number {
		width: fit-content !important;

		input[type='number'] {
			outline: none;
			border: none;

			border-radius: 8px;

			background-color: lighten($background, 40%);
			padding: 0 0.2rem;

			width: 3rem;

			color: $text;

			&::-webkit-inner-spin-button {
				width: 2.4rem;
				height: 1.2rem;
				border-radius: 8px;

				transform: rotate(90deg);
				cursor: pointer;
			}
		}

		button {
			padding: 0 0.2rem;
		}
	}

	.add-button {
		cursor: pointer;
		width: 1.2rem;
		height: 1.2rem;
		text-align: center;
	}

	.prop-input {
		max-width: 10rem;
		width: auto;
		border-radius: 8px;
		height: 1.3rem;
		outline: unset;
		border: none;
		padding: 0 0.5rem 0 0.5rem;

		background-color: lighten($background, 60%);
	}

	.story-container {
		display: flex;
		justify-content: center;
		align-items: center;

		height: 100%;
		width: 100%;

		gap: 1rem;
		padding: 0 1rem;

		max-height: 80%;
	}

	.story-grid {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		flex-wrap: wrap;

		row-gap: 0.5rem;
		padding: 0.5rem;

		height: auto;
		max-height: 100%;
		overflow-y: scroll;

		width: 50%;

		&:before {
			content: '';
			height: 100%;
			width: 0.1rem;
			background-color: $primary;

			position: absolute;
		}
	}

	.props {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		width: 50%;
		height: 100%;

		gap: 1rem;
		border-radius: 8px;

		background-color: lighten($background, 30%);
	}

	.node-time {
		font-size: 12px;
		background-color: $background;
		width: auto;
		height: 1.2rem;
		z-index: 1;

		border: 3px solid $background;
		position: relative;

		&:after {
			content: '';

			width: 15rem;
			height: 2px;
			position: absolute;
			top: 50%;
			left: 50%;

			border-radius: 2px;
			transform: translate(-50%, -50%);

			background-color: lighten($background, 50%);
			z-index: -1;
		}
	}

	.story-node {
		display: flex;
		justify-content: space-between;
		align-items: center;

		cursor: pointer;
		place-self: center;
		position: relative;
		flex-direction: column;
		padding: 0.5rem;
		position: relative;

		height: fit-content;
		width: 100%;

		border-radius: 8px;
		transition: all 0.2s;
		background-color: $primary;
		border: 3px solid $background;

		&:before {
			content: '';
			width: 1.2rem;
			height: 1.2rem;

			border-radius: 50%;

			background-color: #fff;
			position: absolute;
			left: -8px;
			bottom: -8px;
		}

		&.active {
			border: 3px solid cyan;
		}

		&:hover {
			background-color: lighten($primary, 10%);
		}
	}

	.add-props {
		display: flex;
		justify-content: center;
		align-items: flex-end;

		width: 100%;

		gap: 0.5rem;
		padding: 0.3rem;

		input {
			width: 7rem;
		}

		fieldset {
			border: none;
		}
	}

	.label-flex {
		display: flex;
		flex-direction: column;
	}

	.story-props {
		display: flex;
		justify-content: space-between;
		align-items: center;

		padding: 0.5rem;
		gap: 0.2rem;
		width: 100%;
		flex-wrap: wrap;
		overflow-y: scroll;

		hr {
			margin: 1rem;
			width: 100%;
			border: none;
			border-top: 2px solid $primary;
		}
	}

	.story-prop,
	.node-prop,
	.local-props {
		/* width: 100%; */
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		gap: 0.5rem;

		input[type='checkbox'] {
			cursor: pointer;
			vertical-align: middle;
		}

		label {
			width: 100%;
			margin-right: auto;
			gap: 0.5rem;
			/* margin: 0.2rem; */
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}

		input {
			margin-left: auto;
		}
	}

	.taro {
		&:before {
			background-color: #bae8e8;
		}
	}

	.arita {
		&:before {
			background-color: #8a00d4;
		}
	}
	.node-name {
		font-size: 14px;

		align-self: flex-start;
		font-weight: bold;
	}

	.node-text {
		font-size: 12px;
	}

	.matsukiTakashi {
		&:before {
			background-color: #f9c46b;
		}
	}

	.matsymuraKeita {
		&:before {
			background-color: #1ac0c6;
		}
	}

	.moriyamaMasato {
		&:before {
			background-color: #e74645;
		}
	}

	.okutaShou {
		&:before {
			background-color: #facd60;
		}
	}

	.UnknonwNumber {
		&:before {
			background-color: #12492f;
		}
	}

	.yanagiMaiko {
		&:before {
			background-color: #f3e549;
		}
	}

	.aritaAi {
		&:before {
			background-color: #d433b7;
		}
	}
</style>
