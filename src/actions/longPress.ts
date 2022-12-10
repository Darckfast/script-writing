export function longpress(node: HTMLElement) {
	const handleMouseDown = () => {
		const timeout = setTimeout(() => {
			node.dispatchEvent(new CustomEvent('longpress'))
		}, 500)

		const cancel = () => {
			clearTimeout(timeout)

			node.removeEventListener('mouseup', cancel)
		}

		node.addEventListener('mouseup', cancel)
	}

	const handleClick = (event) => {
		if (!node.contains(event.target)) {
			node.dispatchEvent(new CustomEvent('outclick'))
		}
	}

	node.addEventListener('mousedown', handleMouseDown)
	document.addEventListener('click', handleClick, true)

	return {
		destroy() {
			node.removeEventListener('mousedown', handleMouseDown)
			document.removeEventListener('click', handleClick, true)
		}
	}
}
