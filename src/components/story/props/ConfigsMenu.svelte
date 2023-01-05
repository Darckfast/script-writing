<script lang="ts">
	import { props } from '../../../lib/nodesv2'
	import { config } from '../../../lib/stores/configs'
	import PropInput from '../PropInput.svelte'

	export let storyId: string

	const prop = {
		name: '',
		value: null
	}

	const remove = (prop: string) => {
		delete $config[prop]

		$config = { ...$config }
	}
</script>

<div class="flex flex-wrap gap-2 w-full">
	{#each props($config[storyId]) as { name, value }}
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

<form
	on:submit|preventDefault={() =>
		($config[storyId] = {
			...$config[storyId],
			[prop.name]: { value: prop.value, enabled: true }
		})}
	class="mt-2 flex justify-center items-center flex-wrap ring-1 ring-primary p-2 rounded "
>
	<div class="w-full flex justify-between items-center">
		<label class="p-1 w-1/2">
			<input
				placeholder="name"
				class="input input-primary input-sm w-full"
				bind:value={prop.name}
			/>
		</label>

		<label class="p-1 w-1/2">
			<input
				placeholder="value"
				bind:value={prop.value}
				class="input input-primary input-sm w-full"
			/>
		</label>

		<button type="submit" class="btn btn-primary">add</button>
	</div>
</form>
