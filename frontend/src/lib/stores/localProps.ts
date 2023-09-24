import { createSaveable } from './saveable'

export const { initialObject: localProps } =
  createSaveable<TStoryProps>({
    key: 'local-props',
    localOnly: true,
    initialSate: {}
  })