<script lang="ts">
	export let onConfirm = () => {}
	export let classes = ''
	export let icon = null

	let state = false
	let text = 'normal'
	let timeout

	const confirm = () => {
		if (state) {
			text = 'normal'
			state = false

			onConfirm()

			clearInterval(timeout)
		} else {
			text = 'confirm'
			state = true

			timeout = setTimeout(() => {
				text = 'normal'
				state = false

				clearTimeout(timeout)
			}, 3000)
		}
	}
</script>

<button class={[classes, text].join(' ')} on:click={confirm}>
	<svelte:component this={icon} class={text} />
</button>

<style lang="scss">
	@import '../styles/variables.scss';
	@import '../styles/components/button.scss';
</style>
