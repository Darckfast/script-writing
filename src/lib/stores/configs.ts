import { writable } from 'svelte/store'
import { load, save } from '../loadSave'

export const config = writable<Config>(
	load({ key: 'configs', defaultValue: {} })
)

export const getConfig = (configName: string) =>
	load({ key: 'configs', defaultValue: {} })[configName]

config.subscribe((value) => save({ key: 'configs', value }))
