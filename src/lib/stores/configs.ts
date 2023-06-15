import { createSaveable } from './saveable'

export const {
  initialObject: config,
  objectHash: configHash,
  isFetching: configFetching,
  getProp: getConfig,
  doSync: configSync,
} = createSaveable<GlobalConfig>({
  initialSate: {
    autoInfer: true,
    sync: false,
    alwaysFromCloud: false,
    version: 1,
    id: 'global-configuration',
  },
  key: 'global-configuration',
  localOnly: true,
})
