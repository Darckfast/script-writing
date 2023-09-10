import dayjs from 'dayjs'
import { dbx } from '../../stores/dbx'
import { globalError } from '../../stores/globalError'

import { v4 as uuidv4 } from 'uuid'

const basicFetch = (basePromise) =>
  dbx
    .filesGetTemporaryLink({ path: basePromise.value })
    .then(({ result: { link } }) => {
      basePromise.resolvedLink = link
      basePromise.fetchedOn = dayjs().toJSON()

      return link
    })
    .catch((err) => {
      globalError.pushError(err)
      basePromise.error = true

      return '/unicorn.svg'
    })
    .finally(() => {
      basePromise.done = true
    })

export const getFromPathOrPromise = (
  pathOrPromise,
  baseDir?: string
) => {
  if (pathOrPromise.isImagePromise) {
    if (
      !pathOrPromise.fetchedOn ||
      dayjs().diff(pathOrPromise.fetchedOn, 'h') > 1
    ) {
      pathOrPromise.done = false
      pathOrPromise.promise = basicFetch(pathOrPromise)
    }

    pathOrPromise.promise = Promise.resolve(
      pathOrPromise.resolvedLink
    )

    return pathOrPromise
  }

  return stringToImagePromise(pathOrPromise, baseDir)
}

export const stringToImagePromise = (
  path: string,
  baseDir?: string
): TGetImagePromise => {
  const pathValue = path.includes('/')
    ? path
    : `${formatPath(baseDir)}${path}`

  const basePromise = {
    promise: null,
    done: false,
    error: false,
    fetchedOn: null,
    value: pathValue,
    resolvedLink: null,
    isImagePromise: true
  }

  basePromise.promise = basicFetch(basePromise)

  return basePromise
}

export const formatPath = (path: string) => {
  let newPath = path

  if (!path.startsWith('/')) newPath = `/${newPath}`
  if (!path.endsWith('/')) newPath = `${newPath}/`

  return newPath
}

export const getImagePromise = ({
  baseDir,
  file
}: TImagePromise): TGetImagePromise => {
  const basePromise = {
    promise: null,
    done: false,
    error: false,
    value: null,
    fetchedOn: dayjs().toJSON(),
    resolvedLink: null,
    isImagePromise: true
  }

  basePromise.promise = new Promise<string>(
    (resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const image = {
          imageBuffer: event.target.result,
          fileName: file.name
        }

        let configValue = baseDir ?? ''

        if (!configValue.endsWith('/')) configValue += '/'
        if (!configValue.startsWith('/'))
          configValue = `/${configValue}`

        const [, extension] = image.fileName.split('.')

        image.fileName = [uuidv4(), extension].join('.')

        const path = `${configValue}${image.fileName}`

        dbx
          .filesUpload({
            path,
            contents: event.target.result,
            mode: {
              '.tag': 'overwrite'
            }
          })
          .then(({ result: { path_display } }) => {
            basePromise.value = path_display

            return path_display
          })
          .then((path) =>
            dbx
              .filesGetTemporaryLink({ path })
              .then(({ result: { link } }) => {
                basePromise.resolvedLink = link

                resolve(link)
              })
              .catch((err) => {
                globalError.pushError(err)

                reject(err)

                return '/unicorn.svg'
              })
          )
      }

      reader.readAsArrayBuffer(file)
    }
  )
    .catch((err) => {
      globalError.pushError(err)
      basePromise.error = true
    })
    .finally(() => {
      basePromise.done = true
    })

  return basePromise
}
