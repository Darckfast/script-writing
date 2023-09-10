<script lang="ts">
	import type { CustomWritable } from 'svelvet'

	export let parameterStore: CustomWritable<any>
</script>

<input
	data-test={$$props['data-test']}
	type="number"
	step="any"
	bind:value={$parameterStore}
	class="input w-full input-primary input-sm"
/>
