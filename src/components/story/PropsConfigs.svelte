<script lang="ts">
	import { params } from '@roxi/routify'
	import { load, save } from '../../lib/loadSave'
	import { props } from '../../lib/nodes.utils'
	import { config, configFetching, configSync } from '../../lib/stores/configs'
	import { isDbxAuth } from '../../lib/stores/dbx'
	import { localPropsStore } from '../../lib/stores/localProps'
	import { stories } from '../../lib/stores/stories'
	import { findStory } from '../../lib/stores/story'
	import Spinner from '../../styles/icons/spinner.svelte'
	import PropInput from './PropInput.svelte'

	const key = `props-menu-config-position-${$params.storyId}`

	const prop = {
		name: '',
		value: null
	}

	const inferProps = () => {
		const story = $stories.find(findStory($params.storyId))

		story.passages.forEach((passage) =>
			props(passage).forEach((pProp) => {
				if (
					!$localPropsStore[$params.storyId].some(
						(sProp) => sProp.name === pProp.name
					)
				) {
					$localPropsStore[$params.storyId].push({ ...pProp, value: null })
				}
			})
		)

		$localPropsStore[$params.storyId] = [...$localPropsStore[$params.storyId]]
	}

	const remove = (prop: string) => {
		delete $config[$params.storyId][prop]

		$config = { ...$config }

		configSync()
	}

	const addProp = () => {
		$config[$params.storyId] = {
			...$config[$params.storyId],
			[prop.name]: { value: prop.value, enabled: true }
		}

		configSync()
	}

	let position = load<TPosition>({
		key,
		defaultValue: { x: 600, y: 50 }
	})

	$: {
		save({ key, value: position })
	}
</script>

<div
	class="flex rounded shadow-md justify-between items-center p-1 gap-2 flex-wrap overflow-y-scroll custom-scroll w-full bg-slate-900"
>
	{#each props($config[$params.storyId]) as { name }}
		<PropInput
			{name}
			bind:value={$config[$params.storyId][name].value}
			on:remove={() => remove(name)}
		>
			<input
				type="checkbox"
				bind:checked={$config[$params.storyId][name].enabled}
				class="toggle toggle-primary"
			/>
		</PropInput>
	{/each}

	<div>
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
		class="mt-2 w-full flex justify-center items-center flex-wrap ring-1 ring-primary p-2 rounded"
	>
		<label class="p-1 w-1/2">
			<input
				type="text"
				placeholder="name"
				class="input input-primary input-sm w-full"
				bind:value={prop.name}
			/>
		</label>

		<button type="submit" class="btn btn-primary">add</button>
	</form>
</div>
