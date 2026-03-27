const { ADMIN_PRODUCTS } = require('../selectors/adminProducts');

class AdminProductsPage {
  fillForm({ name, price, description, quantity, image } = {}) {
    if (name) {
      cy.get(ADMIN_PRODUCTS.nameInput).clear().type(name)
        .should('have.value', name);
    }
    if (price !== undefined) {
      const priceStr = String(Math.floor(price));
      cy.get(ADMIN_PRODUCTS.priceInput).clear()
        .type(priceStr)
        .should('have.value', priceStr);
    }
    if (description) {
      cy.get(ADMIN_PRODUCTS.descriptionInput).clear()
        .type(description)
        .should('have.value', description);
    }
    if (quantity) {
      cy.get(ADMIN_PRODUCTS.quantityInput).clear()
        .type(quantity)
        .should('have.value', quantity);
    }
    if (image) {
      cy.get(ADMIN_PRODUCTS.imageInput).selectFile(`cypress/fixtures/${image}`);
    }
  }

  submit() {
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="product-submit"]').length) {
        cy.get('[data-cy="product-submit"]').click();
      } else {
        cy.get('button').contains('Cadastrar').click();
      }
    });
  }

  shouldShowSuccess() {
    cy.contains('Cadastro realizado com sucesso').should('be.visible');
  }
  deleteProductByName(name) {
  cy.contains('tr', name)
    .find(ADMIN_PRODUCTS.deleteBtn)
    .click();
}
}

module.exports = new AdminProductsPage();
