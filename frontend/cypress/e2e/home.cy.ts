import { getComponent } from './utils'

const mockStory = {
  ifid: '5e3d4e94-7462-4313-b823-094b088fa052',
  passages: [
    {
      isTrusted: true,
      parentPid: '',
      pid: '8f5557c7-921c-45fe-8f1e-83719816a375',
      name: 1,
      cleanText: '',
      links: []
    }
  ],
  createdWith: 'dev',
  storyName: 'Test'
}

describe('home page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5177')
  })

  it('check buttons', () => {
    getComponent('btn-create-story').should(
      'have.text',
      '+ story'
    )
    getComponent('btn-export-story').should(
      'have.text',
      '> generate bundle'
    )
    getComponent('a-config', 'a').should(
      'have.text',
      '$ configurations'
    )
    getComponent('btn-sync-story').should(
      'have.text',
      '= sync'
    )
  })

  it('create new story from button', () => {
    getComponent('input-story-name', 'input').type(
      'new story'
    )
    getComponent('btn-create-story').click()
    getComponent('a-story-node-0').should(
      'have.text',
      'new story'
    )
  })

  it('delete story', () => {
    getComponent('input-story-name', 'input').type(
      'new story'
    )
    getComponent('btn-create-story').click()

    getComponent('btn-delete-story').click()
    getComponent('btn-delete-story').click()
    getComponent('a-story-node-0').should('not.exist')
  })

  it('copy story', () => {
    getComponent('input-story-name', 'input').type(
      'new story'
    )
    getComponent('btn-create-story').click()
    getComponent('btn-export-story').click()
  })
})
