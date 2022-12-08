import { writable } from 'svelte/store'
import { load, save } from './loadSave'

const stories = writable<Story[]>(load('stories'))

stories.subscribe((value) => save('stories', value))

export { stories }
