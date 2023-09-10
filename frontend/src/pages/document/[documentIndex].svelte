<script lang="ts">
	import { JSONEditor, Mode } from 'svelte-jsoneditor'
	import Header from '../../components/headers/Header.svelte'
	import { copy } from '../../lib/functions/copy/copy'
	import {
		documents,
		documentsFetching,
		documentsSync
	} from '../../lib/stores/documents'

	export let documentId: string
	export let documentIndex: number

	$: document = $documents[documentIndex]
</script>

<div class="w-full h-full">
	<Header
		headerName={document?.name}
		onSync={documentsSync}
		onCopy={() => copy(JSON.parse(document?.content.text ?? '{}'))}
		isFetching={documentsFetching}
		id={documentId}
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
		--jse-theme-color: hsl(var(--p));
		--jse-theme-color-highlight: hsl(var(--p));
		--jse-background-color: hsl(var(--b3));
		--jse-text-color: hsl(var(--pc));
		--jse-text-readonly: hsl(var(--pc));
		--jse-text-color-inverse: hsl(var(--pc));
		--jse-error-color: hsl(var(--er));
		--jse-warning-color: hsl(var(--wa));

		--jse-panel-background: hsl(var(--b1));
		--jse-panel-color: var(--pc);

		--jse-key-color: hsl(var(--su));
		--jse-value-color: hsl(var(--pc));
		--jse-value-color-number: hsl(var(--er));
		--jse-value-color-boolean: #fhsl(var(--wa));
		--jse-value-color-null: hsl(var(--in));
		--jse-value-color-string: hsl(var(--su));
		--jse-value-color-url: hsl(var(--su));
		--jse-delimiter-color: hsl(var(--pc));
	}
</style>
