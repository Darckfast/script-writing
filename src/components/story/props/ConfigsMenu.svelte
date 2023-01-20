<script lang="ts">
	import { props } from '../../../lib/nodesv2'
	import {
		config,
		configFetching,
		configSync
	} from '../../../lib/stores/configs'
	import Spinner from '../../../styles/icons/spinner.svelte'
	import PropInput from '../PropInput.svelte'

	export let storyId: string

	const prop = {
		name: '',
		value: null
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

<div class="flex items-center justify-center w-full">
	<button class="btn btn-primary w-auto " on:click={() => configSync()}
		>{#if $configFetching}
			<Spinner />saving...
		{:else}
			> save
		{/if}</button
	>
</div>

<form
	on:submit|preventDefault={addProp}
	class="mt-2 flex justify-center items-center flex-wrap ring-1 ring-primary p-2 rounded "
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
