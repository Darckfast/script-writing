<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	export let classes = ''

	const confirm = () => dispatch('confirm')

	let state = false
	let text = 'waiting'
	let timeout: NodeJS.Timeout

	const checkConfirmation = () => {
		if (state) {
			text = 'waiting'
			state = false

			confirm()

			clearInterval(timeout)
		} else {
			text = 'confirm'
			state = true

			timeout = setTimeout(() => {
				text = 'waiting'
				state = false

				clearTimeout(timeout)
			}, 3000)
		}
	}
</script>

<button
	class={[classes, text].join(' ')}
	on:click={checkConfirmation}
	tabindex="-1"
>
	<slot />
</button>
