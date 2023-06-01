import { writeText } from '@tauri-apps/api/clipboard'

export const copy = (value: any) => {
  const content = typeof value === 'object' ? JSON.stringify(value) : value

  if (!(window as any).__TAURI_IPC__) {
    return navigator.clipboard.writeText(content)
  }

  return writeText(content)
}
