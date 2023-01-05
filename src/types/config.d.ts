interface ConfigProp {
	value: any
	enabled: boolean
}

interface Config {
	id: string
	version: number
	Record<string, ConfigProp>()
}
