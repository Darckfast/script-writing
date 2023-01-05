import { writable } from 'svelte/store'
import { load, saveV2 } from '../loadSave'

export const config = writable<Config>(load('configs', {}))

config.subscribe((value) => saveV2({ key: 'configs', value }))
