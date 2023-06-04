<script lang="ts">
	import type { CustomWritable } from 'svelvet'

	export let isAddable = false
	export let propName = ''
	export let parameterStore: CustomWritable<any>

</script>

<input
	data-test={`input-${isAddable ? 'local' : 'node'}-prop-${propName}`}
	type="number"
	step="any"
	bind:value={$parameterStore}
	class="input w-full input-primary input-sm"
/>
