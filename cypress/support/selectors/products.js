const PRODUCTS = {
  listarProdutosBtn: '[data-testid="listar-produtos"]',
  addToCartBtn:    '[data-cy="add-to-cart"], button:contains("Adicionar ao carrinho")',
};

const CART = {
  cartItem:        '[data-cy="cart-item"], table tr td',
  emptyMessage:    '[data-cy="cart-empty"]',
  checkoutBtn:     '[data-cy="checkout"], button:contains("Finalizar Compra")',
};

module.exports = { PRODUCTS, CART };

