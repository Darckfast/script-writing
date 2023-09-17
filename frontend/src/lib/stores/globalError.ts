import { writable } from 'svelte/store'
interface ErrorStore {
  type: string
  message: string
  options?: OnErrorOptions[]
}

const { set, subscribe, update } = writable<
  ErrorStore | undefined
>()

interface OnErrorOptions {
  name: string
  func: () => any
}

const pushError = (
  err: Error | string,
  options?: OnErrorOptions[]
) => {
  console.error(err)

  update((state) => {
    const message =
      typeof err === 'string'
        ? err
        : `${err.name}: ${err.message}`

    return {
      type: 'error',
      message,
      options
    }
  })
}

const clearAll = () => set(undefined)

export const globalError = {
  set,
  subscribe,
  update,
  clearAll,
  pushError
}
