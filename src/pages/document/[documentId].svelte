<script lang="ts">
	import { url } from '@roxi/routify'
	import { JSONEditor, Mode } from 'svelte-jsoneditor'
	import { isDbxAuth } from '../../lib/stores/dbx'
	import {
		documents,
		documentsFetching,
		documentsSync
	} from '../../lib/stores/documents'
	import ArrowLeft from '../../styles/icons/arrow-left.svelte'
	import Spinner from '../../styles/icons/spinner.svelte'

	export let documentId: string

	$: document = $documents.find(({ id }) => id === documentId)
</script>

<div class="w-full h-full">
	<header class="flex justify-between items-center w-full gap-2 px-2 pb-4">
		<a href={$url('../../..')} data-test="btn-return" class="btn btn-primary">
			<ArrowLeft /> go back</a
		>
		<h1 data-test="story-name">{document?.name}</h1>

		<button
			class="btn btn-primary w-auto"
			disabled={!isDbxAuth()}
			on:click={() => documentsSync()}
			>{#if $documentsFetching}
				<Spinner />saving...
			{:else}
				> save
			{/if}</button
		>
	</header>

	{#if document}
		<div class="json-editor jse-theme-dark w-full" style="height: 90%;">
			<JSONEditor mode={Mode.text} bind:content={document.content} />
		</div>
	{/if}
</div>

<style>
	@import 'svelte-jsoneditor/themes/jse-theme-dark.css';

	.json-editor {
		--jse-theme-color: #383e42;
	}
</style>
