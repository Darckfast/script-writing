<script lang="ts">
	import PlusSolid from '../../styles/icons/plus-solid.svelte'

	export let type: 'default' | 'prop' = 'default'
</script>

<div class={$$props.class}>
	{#if type === 'default'}
		<button
			data-test={$$props['data-test']}
			on:click
			class="w-full rounded bg-white add-button p-1 transition-all hover:scale-110"
		>
			<PlusSolid />
		</button>
	{:else}
		<button
			data-test={$$props['data-test']}
			on:click
			class="w-full rounded border-2 border-dashed add-prop-button p-1 transition-all hover:scale-110"
		>
			<PlusSolid />
		</button>
	{/if}
</div>

<style>
	.add-button {
		background: linear-gradient(
			45deg,
			rgba(255, 25, 254, 1) 0%,
			rgba(24, 238, 255, 1) 100%
		);
	}
</style>
