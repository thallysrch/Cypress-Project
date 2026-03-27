const { AUTH } = require('../selectors/auth');

class LoginPage {
  visit() {
    cy.visit('/');
  }

  login({ email, password }) {
    cy.get(AUTH.emailInput).clear().type(email);
    cy.get(AUTH.passwordInput).clear().type(password);
    cy.get(AUTH.submitBtn).click();
  }

  shouldGreet(name) {
    cy.contains(name).should('be.visible');
  }

  shouldShowError(messagePattern) {
    cy.get('form').contains(messagePattern).should('be.visible');
  }
}

module.exports = new LoginPage();
