import { saveV2 } from '../loadSave'
import { createSaveable } from './saveable'

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
  doInit: documentsInit,
} = createSaveable<TDocument[]>({
  initialSate: [],
  key: 'documents',
  afterLoad: (self) => {
    self.subscribe((value: TDocument[]) => {
      if (!value.length) return

      saveV2({ key: 'documents', value })
    })
  },
})
