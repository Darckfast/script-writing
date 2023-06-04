<script lang="ts">
	import { params } from '@roxi/routify'
	import { createEventDispatcher, onMount } from 'svelte'
	import { get } from 'svelte/store'
	import { Anchor, Node, generateInput, generateOutput } from 'svelvet'
	import { v4 as uuidv4 } from 'uuid'
	import { genColor } from '../../lib/colorGen'
	import { getFromPathOrPromise } from '../../lib/images/imagePromise'
	import { getConnections, isRoot, props } from '../../lib/nodes.utils'
	import { config } from '../../lib/stores/configs'
	import { stories } from '../../lib/stores/stories'
	import LinkSlashSolid from '../../styles/icons/link-slash-solid.svelte'
	import Spinner from '../../styles/icons/spinner.svelte'
	import Trash from '../../styles/icons/trash.svelte'
	import AddButton from '../button/AddButton.svelte'
	import ConfirmButton from '../button/ConfirmButton.svelte'
	import TextareaInput from '../input/TextareaInput.svelte'
	import PassagePropMenu from './PassagePropMenu.svelte'

	const dispatch = createEventDispatcher()

	export let node: StoryNode
	export let isSelected = false
	export let fetchOnLoad = false

	let container: HTMLDivElement
	let canFetch = false
	let showPropsAvailable = false
	let imagePrm = null

	const inputs = generateInput(node)
	const output = generateOutput(inputs, (input) => input)
	const linkInputs = generateInput({})
	const outputLink = generateOutput(inputs, (input) => ({ pid: input.pid }))

	$: node = $output
	$: anchors = props(node)
	$: configs = $config[$params.storyId]
	$: linkConnections = getConnections(node)

	$: if (
		((node.image && canFetch) || (node.image && fetchOnLoad)) &&
		configs?.baseDir
	) {
		node.image = getFromPathOrPromise(node.image, configs.baseDir.value)

		imagePrm = node.image.done
			? Promise.resolve(node.image.resolvedLink)
			: node.image.promise
	}

	onMount(() => {
		let observer = new IntersectionObserver(
			([entry], self) => {
				if (entry.isIntersecting && node.image) {
					canFetch = true

					self.unobserve(entry.target)
				}
			},
			{
				threshold: 0
			}
		)

		observer.observe(container)

		return () => observer.unobserve(container)
	})

	const remove = () => dispatch('remove', { pid: $output.pid })
	const addNode = () => {
		const { latestPid } = $stories[$params.storyIndex]

		const newNode = {
			pid: latestPid ? latestPid + 1 : uuidv4(),
			name: 0,
			cleanText: '',
			links: [],
			position: {
				x: $output.position.x,
				y: $output.position.y + 300
			}
		}

		const links = getOrCreateEmptyLink()

		links.update((state) => {
			return [...state, { pid: newNode.pid }]
		})

		dispatch('addNode', newNode)
	}

	const getOrCreateEmptyLink = () => {
		if ($inputs.links === undefined) {
			const newInputLink = generateInput({ value: [] })
			$inputs.links = get(newInputLink).value
		}

		return $inputs.links
	}

	const removeProp = ({ detail }) => {
		const { inputKey } = detail.anchor

		if (!inputKey) return

		inputs.update((state) => {
			delete state[inputKey]

			return state
		})
	}

	const addProp = ({ detail: { name, value } }) => {
		if (name in $inputs) {
			console.log('key already exists', $inputs, name)
			return
		}

		const propInput = generateInput({})

		propInput.set(value)

		inputs.update((state) => {
			state[name] = propInput

			return state
		})
	}

	const onLink = ({ detail: { anchor }, type }: TOnLink) => {
		const links = getOrCreateEmptyLink()

		if (type === 'connection') {
			links.update((state) => {
				const pidLink = get<TLink>(get<TLinkCustom>(anchor.store).link)

				if (state.find((link) => link.pid === pidLink.pid)) return state

				return [...state, pidLink]
			})

			return
		}

		if (type === 'disconnection') {
			links.update((state) => {
				const { pid } = get<TLink>(get<TLinkCustom>(anchor.store).link)
				return state.filter((link) => link.pid !== pid)
			})
		}
	}

	const removeAndDestroy = (destroy) => {
		if (isRoot(node)) return

		remove()
		destroy()
	}
</script>

{#if node}
	<div bind:this={container}>
		<Node
			id={`node-${$output.pid}`}
			bind:position={node.position}
			let:destroy
			let:disconnect
		>
			<div
				class:!border-cyan-400={isSelected}
				class="btn btn-primary no-animation flex-col p-2 relative h-fit w-80 border-transparent border-2 shadow"
			>
				<TextareaInput
					data-test={`node-input-${node.pid}`}
					parameterStore={$inputs.cleanText}
				/>

				{#if node.image}
					{#await imagePrm}
						<div class="flex h-96">
							<Spinner />
						</div>
					{:then src}
						<img
							{src}
							alt="message"
							style="width: 20rem;"
							loading="lazy"
							data-lazy-load
						/>
					{:catch}
						<img
							src="/unicorn.svg"
							alt="error"
							style="width: 100%;"
							loading="lazy"
							data-lazy-load
						/>
					{/await}
				{/if}
				<span
					class="w-5 h-5 bg-white absolute rounded-full -left-2 -bottom-2"
					style={`background-color: ${genColor($output.sentBy)};`}
				/>
				<AddButton
					data-test={`node-add-${node.pid}`}
					class="absolute -right-16 bottom-0 w-8"
					on:click={addNode}
				/>
				<AddButton
					data-test={`node-prop-menu-${node.pid}`}
					type="prop"
					class="absolute -bottom-16 right-0 w-8"
					on:click={() => (showPropsAvailable = !showPropsAvailable)}
				/>
			</div>

			{#if !isRoot(node)}
				<div class="absolute flex -top-5 right-1/2 z-0">
					<Anchor
						id={`link-out-${$output.pid}`}
						output
						direction="north"
						outputStore={outputLink}
					/>
				</div>

				<ConfirmButton
					on:click={(e) => e.stopPropagation()}
					on:confirm={() => removeAndDestroy(destroy)}
					classes="cursor-pointer absolute -top-2 -right-2 w-auto h-auto p-1 rounded"
				>
					<Trash />
				</ConfirmButton>
			{/if}

			<div
				class="absolute flex justify-center items-center -bottom-8 right-1/2 gap-2 z-0"
			>
				<button
					class="btn btn-square btn-outline btn-accent btn-xs"
					on:click={() => linkConnections.forEach(disconnect)}
				>
					<LinkSlashSolid class="w-4" />
				</button>
				<Anchor
					id={`link-${$output.pid}`}
					input
					inputsStore={linkInputs}
					direction="south"
					nodeConnect
					multiple
					bind:connections={linkConnections}
					on:connection={onLink}
					on:disconnection={onLink}
					key="link"
				/>
			</div>

			<div class="flex flex-col absolute -left-5 top-0 gap-2 z-0">
				{#each anchors as { name: key } (key)}
					<Anchor
						id={key}
						input
						inputsStore={inputs}
						{key}
						on:disconnection={removeProp}
					/>
				{/each}
			</div>

			{#if showPropsAvailable}
				<PassagePropMenu
					on:click={() => (showPropsAvailable = !showPropsAvailable)}
					on:add={addProp}
				/>
			{/if}
		</Node>
	</div>
{/if}
