import { writable } from 'svelte/store'
import { loadV2, saveV2 } from '../loadSave'

const createStories = () => {
	const { set, subscribe, update } = writable<Story[]>([])

	const checkForPromises = (value: any, storyId?: string) => {
		if (value instanceof Array) {
			value.map((subElem) => checkForPromises(subElem, subElem.ifid))
		}

		for (const key in value) {
			if (Object.prototype.hasOwnProperty.call(value, key)) {
				const element = value[key]

				if (element instanceof Promise) {
					element.then((res) => {
						update((currStories) =>
							currStories.map((story) => {
								if (story.ifid === storyId) {
									story.passages = story.passages.map((passage) => {
										if (passage.pid === value.pid) {
											passage[key] = res
										}

										return passage
									})
								}

								return story
							})
						)
					})
				}

				if (element instanceof Array) {
					element.map((subElem) => checkForPromises(subElem, storyId))
				}
			}
		}
	}

	loadV2<Story[]>({ key: 'stories' })
		.then((res) => set(res))
		.then(() => {
			subscribe((value) => {
				if (!value.length) return

				checkForPromises(value)

				saveV2({ key: 'stories', value })
			})
		})

	return {
		set,
		subscribe,
		update
	}
}
export const stories = createStories()
