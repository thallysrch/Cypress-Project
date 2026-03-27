const BasePage = require('./BasePage');

class HomePage extends BasePage {
  visit() {
    super.visit('/');
  }

  clickNav(label) {
    cy.contains('a, button', label).click();
  }

  clickRegisterUsers() {
    this.clickNav('Cadastrar Usuários');
  }
  clickListUsers() {
    this.clickNav('Listar Usuários');
  }
  clickRegisterProducts() {
    this.clickNav('Cadastrar Produtos');
  }
  clickListProducts() {
    this.clickNav('Listar Produtos');
  }
}

module.exports = new HomePage();
