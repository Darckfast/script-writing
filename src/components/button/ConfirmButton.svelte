<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	export let classes = ''
	export let label = ''

	const confirm = () => dispatch('confirm')

	let state = false
	let text = 'btn-error'
	let timeout: NodeJS.Timeout

	const checkConfirmation = () => {
		if (state) {
			text = 'btn-error'
			state = false

			confirm()

			clearInterval(timeout)
		} else {
			text = 'btn-warning'
			state = true

			timeout = setTimeout(() => {
				text = 'btn-error'
				state = false

				clearTimeout(timeout)
			}, 3000)
		}
	}
</script>

<button
	class={['transition-all', classes, text].join(' ')}
	on:click={checkConfirmation}
	tabindex="-1"
>
	{label}
	<slot />
</button>
