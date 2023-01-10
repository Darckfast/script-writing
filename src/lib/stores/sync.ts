import { writable } from 'svelte/store'
import { loadCloud, loadV2, saveCloud } from '../loadSave'

interface FallBackProps {
	run: () => any
	onFail: Array<() => any>
}
const createFallback = <T = any>({ run = () => {}, onFail }: FallBackProps) => {
	const executionArray = [run, ...onFail]
	let index = 0

	const doRun = (): T => {
		try {
			return executionArray[index]()
		} catch (err) {
			console.error(err)
			index += 1

			if (!onFail.length || onFail.length <= index) {
				throw new Error('function was not possible to conclude')
			}

			doRun()
		} finally {
			index = 0
		}
	}

	return doRun()
}

export const createSyncable = <T = any>({
	initialSate = {},
	afterLoad = () => {},
	syncEvery = 60_000,
	key
}) => {
	const initialObject = writable(initialSate)
	const objectHash = writable('')

	void setup()

	async function setup() {
		if (!key) throw new Error('key must be informed')

		createFallback<T>({
			run: () =>
				loadCloud({ key })
					.then(({ result: { fileBlob, content_hash } }) => {
						objectHash.set(content_hash)

						return fileBlob.text()
					})
					.then((fileText: string) => initialObject.set(JSON.parse(fileText))),
			onFail: [
				() =>
					loadV2({ key, defaultValue: initialSate }).then((savedValue) =>
						initialObject.set(savedValue)
					)
			]
		})
	}

	async function doSync() {
		let localHash = ''

		objectHash.subscribe((value) => (localHash = value))()

		if (!localHash) {
      const latestMeta = saveCloud({ key: })

			// const newLatestMeta = await dbx.filesUpload({
			// 	path: '/stories.json',
			// 	contents: JSON.stringify(currValue)
			// })

			// storiesHash.set(newLatestMeta.result.content_hash)

			// return
		}
	}

	return { initialObject, objectHash }
}

// async function loadInitialState() {
// 	if (!getConfig('sync')) {
// 		return loadV2<Story[]>({ key: 'stories' })
// 			.then((res) => set(res))
// 			.then(() => {
// 				// saveOnChange()
// 			})
// 	}

// 	try {
// 		const {
// 			result: { fileBlob, content_hash }
// 		} = (await dbx.filesDownload({ path: '/stories.json' })) as any

// 		const rawText = await (fileBlob as Blob).text()

// 		const cloudStories = JSON.parse(rawText)

// 		set(cloudStories)
// 		storiesHash.set(content_hash)

// 		saveOnChange()
// 	} catch (err) {
// 		if (err.message.includes('409')) {
// 			return loadV2<Story[]>({ key: 'stories' })
// 				.then((res) => set(res))
// 				.then(syncFile)
// 				.then(() => {
// 					saveOnChange()
// 				})
// 		}

// 		globalError.pushError(err)
// 	}
// }

// const syncFile = async () => {
// 	if (!getConfig('sync')) return

// 	let currValue: Story[]

// 	subscribe((value) => (currValue = value))()

// 	const {
// 		result: { content_hash: cloudHash }
// 	} = (await dbx.filesGetMetadata({ path: '/stories.json' }).catch((err) => {
// 		if (err.message.includes('409')) {
// 			// file dos not exist
// 			return { result: { content_hash: null } }
// 		}

// 		globalError.pushError(err)

// 		throw err
// 	})) as any

// 	if (!cloudHash) {
// 		const newLatestMeta = await dbx.filesUpload({
// 			path: '/stories.json',
// 			contents: JSON.stringify(currValue)
// 		})

// 		storiesHash.set(newLatestMeta.result.content_hash)

// 		return
// 	}

// 	let localHash = ''

// 	storiesHash.subscribe((value) => (localHash = value))

// 	if (cloudHash !== localHash) {
// 		globalError.pushError(
// 			new Error(
// 				`${cloudHash} !== ${localHash} - version conflict, it is necessary to overwrite local`
// 			)
// 		)

// 		return
// 	}

// 	const newLatestMeta = await dbx.filesUpload({
// 		path: '/stories.json',
// 		contents: JSON.stringify(currValue)
// 	})

// 	storiesHash.set(newLatestMeta.result.content_hash)
// }
