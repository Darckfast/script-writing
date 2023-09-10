interface TGetConfig {
  configName: string
  defaultValue?: any
}

export const getConfig = ({ configName, defaultValue }: TGetConfig) => {
  const globalConfigs = localStorage.getItem('global-configuration')

  if (!globalConfigs) return null

  const parsedConfigs = JSON.parse(globalConfigs)

  return parsedConfigs[configName] ?? defaultValue
}
