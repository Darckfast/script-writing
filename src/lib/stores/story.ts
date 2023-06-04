import { writable } from 'svelte/store'

export const isFetching = writable(false)

export const EmptyStory: Story = {
  name: null,
  passages: [{ cleanText: '', name: '', pid: 1, links: [] }],
  ifid: null,
  storyName: null,
  createdWith: null,
}

const findStory = (storyId: string) => (story: Story) => story.ifid === storyId

export { findStory }
