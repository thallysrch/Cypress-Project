const { PRODUCTS } = require('../selectors/products');

class ProductsPage {
  visit() {
    cy.get(PRODUCTS.listarProdutosBtn).click();
  }

  shouldBeOnProductsPage() {
    cy.url().should('include', '/admin/listarprodutos');
    cy.contains('Lista dos Produtos').should('be.visible');
  }

  addFirstProductToCart() {
    cy.contains('button', 'Adicionar ao carrinho').first().click();
  }

  addProductToCartByName(name) {
    cy.contains('table tr', name)
      .find('button')
      .contains('Adicionar ao carrinho')
      .click();
  }

  shouldShowProduct(name) {
    cy.contains(name).should('be.visible');
  }
}

module.exports = new ProductsPage();