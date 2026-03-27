const { REGISTER } = require('../selectors/register');

class RegisterPage {
  fillForm({ name, email, password, admin } = {}) {
    if (name) cy.get(REGISTER.nameInput).clear().type(name);
    if (email) cy.get(REGISTER.emailInput).clear().type(email);
    if (password) cy.get(REGISTER.passwordInput).clear().type(password);
    if (admin !== undefined) {
      const checkbox = cy.get(REGISTER.adminCheckbox);
      if (admin) checkbox.check();
      else checkbox.uncheck();
    }
  }

  submit() {
    cy.get(REGISTER.submitBtn).click();
  }

  shouldShowSuccess() {
    cy.contains('Cadastro realizado com sucesso').should('be.visible');
  }
}

module.exports = new RegisterPage();
