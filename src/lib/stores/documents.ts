import { saveV2 } from '../loadSave'
import { createSyncable } from './sync'

interface TDocument {
	id: string
  name: string
	content: any
}

export const {
	initialObject: documents,
	objectHash: documentsHash,
	isFetching: documentsFetching,
	lastUpdate: documentsLastUpdate,
	doSync: documentsSync,
	doInit: documentsInit
} = createSyncable<TDocument[]>({
	initialSate: [],
	key: 'documents',
	afterLoad: (self) => {
		self.subscribe((value: TDocument[]) => {
			if (!value.length) return

			saveV2({ key: 'documents', value })
		})
	}
})
