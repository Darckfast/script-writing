interface LoadProp<T = unknown> {
	key: string
	defaultValue?: T
	shouldUpdate?: (value: T) => boolean
}

interface SaveProp {
	key: string
	value: any
	fileExtension?: string
	rev?: string
	mode?: WriteMode
}
