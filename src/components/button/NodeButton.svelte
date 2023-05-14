<script lang="ts">
	import { url } from '@roxi/routify'
	import Trash from '../../styles/icons/trash.svelte'
	import ConfirmButton from './ConfirmButton.svelte'

	export let onRemove: () => void
	export let index: number
	export let id: string
	export let name: string
	export let type: 'story' | 'document'
</script>

<div class="relative">
	<a
		data-test={`a-${type}-node-${index}`}
		href={$url(`./${type}/${id}`)}
		class="gap-2 btn btn-primary relative no-animation"
	>
		{name}
	</a>

	<ConfirmButton
		dataTest={`btn-delete-${type}`}
		on:click={(e) => e.stopImmediatePropagation()}
		on:confirm={onRemove}
		classes="cursor-pointer w-auto h-auto p-1 rounded absolute -left-2 -top-2"
	>
		<Trash />
	</ConfirmButton>
</div>
