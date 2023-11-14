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
  'version'
]

// TODO: need to check for new props type, that do not have value yet
const getPropType = (value: any) => {
  if (
    typeof value === 'boolean' ||
    value === 'true' ||
    value === 'false'
  ) {
    return 'boolean'
  }

  if (`${value}`.includes('public')) return 'file'
  if (value === null) return 'text'
  if (
    !Number.isNaN(parseInt(value)) &&
    !Number.isNaN(+value)
  )
    return 'number'

  return 'text'
}

const props = (object: any): TProp[] => {
  if (object === undefined) {
    return []
  }

  const passageProps: TProp[] = []

  const { pid } = object

  for (const [key, value] of Object.entries(object)) {
    if (EXCLUDED_PROPS.includes(key)) continue

    const type = getPropType(value)

    passageProps.push({
      name: key,
      value,
      type,
      pid
    })
  }

  return passageProps.sort((a, b) =>
    a.name.localeCompare(b.name)
  )
}

export {
  props,
}