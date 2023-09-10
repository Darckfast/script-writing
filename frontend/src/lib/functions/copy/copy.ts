import { ClipboardSetText } from '../wailsjs/runtime/runtime'

export const copy = async (value: any) => {
  const content =
    typeof value === 'object'
      ? JSON.stringify(value)
      : value

  await ClipboardSetText(content)
}
