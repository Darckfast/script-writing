<script lang="ts">
	import { url } from '@roxi/routify'
	import type { Readable } from 'svelte/store'
	import { isDbxAuth } from '../../lib/stores/dbx'
	import ArrowLeft from '../../styles/icons/arrow-left.svelte'
	import Spinner from '../../styles/icons/spinner.svelte'

	export let headerName: string
	export let onCopy: () => void
	export let onSync: () => void
	export let isFetching: Readable<boolean>
	export let id: string
</script>

<header class="flex justify-between items-center w-full gap-2 px-2 pb-4">
	<a href={$url('../../..')} data-test="btn-return" class="btn btn-primary">
		<ArrowLeft /> go back</a
	>
	<h1 data-test="story-name">{headerName}</h1>

	<button
		class="btn btn-xs gap-2 w-auto text-sm overflow-auto overflow-ellipsis"
	>
		{id}</button
	>

	<button
		class="btn btn-primary w-auto"
		data-test="btn-copy-content"
		on:click={onCopy}>> copy</button
	>

	<button
		class="btn btn-primary w-auto"
		disabled={!isDbxAuth()}
		on:click={onSync}
		>{#if $isFetching}
			<Spinner />saving...
		{:else}
			> save
		{/if}</button
	>
</header>
