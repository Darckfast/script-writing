import { createSaveable } from './saveable'

interface TDocument {
  id: string
  name: string
  content: any
}

export const {
  initialObject: documents,
  updateLocal: updateLocalDocuments,
  isFetching: documentsFetching,
  lastUpdate: documentsLastUpdate,
  doSync: documentsSync
} = createSaveable<TDocument[]>({
  initialSate: [],
  key: 'documents'
})
