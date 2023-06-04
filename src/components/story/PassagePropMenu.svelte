<script lang="ts">
	import { params } from '@roxi/routify'
	import { onMount } from 'svelte'
	import { Node } from 'svelvet'
	import { deleteEntry, load } from '../../lib/loadSave'
	import { localPropsStore } from '../../lib/stores/localProps'
	import Xmark from '../../styles/icons/xmark.svelte'
	import PropInput from './PropInput.svelte'

	onMount(() => {
		const localProps = load<TProp[]>({
			key: `props-${$params.storyId}`,
			defaultValue: []
		})

		if (localProps.length) {
			deleteEntry({ key: `props-${$params.storyId}` })

			$localPropsStore[$params.storyId] = [
				...$localPropsStore[$params.storyId],
				...localProps
			]
		}
	})
</script>

<Node>
	<div
		class="absolute -bottom-40 rounded bg-slate-800 p-2 left-0 flex flex-wrap gap-2 w-60 z-20"
	>
		<button
			data-test="node-prop-menu-close"
			on:click
			class="btn btn-error btn-sm btn-outline w-full"
			><Xmark />
		</button>

		{#if $localPropsStore[$params.storyId].length === 0}
			<p class="text-slate-300">No props found</p>
		{/if}

		{#each $localPropsStore[$params.storyId] as { name, type, value }}
			<PropInput {name} {type} {value} isAddable isNotRemovable on:add />
		{/each}
	</div>
</Node>
