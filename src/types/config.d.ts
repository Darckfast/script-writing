type GlobalConfig = {
  id: string
  version: number
  sync: boolean
  autoInfer: boolean
}

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

interface TImagePromise {
  file: Blob
  config: TConfig
}

interface TConfig {
  value: string
  enabled: boolean
}

interface TGetImagePromise {
  promise: Promise<string>
  done: boolean
  error: boolean
  value: string
  resolvedLink: string
  isImagePromise: boolean
}
