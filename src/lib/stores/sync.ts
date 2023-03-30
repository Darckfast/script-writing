import dayjs, { Dayjs } from 'dayjs'
import { writable, type Writable } from 'svelte/store'
import { loadV2 } from '../loadSave'
import { dbx, isDbxAuth, loadCloud, saveCloud } from './dbx'
import { globalError } from './globalError'

interface FallBackProps {
	run: () => any | Promise<any>
	onFail: Array<() => any>
	afterRun?: Array<() => void>
	beforeRun?: Array<() => void>
	afterDone?: Array<() => void>
}

const createFallback = <T = any>({
	run = () => {},
	onFail,
	afterRun,
	beforeRun,
	afterDone
}: FallBackProps) => {
	const executionArray = [run, ...onFail]
	let success = false
	let index = 0

	function is_promise<T = any>(value: any): value is PromiseLike<T> {
		return (
			!!value &&
			(typeof value === 'object' || typeof value === 'function') &&
			typeof value.then === 'function'
		)
	}

	const execute = async (runFunction: () => any): Promise<T> => {
		const result = runFunction()

		if (is_promise(result)) {
			return await result
		}

		if (result instanceof Promise) {
			return await result
		}

		return result
	}

	const doRun = async (): Promise<T> => {
		if (beforeRun) beforeRun.forEach((func) => execute(func))

		try {
			const result = await execute(executionArray[index])

			success = true
			return result
		} catch (err) {
			console.error('running fallback', err)
			index += 1

			if (!onFail.length || onFail.length < index) {
				throw new Error(
					`function was not possible to conclude, tried ${index} of ${onFail.length}`
				)
			}

			doRun()
		} finally {
			index = 0

			if (afterRun && success) afterRun.forEach((func) => execute(func))

			if (afterDone) afterDone.forEach((func) => execute(func))
		}
	}

	return doRun()
}

interface Syncable {
	initialSate: any
	fileExtension?: string
	afterLoad?: (self: Writable<any>) => void
	beforeSave?: (value: any) => any
	syncEvery?: number
	key: string
}

export const createSyncable = <T = any>({
	initialSate,
	fileExtension = 'json',
	afterLoad = () => {},
	beforeSave = (value: any) => JSON.stringify(value),
	syncEvery = 120_000,
	key
}: Syncable) => {
	const initialObject = writable<T>(initialSate)
	const hash = writable('')
	const lastUpdate = writable<Dayjs>(null)
	const isFetching = writable(false)

	const doInit = () => {
		if (!key) throw new Error('key must be informed')

		createFallback<T>({
			beforeRun: [() => isFetching.set(true)],
			run: () =>
				(loadCloud({ key }) as Promise<any>)
					.then(({ result: { fileBlob, rev } }) => {
						hash.set(rev)

						return fileBlob.text()
					})
					.then((fileText: string) => initialObject.set(JSON.parse(fileText))),
			afterRun: [createInterval, () => afterLoad(initialObject)],
			onFail: [
				() =>
					loadV2({ key, defaultValue: initialSate }).then((savedValue) =>
						initialObject.set(savedValue)
					)
			],
			afterDone: [() => isFetching.set(false)]
		})
	}

	const doSync = async () => {
		if (!isDbxAuth()) {
			return
		}

		isFetching.set(true)

		let localHash = ''
		let currValue

		hash.subscribe((value) => (localHash = value))()
		initialObject.subscribe((value) => (currValue = value))()

		currValue = beforeSave(currValue)

		const {
			result: { rev: cloudHash }
		} = (await dbx
			.filesGetMetadata({
				path: `/${key}.${fileExtension}`
			})
			.catch((err) => {
				if (err.message.includes('409')) {
					return { result: { content_hash: null } }
				}

				globalError.pushError(err)

				throw err
			})) as any

		if (cloudHash && cloudHash !== localHash) {
			globalError.pushError(
				new Error('version conflict, it is necessary to overwrite local'),
				{
					onConfirm: () => doInit()
				}
			)
			return
		}

		const cloudMeta = await saveCloud({
			key,
			value: currValue,
			fileExtension,
			rev: localHash
		})

		lastUpdate.set(dayjs())
		hash.set(cloudMeta.result.rev)

		isFetching.set(false)
	}

	const createInterval = () => {
		setInterval(doSync, syncEvery)
	}

	const getProp = <T = any>(propKey: string): T => {
		let objectValue

		initialObject.subscribe((value) => (objectValue = value))()

		return objectValue[propKey]
	}

	void doInit()

	return {
		initialObject,
		objectHash: hash,
		lastUpdate,
		isFetching,
		doSync,
		doInit,
		getProp
	}
}
