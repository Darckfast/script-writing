<script lang="ts">
	import { load, save } from '../../../lib/loadSave'
	import { props } from '../../../lib/nodesv2'
	import {
		config,
		configFetching,
		configSync
	} from '../../../lib/stores/configs'
	import { isDbxAuth } from '../../../lib/stores/dbx'
	import { stories } from '../../../lib/stores/stories'
	import { findStory } from '../../../lib/stores/story'
	import Spinner from '../../../styles/icons/spinner.svelte'
	import PropInput from '../PropInput.svelte'

	export let storyId: string

	const prop = {
		name: '',
		value: null
	}

	const inferProps = () => {
		let localProps = load<Props[]>({ key: `props-${storyId}` })

		const story = $stories.find(findStory(storyId))

		story.passages.forEach((passage) =>
			props(passage).forEach((pProp) => {
				if (!localProps.some((sProp) => sProp.name === pProp.name)) {
					localProps.push({ ...pProp, value: null })
				}
			})
		)

		save({ key: `props-${storyId}`, value: localProps })
	}

	const remove = (prop: string) => {
		delete $config[storyId][prop]

		$config = { ...$config }

		configSync()
	}

	const addProp = () => {
		$config[storyId] = {
			...$config[storyId],
			[prop.name]: { value: prop.value, enabled: true }
		}

		configSync()
	}
</script>

<div class="flex flex-wrap gap-2 w-full">
	{#each props($config[storyId]) as { name }}
		<PropInput
			{name}
			bind:value={$config[storyId][name].value}
			on:remove={() => remove(name)}
		>
			<input
				type="checkbox"
				bind:checked={$config[storyId][name].enabled}
				class="toggle toggle-primary"
			/>
		</PropInput>
	{/each}
</div>

<div class="flex items-center justify-center w-full gap-4">
	<button
		class="btn btn-primary w-auto"
		disabled={!isDbxAuth()}
		on:click={() => configSync()}
		>{#if $configFetching}
			<Spinner />saving...
		{:else}
			> save
		{/if}</button
	>

	<button class="btn btn-primary" on:click={inferProps}>+ infer props</button>
</div>

<form
	on:submit|preventDefault={addProp}
	class="mt-2 flex justify-center items-center flex-wrap ring-1 ring-primary p-2 rounded"
>
	<div class="w-full flex justify-between items-center">
		<label class="p-1 w-1/2">
			<input
				type="text"
				placeholder="name"
				class="input input-primary input-sm w-full"
				bind:value={prop.name}
			/>
		</label>

		<button type="submit" class="btn btn-primary">add</button>
	</div>
</form>
