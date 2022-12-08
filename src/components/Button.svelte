<script lang="ts">
	export let onClick: () => void
</script>

<button
	class="bg-indigo-700  px-4 py-2 rounded transition-all hover:bg-indigo-600"
	on:click={() => onClick()}><slot /></button
>
