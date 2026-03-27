const { CART } = require('../selectors/products');

class CartPage {
  visit() {
    cy.visit('/carrinho');
  }

  shouldBeOnCartPage() {
    cy.url().should('include', '/carrinho');
  }

  shouldHaveItem(productName) {
    cy.contains(productName).should('be.visible');
  }

  shouldBeEmpty() {
    cy.contains('Seu carrinho está vazio').should('be.visible');
  }

  checkout() {
    cy.contains('button', 'Finalizar Compra').click();
  }
}

module.exports = new CartPage();
