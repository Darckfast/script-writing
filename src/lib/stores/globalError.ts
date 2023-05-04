import { writable } from 'svelte/store'

const createGlobalError = () => {
	const { set, subscribe, update } = writable([])

	const clearCurrent = () => {
		update((state) => {
			if (state.length === 1) {
				return []
			}

			state.shift()

			return state
		})
	}

	const pushError = (err: Error | string, { onConfirm = null } = {}) => {
		update((state) => {
			// TODO: create a error log file
			console.error(err)

			const message =
				typeof err === 'string' ? err : `${err.name}: ${err.message}`

			if (state.some((x) => x.message === message)) return state

			setTimeout(() => {
				update((s) => {
					s.pop()

					return s
				})
			}, 5000)

			return [
				{
					type: 'error',
					message,
					onConfirm
				},
				...state
			]
		})
	}

	const clearAll = () => set([])

	return {
		set,
		subscribe,
		update,
		clearCurrent,
		clearAll,
		pushError
	}
}

export const globalError = createGlobalError()
