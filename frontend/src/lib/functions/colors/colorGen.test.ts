import { describe, expect, it } from 'vitest'
import { genColor } from './colorGen'

describe('genColor func', () => {
  it('given a string, should return a hex color', () => {
    const color = genColor('my-string')

    expect(color).not.toBeUndefined()
    expect(color).toContain('#')
  })

  it('given no string, should return a hex white color', () => {
    const color = genColor()

    expect(color).toBe('#fff')
  })
})
