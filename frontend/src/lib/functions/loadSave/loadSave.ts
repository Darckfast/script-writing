import { globalError } from '@/stores/globalError'
import {
  LoadLocal,
  SaveLocal
} from '../wailsjs/go/saveload/SaveLoad'

const save = ({ key, value }: SaveProp): string => {
  const strValue = JSON.stringify(value)

  localStorage.setItem(key, strValue)

  return strValue
}

const deleteEntry = ({ key }: LoadProp) => {
  localStorage.removeItem(key)
}

const load = <T = unknown>({
  key,
  defaultValue
}: LoadProp<T>): typeof defaultValue => {
  try {
    return (
      JSON.parse(localStorage.getItem(key) ?? 'null') ??
      defaultValue
    )
  } catch (err: any) {
    globalError.pushError(err)

    return defaultValue
  }
}

const loadV2 = async <T = unknown>({
  defaultValue,
  key
}: LoadProp<T>): Promise<typeof defaultValue> => {
  try {
    const fileString = await LoadLocal(`${key}.json`)

    return JSON.parse(fileString) ?? defaultValue
  } catch (err: any) {
    globalError.pushError(err)

    return load<T>({ key, defaultValue })
  }
}

const saveV2 = async ({ key, value }: SaveProp) => {
  try {
    await SaveLocal(`${key}.json`, JSON.stringify(value))
  } catch (err: any) {
    globalError.pushError(err)

    return save({ key, value })
  }
}
export { deleteEntry, load, loadV2, save, saveV2 }