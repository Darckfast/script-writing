import dayjs, { Dayjs } from 'dayjs'
import { get, writable, type Writable } from 'svelte/store'
import { loadV2 } from '../loadSave'
import { dbx, isDbxAuth, loadCloud, saveCloud } from './dbx'
import { globalError } from './globalError'

interface FallBackProps<T = unknown> {
	run: () => T | Promise<T>
	onFail: Array<() => T>
	afterRun?: Array<() => void>
	beforeRun?: Array<() => void>
	afterDone?: Array<() => void>
	hasFailed?: () => Promise<void>
	id: string
}

const createFallback = <T = unknown>({
	run = () => {},
	onFail,
	afterRun,
	beforeRun,
	afterDone,
	hasFailed,
	id
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

	const execute = async <T = unknown>(runFunction: () => T): Promise<T> => {
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
		if (beforeRun) beforeRun.forEach((func) => execute<void>(func))

		try {
			const result = await execute<T>(executionArray[index] as () => T)

			success = true
			return result
		} catch (err) {
			console.error('running fallback for', id, err)
			index += 1

			if (!onFail.length || onFail.length < index) {
				throw new Error(
					`function was not possible to conclude, tried ${index} of ${onFail.length}`
				)
			}

			doRun()
		} finally {
			index = 0

			if (!success && hasFailed) await hasFailed()

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

export const createSyncable = <T = unknown>({
	initialSate,
	fileExtension = 'json',
	afterLoad = () => {},
	beforeSave = (value: T) => JSON.stringify(value),
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
			id: `syncable-${key}`,
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
						initialObject.set(savedValue as T)
					)
			],
			hasFailed: () =>
				saveCloud({
					key,
					value: beforeSave(initialSate),
					fileExtension: 'json',
					mode: 'add'
				}).then(() => initialObject.set(initialSate)),
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
		return get(initialObject)[propKey]
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
