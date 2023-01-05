<script lang="ts">
	import { params } from '@roxi/routify'
	import { load, saveV2 } from '../../../lib/loadSave'
	import { props } from '../../../lib/nodesv2'
	import { dbxAuth } from '../../../lib/stores/dbx'
	import PropInput from '../PropInput.svelte'

	export let node: StoryNode

	$: propTypes = [
		{
			type: 'text',
			enabled: true
		},
		{
			type: 'boolean',
			enabled: true
		},
		{
			type: 'number',
			enabled: true
		},
		{
			type: 'file',
			enabled: !!$dbxAuth.getAccessToken()
		}
	]

	const prop = {
		name: '',
		value: null,
		type: 'text'
	}

	let localProps = load<Props[]>(`props-${$params.storyId}`)

	$: if (localProps.length) {
		saveV2({ key: `props-${$params.storyId}`, value: localProps })
	}

	const createProp = () => {
		if (isPropNotEnabled(prop.type)) return

		localProps = [...localProps, { ...prop }]

		prop.name = ''
		prop.value = null
	}

	const isPropNotEnabled = (pType) =>
		!propTypes.find(({ type, enabled }) => type === pType && enabled)

	const remove = (index: string | number, type: 'local' | 'node'): void => {
		if (type === 'local') {
			localProps.splice(index as number, 1)
			localProps = [...localProps]

			return
		}

		node[index] = null
		delete node[index]

		node = { ...node }
	}
</script>

<div
	class="flex justify-between items-center p-1 gap-2 flex-wrap overflow-y-scroll custom-scroll"
>
	{#each props(node) as { name }}
		<PropInput
			{name}
			type={localProps?.find((p) => p.name === name)?.type ?? 'text'}
			bind:value={node[name]}
			on:remove={() => remove(name, 'node')}
		/>
	{/each}

	<hr class="m-4 w-full border-t-2 border-primary" />

	{#each localProps as { name, value, type }, index}
		<PropInput
			{name}
			{type}
			bind:value
			on:remove={() => remove(index, 'local')}
			on:add={() =>
				(node = {
					...node,
					[name]: value
				})}
			isAddable
		/>
	{/each}
</div>

<form
	on:submit|preventDefault
	class="w-auto h-auto mt-2 flex justify-center items-center flex-wrap ring-1 ring-primary p-2 rounded "
>
	<div class="w-full flex justify-between items-center">
		<label class="p-1 w-1/2 flex items-center">
			<input
				placeholder="name"
				class="input input-primary input-sm w-full"
				bind:value={prop.name}
			/>
		</label>

		<label class="p-1 w-1/2 flex items-center">
			{#if prop.type === 'boolean'}
				<input
					type="checkbox"
					bind:checked={prop.value}
					class="toggle toggle-primary"
				/>
			{:else if prop.type === 'number'}
				<input
					placeholder="0"
					type="number"
					bind:value={prop.value}
					class="input input-primary input-sm w-full"
				/>
			{:else if prop.type === 'file'}
				<span>File can be selected after</span>
			{:else}
				<input
					placeholder="value"
					bind:value={prop.value}
					class="input input-primary input-sm w-full"
				/>
			{/if}
		</label>

		<button
			type="submit"
			class="btn btn-primary"
			disabled={isPropNotEnabled(prop.type)}
			on:click={createProp}>add</button
		>
	</div>

	<div class="w-full h-auto flex flex-wrap gap-4">
		{#each propTypes as { enabled, type }}
			<label class="flex items-center gap-2">
				<input
					bind:group={prop.type}
					disabled={!enabled}
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
