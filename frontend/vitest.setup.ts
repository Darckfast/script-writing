import { randomFillSync } from 'crypto'

const LocalStorageMock = {
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

globalThis.localStorage = LocalStorageMock
globalThis.window = Object.create({})
Object.defineProperty(window, 'location', {
  value: {
    pathname: '',
  },
})

globalThis.crypto ||= Object.create({
  randomUUID: () => 'test',
})

globalThis.window.crypto ||= Object.create({
  getRandomValues: (buffer: any) => randomFillSync(buffer),
})
