import { writable } from 'svelte/store'

export const isFetching = writable(false)

export const EmptyStory: Story = {
  baseDir: '',
  group: '',
  type: '',
  passages: [
    { cleanText: '', name: '', pid: 1, links: [] }
  ],
  ifid: "",
  storyName: "",
}

const findStory = (storyId: string) => (story: Story) =>
  story.ifid === storyId

export { findStory }