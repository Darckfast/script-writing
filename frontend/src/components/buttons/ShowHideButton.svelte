<script lang="ts">
	import EyeSlashSolid from '../../styles/icons/eye-slash-solid.svelte'
	import EyeSolid from '../../styles/icons/eye-solid.svelte'

	export let show = true
</script>

<button
	on:click={() => (show = !show)}
	class={`transition-all hover:scale-105 ${$$props.class}`}
>
	{#if show}
		<EyeSlashSolid />
	{:else}
		<EyeSolid />
	{/if}
</button>
