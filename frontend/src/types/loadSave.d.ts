interface LoadProp<T = unknown> {
  key: string
  saveOnDefault?: boolean
  defaultValue?: T
  shouldUpdate?: (value: T) => boolean
}

interface SaveProp {
  key: string
  value: any
  fileExtension?: string
  rev?: string
  mode?: WriteMode
}

interface TStoryProps {
  [storyKey: string]: {
    [propKey: string]: boolean | string | number
  }
}
