const save = (key: string, progress: any): void => {
	localStorage.setItem(key, JSON.stringify(progress))
}

const load = <T>(key: string, defaultValue: any = []): T => {
	return JSON.parse(localStorage.getItem(key) ?? 'null') ?? defaultValue
}

export { save, load }
