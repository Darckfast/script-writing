import { get } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'
import { copy } from '../copy'
import { load, saveV2 } from '../loadSave'
import { props } from '../nodes.utils'
import { localPropsStore } from './localProps'
import { createSaveable } from './saveable'

export const replaceImage = (story: Story) => {
  const newStory = { ...story }

  newStory.passages = story.passages.map((passage) => {
    if (passage.image?.value) passage.image = passage.image.value

    return passage
  })

  return newStory
}

export const copyStory = (story: Story) => copy(replaceImage(story))

export const {
  initialObject: stories,
  objectHash: storiesHash,
  isFetching: storiesFetching,
  lastUpdate: storiesLastUpdate,
  doSync: storiesSync,
  doInit: storiesInit,
} = createSaveable<Story[]>({
  initialSate: [],
  key: 'stories',
  afterLoad: (self) => {
    self.subscribe((value: Story[]) => {
      if (!value.length) return

      resolvePromises(value)
      saveV2({ key: 'stories', value })
    })
  },
})

const updateStoryWithPassage = ({ index, storyId, resolvedValue, key }) => {
  stories.update((currStories) =>
    currStories.map((currStory) => {
      if (currStory.ifid === storyId) {
        currStory.passages[index][key] = resolvedValue
      }

      return currStory
    })
  )
}

const iterateOverPassages = ({ passage, storyId, index }) => {
  for (const key in passage) {
    if (Object.prototype.hasOwnProperty.call(passage, key)) {
      const passageProp = passage[key]

      if (
        !passageProp?.isImagePromise ||
        passageProp.done ||
        passageProp.promise === null ||
        passageProp.promise.then === undefined
      )
        continue

      passageProp.promise.then(() =>
        updateStoryWithPassage({
          index,
          storyId,
          resolvedValue: passageProp,
          key,
        })
      )
    }
  }
}

const resolvePromises = (stories: Story[]) => {
  for (const story of stories) {
    story.passages.forEach((passage, index) =>
      iterateOverPassages({ passage, storyId: story.ifid, index })
    )
  }
}

export const organizePropsPosition = (passage: StoryNode, storyId = '') => {
  const basePosition = { ...passage.position } ?? { x: 0, y: 0 }
  basePosition.x = basePosition.x - 350

  const localProps = []

  if (storyId !== '') {
    localProps.push(...get(localPropsStore)[storyId])
  }

  return props(passage, localProps).reduce((acc, prop, index) => {
    prop.position = {
      x: basePosition.x,
      y: basePosition.y + index * 50,
    }

    if (acc.length > 0 && acc.at(index - 1).type === 'file') {
      prop.position.y += index * 50
    }

    prop.id = load({
      key: `prop-id-${passage.pid}-${prop.name}`,
      defaultValue: uuidv4(),
      saveOnDefault: true,
    })

    acc.push(prop)

    return acc
  }, [])
}

export function calculateLeafPositions(passages: StoryNode[], storyId: string) {
  const root = passages[0]

  traverse(root, 0, 0)

  function traverse(node: StoryNode, x: number, y: number): void {
    node.position = { x, y }
    node.pid = keepPIDinUUIDorNumber(node.pid)

    organizePropsPosition(node, storyId)

    if (node.links === undefined) {
      node.links = []
      return
    }

    const links = node.links

    const children = links
      .map((link) => passages.find((passage) => passage.pid === link.pid))
      .filter((child) => child !== undefined)

    const width = children.length * 600
    const xOffset = width / (children.length + 1)
    let childX = x - width / 2 + xOffset

    const nodeHasImage = node.image !== undefined

    children.forEach((child) => {
      traverse(child, childX, nodeHasImage ? y + 650 : y + 200)
      childX += xOffset
    })
  }
}

export const formatStoryPIDs = (story: Story) => {
  let latestPid = -1

  story.passages = story.passages.map((passage) => {
    passage.pid = keepPIDinUUIDorNumber(passage.pid)

    if (typeof passage.pid === 'number' && passage.pid > latestPid) {
      latestPid = passage.pid
    }

    if (!passage.links) return passage

    passage.links = passage.links.map((link) => {
      link.pid = keepPIDinUUIDorNumber(link.pid)
      return link
    })

    return passage
  })

  if (latestPid > 0) {
    story.latestPid = latestPid
  }

  return story
}

const containsOnlyNumbers = (str: string) => {
  const reg = /^\d+$/
  return reg.test(str)
}

const keepPIDinUUIDorNumber = (nodePid: string | number) => {
  if (typeof nodePid === 'string' && containsOnlyNumbers(nodePid)) {
    return parseInt(nodePid)
  }

  return nodePid
}

export const removeLegacyProps = (story: Story) => {
  story.passages = story.passages.map((passage) => {
    if (!passage.position || typeof passage.position.x === 'string') {
      passage.position = {
        x: 0,
        y: 0,
      }
    }

    if (!passage.links) passage.links = []

    return passage
  })

  return story
}
