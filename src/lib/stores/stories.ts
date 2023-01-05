import { writable } from 'svelte/store'
import { loadV2, saveV2 } from '../loadSave'

const createStories = () => {
	const { set, subscribe, update } = writable<Story[]>([])

	const updateStoryWithPassage = ({ storyId, resolvedValue, key }) => {
		update((currStories) =>
			currStories.map((currStory) => {
				if (currStory.ifid === storyId) {
					currStory.passages = currStory.passages.map((passage) => {
						if (passage.pid === resolvedValue.pid) {
							passage[key] = resolvedValue
						}

						return passage
					})
				}

				return currStory
			})
		)
	}

	const iterateOverPassages = ({ passage, storyId }) => {
		for (const key in passage) {
			if (Object.prototype.hasOwnProperty.call(passage, key)) {
				const passageProp = passage[key]

				if (passageProp instanceof Promise) {
					passageProp.then((resolvedValue) =>
						updateStoryWithPassage({
							storyId,
							resolvedValue,
							key
						})
					)
				}
			}
		}
	}

	const resolvePromises = (stories: Story[]) => {
		for (const story of stories) {
			story.passages.forEach((passage) =>
				iterateOverPassages({ passage, storyId: story.ifid })
			)
		}
	}

	loadV2<Story[]>({ key: 'stories' })
		.then((res) => set(res))
		.then(() => {
			subscribe((value) => {
				if (!value.length) return

				resolvePromises(value)

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
