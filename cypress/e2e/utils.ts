export const getComponent = (id = '', type = 'button') =>
  cy.get(`${type}[data-test="${id}"]`)
