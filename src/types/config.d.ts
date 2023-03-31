type GlobalConfig = {
	id: string
	version: number
	sync: boolean
	autoInfer: boolean
} & Record<string, SubConfigs>

type ConfigType<T = string> = {
	enabled: boolean
	value: T
}

type SubConfigs = {
	baseDir?: ConfigType
	reverseOrder?: ConfigType<boolean>
	group?: ConfigType
	type?: ConfigType
}

type DBXToken = {
	access_token: string
	refresh_token: string
	expires_in: number
}
