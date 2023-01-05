import { writable } from 'svelte/store'
import { loadV2 } from '../loadSave'
import { stories } from './stories'

export const isFetching = writable(false)

const getStory = (id: string) => {
	const { set, subscribe, update } = writable<Story>({
		passages: [{ cleanText: '' }]
	} as Story)

	isFetching.set(true)

	loadV2<Story[]>({ key: 'stories', defaultValue: {} })
		.then((res) => set(res.find(({ ifid }) => ifid === id)))
		.finally(() => isFetching.set(false))

	subscribe((story) => {
		if (!story.storyName) return

		stories.update((values: Story[]) =>
			values.map((value) => (value.ifid === story?.ifid ? story : value))
		)
	})

	return {
		set,
		subscribe,
		update
	}
}

export { getStory }
