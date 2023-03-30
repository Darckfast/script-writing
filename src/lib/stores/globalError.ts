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

	const pushError = (err: Error, { onConfirm = null } = {}) => {
		update((state) => {
			const errorMsg = `${err.name}: ${err.message}`

			if (state.filter((x) => x.message === errorMsg).length) return state

			setTimeout(() => {
				update((s) => {
					s.pop()

					return s
				})
			}, 5000)

			return [
				{
					type: 'error',
					message: `${err.name}: ${err.message}`,
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
