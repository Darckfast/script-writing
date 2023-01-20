import { createSyncable } from './sync'

export const {
	initialObject: config,
	objectHash: configHash,
  isFetching: configFetching,
	getProp: getConfig,
  doSync: configSync
} = createSyncable<Story[]>({
	initialSate: {},
	key: 'global-configuration'
})
