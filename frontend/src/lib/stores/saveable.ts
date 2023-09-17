import {
  loadV2,
  saveV2
} from '@/functions/loadSave/loadSave'
import {
  DownloadFile,
  GetMetadata,
  IsAuthenticated,
  UploadFile
} from '@/functions/wailsjs/go/syncs/DBXSync'
import dayjs, { Dayjs } from 'dayjs'
import { get, writable } from 'svelte/store'
import { globalError } from './globalError'

interface Saveable<T> {
  initialSate: T
  syncEvery?: number
  key: string
}

export const createSaveable = <T = unknown>({
  initialSate,
  syncEvery = 60 * 5,
  key
}: Saveable<T>) => {
  const saveableObject = writable<T>(initialSate)
  const lastUpdate = writable<Dayjs>(null)
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
    saveableObject.set(result)
    lastUpdate.set(dayjs())
  })

  const doSync = async () => {
    const object = get(saveableObject)

    if (
      (typeof object === 'object' &&
        Object.keys(object).length === 0) ||
      (Array.isArray(object) && object.length === 0)
    )
      return

    await saveV2({
      key,
      value: object
    })

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
      rev: rev,
      fileName: key
    })

    isFetching.set(false)

    if (cloudMeta.err) {
      globalError.pushError(cloudMeta.err.error_summary)

      return
    }

    lastUpdate.set(dayjs())
  }

  setInterval(doSync, syncEvery * 1000)

  void doSync()

  return {
    initialObject: saveableObject,
    lastUpdate,
    isFetching,
    doSync,
    updateLocal
  }
}