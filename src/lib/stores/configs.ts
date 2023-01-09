import { writable } from 'svelte/store'
import { load, save } from '../loadSave'

export const config = writable<Config>(
	load({ key: 'configs', defaultValue: {} })
)

config.subscribe((value) => save({ key: 'configs', value }))
