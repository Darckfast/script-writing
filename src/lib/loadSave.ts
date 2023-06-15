import {
  BaseDirectory,
  createDir,
  readTextFile,
  writeFile,
} from '@tauri-apps/api/fs'
import { globalError } from './stores/globalError'

const save = ({ key, value }: SaveProp): string => {
  const strValue = JSON.stringify(value)

  localStorage.setItem(key, strValue)

  return strValue
}

const load = <T = unknown>({
  key,
  defaultValue,
  saveOnDefault = false,
}: LoadProp<T>): typeof defaultValue => {
  try {
    const savedValue =
      JSON.parse(localStorage.getItem(key) ?? 'null') ?? defaultValue

    if (savedValue === defaultValue && saveOnDefault) {
      save({ key, value: defaultValue })
    }

    return savedValue
  } catch (err) {
    globalError.pushError(err)

    return defaultValue
  }
}

const deleteEntry = ({ key }: LoadProp) => {
  localStorage.removeItem(key)
}

const loadV2 = async <T = unknown>({
  defaultValue,
  key,
}: LoadProp<T>): Promise<typeof defaultValue> => {
  const isTauri = !!(window as any).__TAURI_IPC__

  if (!isTauri) {
    return load<T>({ key, defaultValue })
  }

  try {
    const file = await readTextFile(`${key}.json`, {
      dir: BaseDirectory.AppData,
    })

    const parsedValue = JSON.parse(file) ?? defaultValue

    return parsedValue
  } catch (err) {
    globalError.pushError(err)

    return load<T>({ key, defaultValue })
  }
}

const saveV2 = async ({ key, value }: SaveProp): Promise<string> => {
  console.log('saving', key)
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
        path: `${key}.json`,
      },
      {
        dir: BaseDirectory.AppData,
      }
    )

    return strValue
  } catch (err) {
    globalError.pushError(err)

    return save({ key, value })
  }
}
export { deleteEntry, load, loadV2, save, saveV2 }
