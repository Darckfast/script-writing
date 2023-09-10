<script lang="ts">
	import type { CustomWritable } from 'svelvet'

	export let parameterStore: CustomWritable<any>
</script>

<input
	data-test={$$props['data-test']}
	type="checkbox"
	bind:checked={$parameterStore}
	class="toggle toggle-primary ml-auto"
/>
