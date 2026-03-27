class BasePage {
  visit(path = '/') {
    cy.visit(path);
  }
}

module.exports = BasePage;
