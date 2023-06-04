import { clearMocks, mockIPC } from '@tauri-apps/api/mocks'
import { randomFillSync } from 'crypto'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { load, loadV2, save, saveV2 } from './loadSave'
/**
 * @vitest-environment jsdom
 */
describe('loadSave lib', () => {
  const fixtures = {
    mockJson: {
      a: 1,
      b: true,
      c: [1, 2, 3, 4],
      d: 'hello',
      e: () => null,
    },
    writeFile: (content: string) => {
      global.localStorage.setItem('success', content)
    },
    readFile: () => {
      return global.localStorage.getItem('success')
    },
    createDir: () => {
      return true
    },
    readTextFile: () => {
      return global.localStorage.getItem('success')
    },
  }
  beforeAll(() => {
    globalThis.crypto ||= {
      ...globalThis.crypto,
    }

    globalThis.crypto.getRandomValues = function (buffer) {
      return randomFillSync(buffer as any)
    }

    globalThis.localStorage = {
      state: {},
      setItem(key, item) {
        this.state[key] = item
      },
      getItem(key) {
        return this.state[key]
      },
      length: 0,
      key(index) {
        return this.state[index]
      },
      removeItem(key) {
        delete this.state[key]
      },
      clear() {
        this.state = {}
      },
    }
  })

  beforeEach(() => {
    mockIPC((_, args) => {
      const {
        message: { cmd, contents, options },
      } = args as any

      expect(options.dir).toBe(22)

      if (contents) return fixtures[cmd](String.fromCharCode(...contents))

      return fixtures[cmd]()
    })
  })

  afterEach(() => {
    clearMocks()
    global.localStorage.clear()
  })

  it('save v1 - standard input', () => {
    const valueSave = save({ key: 'testing', value: { a: 1, b: true } })

    expect(valueSave).not.toBeUndefined()
    expect(valueSave).toContain('true')
    expect(valueSave).toContain('1')
  })

  it('save v1 - no input', () => {
    const valueSave = save({ key: 'testing', value: undefined })

    expect(valueSave).toBeUndefined()
  })

  it('save v2 - standard input', async () => {
    await expect(
      saveV2({ key: 'success', value: fixtures.mockJson })
    ).resolves.toEqual(JSON.stringify(fixtures.mockJson))
  })

  it('save v2 fallback - standard input', async () => {
    await expect(
      saveV2({ key: 'error', value: fixtures.mockJson })
    ).resolves.toEqual(JSON.stringify(fixtures.mockJson))
  })

  it('load v1  - standard', () => {
    save({ key: 'success', value: 'my-super-string' })

    const value = load({ key: 'success' })

    expect(value).toBe('my-super-string')
  })

  it('load v1  - no value saved', () => {
    const value = load({ key: 'success', defaultValue: false })

    expect(value).toBeFalsy()
  })

  it('load v2 - standard', async () => {
    await saveV2({ key: 'success', value: 'my-string' })

    const value = await loadV2({ key: 'success' })

    expect(value).toBe('my-string')
  })
})
