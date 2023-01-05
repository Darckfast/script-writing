const genColor = (str?: string): string => {
	if (!str) return '#fff'

	let hash = 0
	let colour = '#'

	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash)
	}

	for (let i = 0; i < 3; i++) {
		const value = (hash >> (i * 8)) & 0xff
		colour += ('00' + value.toString(16)).substr(-2)
	}

	return colour
}

export { genColor }
