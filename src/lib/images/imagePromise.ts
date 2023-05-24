import { dbx } from '../stores/dbx'
import { globalError } from '../stores/globalError'

import { v4 as uuidv4 } from 'uuid'

export const stringToImagePromise = (path: string): TGetImagePromise => {
	const basePromise = {
		promise: null,
		done: false,
		error: false,
		value: path,
		resolvedLink: null,
		isImagePromise: true
	}

	basePromise.promise = dbx
		.filesGetTemporaryLink({ path })
		.then(({ result: { link } }) => {
			basePromise.resolvedLink = link

			return link
		})
		.catch((err) => {
			globalError.pushError(err)
			basePromise.error = true

			return '/unicorn.svg'
		})
		.finally(() => (basePromise.done = true))

	return basePromise
}

// TODO: add link renew once the same has expired

export const getImagePromise = ({
	config,
	file
}: TImagePromise): TGetImagePromise => {
	const basePromise = {
		promise: null,
		done: false,
		error: false,
		value: null,
		resolvedLink: null,
		isImagePromise: true
	}

	basePromise.promise = new Promise<string>((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = (event) => {
			const image = { imageBuffer: event.target.result, fileName: file.name }
			const { enabled } = config

			let { value: configValue } = config

			if (!enabled) configValue = '/'

			const [, extension] = image.fileName.split('.')

			image.fileName = [uuidv4(), extension].join('.')

			const path = `/${configValue}${image.fileName}`

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
	})
		.catch((err) => {
			globalError.pushError(err)
			basePromise.error = true
		})
		.finally(() => (basePromise.done = true))

	return basePromise
}
