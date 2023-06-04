import { copy } from '../copy'
import { saveV2 } from '../loadSave'
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

export function calculateLeafPositions(story: Story): void {
  const root = story.passages[0]

  traverse(root, 0, 0)

  function traverse(node: StoryNode, x: number, y: number): void {
    node.position ||= { x, y }
    node.pid = keepPIDinUUIDorNumber(node.pid)

    if (!node.links) {
      node.links = []
      return
    }

    node.links = node.links.map((link) => {
      link.pid = keepPIDinUUIDorNumber(link.pid)
      return link
    })

    const children = node.links.map((link) =>
      story.passages.find((passage) => passage.pid === link.pid)
    )

    const width = children.length * 600
    const xOffset = width / (children.length + 1)
    let childX = x - width / 2 + xOffset

    children.forEach((child) => {
      traverse(child, childX, child.image !== undefined ? y + 550 : y + 100) // Adjust the y offset as needed
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
    // rome-ignore lint/performance/noDelete: this props need to be removed from the JSON file
    delete passage.text

    if (!passage.position || typeof passage.position.x === 'string') {
      passage.position = {
        x: 0,
        y: 0,
      }
    }

    if (!passage.links) passage.links = []

    // rome-ignore lint/performance/noDelete: this props need to be removed from the JSON file
    delete passage.isTrusted

    return passage
  })

  return story
}
