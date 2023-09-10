import { writable } from 'svelte/store'
interface ErrorStore {
  type: string
  message: string
  options?: OnErrorOptions[]
}

const { set, subscribe, update } = writable<ErrorStore[]>(
  []
)

const clearCurrent = () => {
  update((state) => {
    if (state.length === 1) {
      return []
    }

    state.shift()

    return state
  })
}

interface OnErrorOptions {
  name: string
  func: () => any
}

const pushError = (
  err: Error | string,
  options?: OnErrorOptions[]
) => {
  update((state) => {
    // TODO: create a error log file
    console.error(err)

    const message =
      typeof err === 'string'
        ? err
        : `${err.name}: ${err.message}`

    if (state.some((x) => x.message === message))
      return state

    return [
      {
        type: 'error',
        message,
        options
      },
      ...state
    ]
  })
}

const clearAll = () => set([])

export const globalError = {
  set,
  subscribe,
  update,
  clearCurrent,
  clearAll,
  pushError
}
