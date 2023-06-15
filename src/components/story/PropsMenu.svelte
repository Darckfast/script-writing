<script lang="ts">
	import PropsConfigs from './PropsConfigs.svelte'
	import PropsList from './PropsList.svelte'

	let tab = 'list'
</script>

<div class="h-full flex flex-wrap">
	<div class="tabs place-self-start">
		<button
			class="tab tab-lifted"
			class:tab-active={tab === 'list'}
			on:click={() => (tab = 'list')}>Props</button
		>
		<button
			class="tab tab-lifted"
			class:tab-active={tab === 'config'}
			on:click={() => (tab = 'config')}>Configs</button
		>
	</div>

	<div class="flex place-self-end">
		{#if tab === 'list'}
			<PropsList />
		{:else}
			<PropsConfigs />
		{/if}
	</div>
</div>
