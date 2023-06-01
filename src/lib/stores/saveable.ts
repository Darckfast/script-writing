import dayjs, { Dayjs } from 'dayjs'
import { DropboxResponseError } from 'dropbox'
import { get, writable, type Writable } from 'svelte/store'
import { load, loadV2, save, saveV2 } from '../loadSave'
import { getCloudMetadata, isDbxAuth, loadCloud, saveCloud } from './dbx'
import { globalError } from './globalError'

interface FallBackProps<T = unknown> {
  run: () => T | Promise<T>
  onFail?: Array<() => T>
  hasToRefetch: () => Promise<boolean>
  afterRun?: Array<() => void>
  beforeRun?: Array<() => void>
  afterDone?: Array<() => void>
  cache?: () => Promise<void>
  onNotFound: () => Promise<any>
  id: string
}

const createFallback = <T = unknown>({
  run = () => null,
  onFail = [() => {}],
  afterRun,
  beforeRun,
  afterDone,
  onNotFound,
  hasToRefetch,
  cache,
  id,
}: FallBackProps) => {
  const executionArray = [run, ...onFail]
  let success = false
  let index = 0

  function is_promise<T = unknown>(value: any): value is PromiseLike<T> {
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
    if (cache) await cache()

    try {
      const hasToRefetchResult = await hasToRefetch()
      if (!hasToRefetchResult) return

      const result = await execute<T>(executionArray[index] as () => T)

      success = true
      return result
    } catch (err) {
      if (
        onNotFound &&
        err instanceof DropboxResponseError &&
        err.error.error_summary.includes('not_found')
      ) {
        console.log(`creating first entry for ${id}`)

        await onNotFound()

        return
      }

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

interface Saveable<T> {
  initialSate: T
  fileExtension?: string
  afterLoad?: (self: Writable<T>) => void
  beforeSave?: (value: T) => string
  syncEvery?: number
  key: string
  localOnly?: boolean
  useQuery?: boolean
}

export const createSaveable = <T = unknown>({
  initialSate,
  fileExtension = 'json',
  afterLoad = () => null,
  beforeSave = (value: T) => JSON.stringify(value),
  syncEvery = 60 * 2,
  key,
  localOnly,
}: Saveable<T>) => {
  const initialObject = writable<T>(initialSate)
  const hash = writable(load({ key: `${key}-hash`, defaultValue: null }))
  const lastUpdate = writable<Dayjs>(null)
  const isFetching = writable(false)

  hash.subscribe((value) => {
    save({ key: `${key}-hash`, value })
  })

  const defaultLoad = () =>
    loadCloud({ key })
      .then(({ result: { fileBlob, rev } }) => {
        hash.set(rev)

        return fileBlob.text()
      })
      .then((fileText: string) => initialObject.set(JSON.parse(fileText)))
      .then(() => saveV2({ key, value: initialSate }))

  const defaultSave = () =>
    saveCloud({
      key,
      value: beforeSave(initialSate),
      fileExtension: 'json',
      mode: 'add',
    })

  const defaultHasTo = async () => {
    const currentHash = get(hash)
    const metadata = await getCloudMetadata({ key })

    // TODO: this can create a gap between the local and cloud version
    // the content_hash should be used instead
    return currentHash !== metadata.result.rev
  }

  const defaultCache = () =>
    loadV2<T>({ key, defaultValue: initialSate }).then((savedValue) => {
      initialObject.set(savedValue)

      if (!localOnly) {
        initialObject.subscribe((value) => {
          saveV2({ key, value })
        })
      }
    })

  const doInit = () => {
    if (!key) throw new Error('key must be informed')

    if (localOnly) {
      initialObject.set(load<T>({ key, defaultValue: initialSate }))

      initialObject.subscribe((value) => {
        save({ key, value })
      })

      return
    }

    createFallback<T>({
      id: `syncable-${key}`,
      beforeRun: [() => isFetching.set(true)],
      cache: defaultCache,
      hasToRefetch: defaultHasTo,
      run: defaultLoad,
      afterRun: [createInterval, () => afterLoad(initialObject)],
      onNotFound: defaultSave,
      afterDone: [() => isFetching.set(false)],
    })
  }

  const doSync = async () => {
    if (!isDbxAuth()) return

    isFetching.set(true)

    const localHash = get(hash)
    const currValue = beforeSave(get(initialObject))

    const {
      result: { rev: cloudHash },
    } = await getCloudMetadata({ key })

    if (cloudHash && cloudHash !== localHash) {
      // TODO: add a force load option
      globalError.pushError(
        new Error('version conflict, it is necessary to overwrite local'),
        {
          onConfirm: defaultLoad,
        }
      )
      return
    }

    const cloudMeta = await saveCloud({
      key,
      value: currValue,
      fileExtension,
      rev: localHash,
    })

    lastUpdate.set(dayjs())

    if (cloudMeta) hash.set(cloudMeta.result.rev)

    isFetching.set(false)
  }

  const createInterval = () => {
    setInterval(doSync, syncEvery * 1000)
  }

  const getProp = <T = unknown>(propKey: string): T => {
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
    getProp,
  }
}
