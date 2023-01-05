interface LoadProp {
	key: string
	defaultValue?: any
	shouldUpdate?: (value: any) => boolean
}

interface SaveProp {
	key: string
	value: any
}
