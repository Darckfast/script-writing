import { createSyncable } from './sync'

export const {
	initialObject: config,
	objectHash: configHash,
	isFetching: configFetching,
	getProp: getConfig,
	doSync: configSync
} = createSyncable<GlobalConfig>({
	initialSate: {
		autoInfer: true,
		sync: false,
		version: 1,
		id: 'global-configuration'
	},
	key: 'global-configuration'
})
