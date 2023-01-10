import { writable } from 'svelte/store'
import { loadV2, saveV2 } from '../loadSave'
import { getConfig } from './configs'
import { dbx } from './dbx'
import { globalError } from './globalError'

export const storiesHash = writable('')
export const lastSaveAt = writable(0)

const createStories = () => {
	const { set, subscribe, update } = writable<Story[]>([])

	loadInitialState()

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

	setInterval(() => syncFile(), 120_000)

	const syncFile = async () => {
		let currValue: Story[]

		subscribe((value) => (currValue = value))()

		const {
			result: { content_hash: cloudHash }
		} = (await dbx.filesGetMetadata({ path: '/stories.json' }).catch((err) => {
			if (err.message.includes('409')) {
				// file dos not exist
				return { result: { content_hash: null } }
			}

			globalError.pushError(err)

			throw err
		})) as any

		if (!cloudHash) {
			const newLatestMeta = await dbx.filesUpload({
				path: '/stories.json',
				contents: JSON.stringify(currValue)
			})

			storiesHash.set(newLatestMeta.result.content_hash)

			return
		}

		let localHash = ''

		storiesHash.subscribe((value) => (localHash = value))

		if (cloudHash !== localHash) {
			globalError.pushError(
				new Error(
					`${cloudHash} !== ${localHash} - version conflict, it is necessary to overwrite local`
				)
			)

			return
		}

		const newLatestMeta = await dbx.filesUpload({
			path: '/stories.json',
			contents: JSON.stringify(currValue)
		})

		storiesHash.set(newLatestMeta.result.content_hash)
	}

	const saveOnChange = () =>
		subscribe((value) => {
			if (!value.length) return

			resolvePromises(value)

			saveV2({ key: 'stories', value })
		})

	async function loadInitialState() {
		if (!getConfig('sync')) {
			return loadV2<Story[]>({ key: 'stories' })
				.then((res) => set(res))
				.then(() => {
					saveOnChange()
				})
		}

		try {
			const {
				result: { fileBlob, content_hash }
			} = (await dbx.filesDownload({ path: '/stories.json' })) as any

			const rawText = await (fileBlob as Blob).text()

			const cloudStories = JSON.parse(rawText)

			set(cloudStories)
			storiesHash.set(content_hash)

			saveOnChange()
		} catch (err) {
			if (err.message.includes('409')) {
				return loadV2<Story[]>({ key: 'stories' })
					.then((res) => set(res))
					.then(syncFile)
					.then(() => {
						saveOnChange()
					})
			}

			globalError.pushError(err)
		}
	}

	return {
		set,
		subscribe,
		update
	}
}
export const stories = createStories()
