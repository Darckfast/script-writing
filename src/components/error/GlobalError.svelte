<script lang="ts">
	import { globalError } from '../../lib/stores/globalError'
</script>

{#if $globalError.length}
	<div class="absolute z-10 flex alert alert-error shadow-lg mt-8">
		<span
			><svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current flex-shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>{$globalError[0].message}</span
		>
		<div class="flex-none">
			{#if $globalError.at(0).onConfirm}
				<button
					on:click={$globalError.at(0).onConfirm}
					class="btn btn-sm btn-ghost">procced</button
				>
				<button on:click={globalError.clearAll} class="btn btn-sm btn-ghost"
					>cancel</button
				>
			{:else}
				<button on:click={globalError.clearCurrent} class="btn btn-sm btn-ghost"
					>Clear</button
				>
				<button on:click={globalError.clearAll} class="btn btn-sm btn-ghost"
					>Clear All</button
				>
			{/if}
		</div>
	</div>
{/if}
