<script lang="ts">
	import { appWindow } from '@tauri-apps/api/window'
	import Close from '../../styles/icons/close.svelte'
	import Maximize from '../../styles/icons/maximize.svelte'
	import Minimize from '../../styles/icons/minimize.svelte'
</script>

<div
	data-tauri-drag-region
	class="h-7 bg-transparent flex justify-end fixed top-0 left-0 right-0"
>
	<span class="ml-2 mt-2 text-xs text-slate-200 mr-auto"
		>script-writing ver. {import.meta.env.VITE_VERSION}</span
	>

	<button
		on:click={() => void appWindow.minimize()}
		class="inline-flex justify-center items-center h-7 w-7 cursor-pointer"
		id="titlebar-minimize"
	>
		<Minimize />
	</button>
	<button
		on:click={() => void appWindow.toggleMaximize()}
		class="inline-flex justify-center items-center h-7 w-7 cursor-pointer"
		id="titlebar-maximize"
	>
		<Maximize />
	</button>
	<button
		on:click={() => void appWindow.close()}
		class="inline-flex justify-center items-center h-7 w-7 cursor-pointer"
		id="titlebar-close"
	>
		<Close />
	</button>
</div>
