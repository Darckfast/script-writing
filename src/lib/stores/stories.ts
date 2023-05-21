import { copy } from '../copy'
import { saveV2 } from '../loadSave'
import { createSyncable } from './sync'


export const replaceImage = (story: Story) => {
  const newStory = { ...story }

	newStory.passages = story.passages.map((passage) => {
		if (passage.image && passage.image.value) passage.image = passage.image.value
		

		return passage
	})


  return newStory
}

export const copyStory = (story: Story) => 
	copy(replaceImage(story))


export const {
	initialObject: stories,
	objectHash: storiesHash,
	isFetching: storiesFetching,
	lastUpdate: storiesLastUpdate,
	doSync: storiesSync,
	doInit: storiesInit
} = createSyncable<Story[]>({
	initialSate: [],
	key: 'stories',
	afterLoad: (self) => {
		self.subscribe((value: Story[]) => {
			if (!value.length) return

			resolvePromises(value)

			saveV2({ key: 'stories', value })
		})
	}
})

const updateStoryWithPassage = ({ index, storyId, resolvedValue, key }) => {
	stories.update((currStories) =>
		currStories.map((currStory) => {
			if (currStory.ifid === storyId) {
				currStory.passages[index][key] = resolvedValue
			}

			return currStory
		})
	)
}

const iterateOverPassages = ({ passage, storyId, index }) => {
	for (const key in passage) {
		if (Object.prototype.hasOwnProperty.call(passage, key)) {
			const passageProp = passage[key]

			if (
				!passageProp?.isImagePromise ||
				passageProp.done ||
				passageProp.promise === null
			)
				continue

			passageProp.promise.then(() =>
				updateStoryWithPassage({
					index,
					storyId,
					resolvedValue: passageProp,
					key
				})
			)
		}
	}
}

const resolvePromises = (stories: Story[]) => {
	for (const story of stories) {
		story.passages.forEach((passage, index) =>
			iterateOverPassages({ passage, storyId: story.ifid, index })
		)
	}
}
