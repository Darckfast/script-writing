import {
	BaseDirectory,
	createDir,
	readTextFile,
	writeFile
} from '@tauri-apps/api/fs'
import { globalError } from './stores/globalError'

const save = ({ key, value }: SaveProp): string => {
	const strValue = JSON.stringify(value)

	localStorage.setItem(key, strValue)

	return strValue
}

const load = <T = unknown>({
	key,
	defaultValue = []
}: LoadProp): T | undefined => {
	try {
		return JSON.parse(localStorage.getItem(key) ?? 'null') ?? defaultValue
	} catch (err) {
		globalError.pushError(err)

		return defaultValue as T
	}
}

const loadV2 = async <T = unknown>({
	defaultValue = [],
	key
}: LoadProp): Promise<T | undefined> => {
	const isTauri = !!(window as any).__TAURI_IPC__

	if (!isTauri) {
		return load<T>({ key, defaultValue }) ?? (defaultValue as T)
	}

	try {
		const file = await readTextFile(`${key}.json`, {
			dir: BaseDirectory.AppData
		})

		const parsedValue = JSON.parse(file) ?? defaultValue

		return parsedValue
	} catch (err) {
		globalError.pushError(err)

		return load<T>({ key, defaultValue }) ?? (defaultValue as T)
	}
}

const saveV2 = async ({ key, value }: SaveProp): Promise<string> => {
	const strValue = JSON.stringify(value)

	const isTauri = !!(window as any).__TAURI_IPC__

	if (!isTauri) {
		return save({ key, value })
	}

	try {
		await createDir('', { dir: BaseDirectory.AppData, recursive: true })

		await writeFile(
			{
				contents: strValue,
				path: `${key}.json`
			},
			{
				dir: BaseDirectory.AppData
			}
		)

		return strValue
	} catch (err) {
		globalError.pushError(err)

		return save({ key, value })
	}
}

export { save, load, loadV2, saveV2 }
