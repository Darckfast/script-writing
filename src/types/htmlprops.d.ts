declare namespace svelte.JSX {
	interface HTMLProps<T> {
		onlongpress?: (event: CustomEvent) => void
		onoutclick?: (event: CustomEvent) => void
	}
}
