const add = ({
	nodeToAdd,
	nodes
}: {
	nodeToAdd: StoryNode
	nodes: StoryNode[]
}): StoryNode[] => {
	for (const node of nodes) {
		if (node.pid === nodeToAdd.parentPid) {
			if (!node.links) {
				node.links = []
			}

			node.links.push({ pid: nodeToAdd.pid })
		}

		for (const key in node) {
			if (Object.prototype.hasOwnProperty.call(node, key)) {
				const element = node[key]

				if (!Number.isNaN(Number(element)) && element !== '') {
					node[key] = Number(element)
				}
			}
		}
	}

	nodes.push(nodeToAdd)

	return nodes
}

const remove = ({
	nodeToRemove,
	nodes
}: {
	nodeToRemove: StoryNode
	nodes: StoryNode[]
}): StoryNode[] => {
	let newNodes = []

	for (const node of nodes) {
		if (node.pid === nodeToRemove.parentPid) {
			node.links = node.links.filter((nd) => nd.pid !== nodeToRemove.pid)
		}

		if (node.parentPid === nodeToRemove.pid) {
			node.parentPid = nodeToRemove.parentPid
		}

		if (node.pid !== nodeToRemove.pid) {
			newNodes.push(node)
		} else {
			newNodes = newNodes.map((nNode) => {
				if (nNode.pid === node.parentPid) {
					nNode.links = nNode.links.concat(node.links)
				}

				return nNode
			})
		}
	}

	return newNodes
}

const update = ({
	nodeToUpdate,
	nodes
}: {
	nodeToUpdate: StoryNode
	nodes: StoryNode[]
}): StoryNode[] => {
	return nodes.map((node) => {
		if (node.pid === nodeToUpdate.pid) {
			return nodeToUpdate
		}

		return node
	})
}

const props = (object: any): Props[] => {
	if (object === undefined) {
		return []
	}

	const passageProps: { name: string; value: string }[] = []

	for (const key in object) {
		if (Object.prototype.hasOwnProperty.call(object, key)) {
			const element = object[key]

			if (
				![
					'passages',
					'links',
					'row',
					'col',
					'position',
					'condition',
					'text',
					'pid',
					'parentPid'
				].includes(key)
			) {
				passageProps.push({ name: key, value: element })
			}
		}
	}

	return passageProps.sort((a, b) => a.name.localeCompare(b.name))
}

export { props, add, remove, update }
