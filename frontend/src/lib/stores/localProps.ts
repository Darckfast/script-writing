import { createSaveable } from './saveable'

export const { initialObject: localProps } =
  createSaveable<TStoryProps>({
    key: 'local-props',
    initialSate: {}
  })
