<script lang="ts">
	import type { CustomWritable } from 'svelvet'

	export let parameterStore: CustomWritable<any>
</script>

<textarea
	class="text-center w-full min-h-8 h-full outline-none p-2 bg-transparent"
	data-test={$$props['data-test']}
	bind:value={$parameterStore}
/>
