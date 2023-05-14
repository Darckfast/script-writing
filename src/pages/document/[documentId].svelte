<script lang="ts">
	import { JSONEditor, Mode } from 'svelte-jsoneditor'
	import Header from '../../components/header/Header.svelte'
	import { copy } from '../../lib/copy'
	import {
		documents,
		documentsFetching,
		documentsSync
	} from '../../lib/stores/documents'

	export let documentId: string

	$: document = $documents.find(({ id }) => id === documentId)
</script>

<div class="w-full h-full">
	<Header
		headerName={document?.name}
		onSync={documentsSync}
		onCopy={() => copy(JSON.parse(document?.content.text ?? '{}'))}
		isFetching={documentsFetching}
		id={document?.id}
	/>

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
