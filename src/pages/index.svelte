<script lang="ts">
	import { url } from '@roxi/routify'
	import { v4 as uuidv4 } from 'uuid'
	import CircleXmark from '../assets/icons/circle-xmark.svelte'
	import ConfirmButton from '../components/ConfirmButton.svelte'
	import InputField from '../components/InputField.svelte'

	import { stories } from '../lib/stories'

	let storyName = ''

	const add = () => {
		if (storyName !== '') {
			stories.update((prev) => [
				...prev,
				{
					ifid: uuidv4(),
					passages: [],
					name: storyName
				}
			])
		}

		storyName = ''
	}

	const remove = (index) => {
		stories.update((prev) => {
			prev.splice(index, 1)

			return [...prev]
		})
	}

	const importStory = async () => {
		const storyString = await navigator.clipboard.readText()

		const story = JSON.parse(storyString)

		stories.update((prev) => [...prev, story])
	}
</script>

<div class="display-container">
	{#each $stories as story, index}
		<div class="stories-container">
			<span>{story.name}</span>
			<!-- svelte-ignore a11y-missing-content -->
			<a href={$url(`./story/${story.ifid}`)} />

			<ConfirmButton
				on:click={(e) => e.stopPropagation()}
				classes="floating-remove-button"
				onConfirm={() => remove(index)}
				icon={CircleXmark}
			/>
		</div>
	{/each}
</div>

<form on:submit|preventDefault class="input-container">
	<InputField bind:value={storyName} />
	<div class="horizontal-container">
		<button on:click={add}>add</button>
		<button on:click={importStory}>import</button>
	</div>
</form>

<style lang="scss">
	@import '../styles/pages/home.scss';
</style>
