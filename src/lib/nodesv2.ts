const add = ({
	add: nodeToAdd,
	nodes
}: {
	add: StoryNode
	nodes: StoryNode[]
}): StoryNode[] => {
	let hasParent = false

	for (const node of nodes) {
		if (node.pid === nodeToAdd.parentPid) {
			if (!node.links) {
				node.links = []
			}

			hasParent = true

			node.links.push({ pid: nodeToAdd.pid })
		}
	}

	if (hasParent) nodes.push(nodeToAdd)

	return nodes.map((node) => patchUp(node))
}

const remove = ({
	remove,
	nodes
}: {
	remove: StoryNode
	nodes: StoryNode[]
}): StoryNode[] => {
	let newNodes = []

	for (const node of nodes) {
		if (node.pid === remove.parentPid) {
			node.links = node.links.filter((nd) => nd.pid !== remove.pid)
		}

		if (node.parentPid === remove.pid) {
			node.parentPid = remove.parentPid
		}

		if (node.pid !== remove.pid) {
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
	update,
	nodes
}: {
	update: StoryNode
	nodes: StoryNode[]
}): StoryNode[] => {
	return nodes.map((node) => {
		if (node.pid === update.pid) {
			return update
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

const patchUp = (node: StoryNode): StoryNode => {
	for (const key in node) {
		if (Object.prototype.hasOwnProperty.call(node, key)) {
			if (['pid', 'parentPid'].includes(key)) {
				node[key] = `${node[key]}`
			}
			// const element = node[key]

			// if (!Number.isNaN(Number(element)) && element !== '') {
			// 	node[key] = Number(element)
			// }
		}
	}

	return node
}

export { props, add, remove, update }
