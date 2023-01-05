import { BaseDirectory, readTextFile, writeFile } from '@tauri-apps/api/fs'
import { globalError } from './stores/globalError'

const save = ({ key, value }: SaveProp): void => {
	localStorage.setItem(key, JSON.stringify(value))
}

const load = <T = any>({ key, defaultValue }: LoadProp): T | undefined => {
	try {
		return JSON.parse(localStorage.getItem(key) ?? 'null') ?? defaultValue
	} catch (err) {
		globalError.pushError(err)

		return defaultValue
	}
}

const loadV2 = async <T = any>({
	defaultValue = [],
	key
}: LoadProp): Promise<T | undefined> => {
	try {
		const file = await readTextFile(`${key}.json`, {
			dir: BaseDirectory.AppData
		})

		const parsedValue = JSON.parse(file) ?? defaultValue

		return parsedValue
	} catch (err) {
		globalError.pushError(err)

		return load({ key, defaultValue }) ?? defaultValue
	}
}

const saveV2 = async ({ key, value }: SaveProp): Promise<void> => {
	localStorage.setItem(key, JSON.stringify(value))

	try {
		await writeFile(
			{
				contents: JSON.stringify(value),
				path: `${key}.json`
			},
			{
				dir: BaseDirectory.AppData
			}
		)
	} catch (err) {
		globalError.pushError(err)

		save({ key, value })
	}
}

export { save, load, loadV2, saveV2 }
