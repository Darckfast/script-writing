import {
	BaseDirectory,
	createDir,
	readTextFile,
	writeFile
} from '@tauri-apps/api/fs'

export const createLocalDataFolder = async () =>
	createDir('data', {
		dir: BaseDirectory.AppData,
		recursive: true
	}).catch((err) => console.error(err))

const save = (key: string, progress: any): void => {
	localStorage.setItem(key, JSON.stringify(progress))
}

const load = <T>(key: string, defaultValue: any = []): T | undefined => {
	try {
		return JSON.parse(localStorage.getItem(key) ?? 'null') ?? defaultValue
	} catch {
		return defaultValue
	}
}

const loadV2 = async <T>({
	defaultValue = [],
	key
}: LoadProp): Promise<T | undefined> => {
	try {
		const file = await readTextFile(`data/${key}.json`, {
			dir: BaseDirectory.AppData
		})

		const parsedValue = JSON.parse(file)

		if (!parsedValue) return defaultValue

		return parsedValue
	} catch (err) {
		return defaultValue
	}
}

const saveV2 = async ({ key, value }: SaveProp): Promise<void> => {
	localStorage.setItem(key, JSON.stringify(value))

	await writeFile(
		{
			contents: JSON.stringify(value),
			path: `./data/${key}.json`
		},
		{
			dir: BaseDirectory.AppData
		}
	)
}

export { save, load, loadV2, saveV2 }
