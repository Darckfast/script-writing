import { createSaveable } from './saveable'

export const { initialObject: localPropsStore } =
  createSaveable({
    key: 'local-props',
    initialSate: {}
  })
