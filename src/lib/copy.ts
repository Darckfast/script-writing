import { writeText } from '@tauri-apps/api/clipboard'

export const copy = (value: any) => {
	const content = JSON.stringify(value)

	if (!(window as any).__TAURI_IPC__) {
		return navigator.clipboard.writeText(content)
	}

	writeText(content)
}
