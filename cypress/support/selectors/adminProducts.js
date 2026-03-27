const ADMIN_PRODUCTS = {
  nameInput:        '[data-cy="product-name"], input[name="nome"]',
  priceInput:       '[data-cy="product-price"], input[name="preco"], [data-testid="preco"]',
  descriptionInput: '[data-cy="product-description"], textarea[name="descricao"], [data-testid="descricao"]',
  quantityInput:    '[data-cy="product-quantity"], input[name="quantidade"], [data-testid="quantity"]',
  imageInput:       '[data-cy="product-image"], input[type="file"]',
  submitBtn:        '[data-cy="product-submit"], button[data-cy="product-submit"], button:contains("Cadastrar"), [data-testid="cadastarProdutos"]',
  deleteBtn:        '.btn.btn-danger',
};

module.exports = { ADMIN_PRODUCTS };