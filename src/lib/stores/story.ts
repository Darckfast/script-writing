import { writable } from 'svelte/store'

export const isFetching = writable(false)

export const EmptyStory = {
	name: null,
	passages: [{ cleanText: '' }]
} as Story

const findStory = (storyId: String) => (story: Story) => story.ifid === storyId

const updateStory = (newStory: Story) => (story: Story) =>
	story.ifid === newStory.ifid ? newStory : story

export { findStory, updateStory }
