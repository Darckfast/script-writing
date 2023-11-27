import {
  load,
  loadV2,
  save,
  saveV2
} from '@/functions/loadSave/loadSave'
import {
  DownloadFile,
  GetMetadata,
  IsAuthenticated,
  UploadFile
} from '@/functions/wailsjs/go/syncs/DBXSync'
import { AutoExport } from '@/functions/wailsjs/go/exporter/Exporter'
import dayjs, { Dayjs } from 'dayjs'
import { get, writable } from 'svelte/store'
import { globalError } from './globalError'

interface Saveable<T> {
  initialSate: T
  syncEvery?: number
  key: string
  localOnly?: boolean
}

export const createSaveable = <T = unknown>({
  initialSate,
  syncEvery = 60 * 5,
  key,
  localOnly = false
}: Saveable<T>) => {
  const saveableObject = writable<T>(initialSate)
  const lastUpdate = writable<Dayjs>()
  const isFetching = writable(false)

  async function updateLocal() {
    const result = await DownloadFile(key)

    if (!result.err) {
      saveableObject.set(result.content)
      lastUpdate.set(dayjs())

      await saveV2({
        key,
        value: result.content
      })
    } else {
      globalError.pushError(result.err.error_summary)
    }
  }

  loadV2<T>({
    key
  }).then((result) => {
    if (result) {
      saveableObject.set(result)
      lastUpdate.set(dayjs())

      if (localOnly) {
        saveableObject.subscribe(value => {
          saveV2({ key, value })
        })
      }
    }
  })

  const doSync = async () => {
    const object = get(saveableObject)

    if (
      object === null ||
      (typeof object === 'object' &&
        Object.keys(object).length === 0) ||
      (Array.isArray(object) && object.length === 0)
    ) {
      return
    }

    await saveV2({
      key,
      value: object
    })

    const bundlePath = load({ key: 'bundle-path' })

    if (bundlePath) {
      await AutoExport(bundlePath)
    }

    const isAuth = await IsAuthenticated()

    if (!isAuth) return

    isFetching.set(true)

    const objectString = JSON.stringify(object)
    const { err, rev } = await GetMetadata(key)

    if (err) {
      globalError.pushError(err.error_summary)
      return
    }

    const cloudMeta = await UploadFile({
      content: objectString,
      rev: rev ?? '',
      fileName: key,
      contentHash: '' // TODO: remove this field
    })

    isFetching.set(false)

    if (cloudMeta.err) {
      globalError.pushError(cloudMeta.err.error_summary)

      return
    }

    lastUpdate.set(dayjs())
  }

  if (!localOnly) {
    setInterval(doSync, syncEvery * 1000)
    void doSync()
  }

  return {
    initialObject: saveableObject,
    lastUpdate,
    isFetching,
    doSync,
    updateLocal
  }
}