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

	const pushError = (err: Error) =>
		update((state) => [
			{
				type: 'error',
				message: `${err.name}: ${err.message}`
			},
			...state
		])

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
