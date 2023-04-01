import { createSyncable } from './sync'

export const {
	initialObject: config,
	objectHash: configHash,
	isFetching: configFetching,
	getProp: getConfig,
	doSync: configSync
} = createSyncable<GlobalConfig>({
	initialSate: {},
	key: 'global-configuration'
})
