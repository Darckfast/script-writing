import type { Connections } from 'svelvet'

const EXCLUDED_PROPS = [
  'passages',
  'links',
  'row',
  'pid',
  'ifid',
  'col',
  'isTrusted',
  'text',
  'cleanText',
  'position',
  'name',
  'parentPid',
  'version',
]

const add = ({ nodeToAdd, nodes }: TAddNode): StoryNode[] => {
  nodes.push(nodeToAdd)

  return nodes
}

const remove = ({
  removeNode,
  nodes,
}: {
  removeNode: StoryNode
  nodes: StoryNode[]
}): StoryNode[] => {
  return nodes.filter((node) => {
    node.links = node.links.filter((link) => link.pid !== removeNode.pid)

    return node.pid !== removeNode.pid
  })
}

const update = ({
  update,
  nodes,
}: {
  update: { pid: string | number; [key: string]: any }
  nodes: StoryNode[]
}): StoryNode[] => {
  return nodes.map((node) => {
    if (node.pid === update.pid) {
      return {
        ...node,
        ...update,
      }
    }

    return node
  })
}

const props = (object: any, localProps: TProp[] = null): TProp[] => {
  if (object === undefined) {
    return []
  }

  const passageProps: TProp[] = []

  const { pid } = object

  for (const [key, value] of Object.entries<any>(object)) {
    if (EXCLUDED_PROPS.includes(key)) continue

    let type = 'text'

    if (localProps !== null) {
      const localProp = localProps.find((prop) => prop.name === key)

      if (localProp) {
        type = localProp.type
      }
    }

    passageProps.push({
      name: key,
      value,
      type,
      pid,
    })
  }

  return passageProps.sort((a, b) => a.name.localeCompare(b.name))
}

const isRoot = (node) => {
  return node.pid === 'root' || node.pid === 1
}

const getConnections = (passage: StoryNode): Connections => {
  return passage.links?.map((link) => [
    `node-${link.pid}`,
    `link-out-${link.pid}`,
  ])
}

export { add, getConnections, isRoot, props, remove, update }
