const API_URL = () => Cypress.env('API_URL') || 'https://serverest.dev';

class ApiPage {
  login(
    email = Cypress.env('ADMIN_EMAIL'),
    password = Cypress.env('ADMIN_PASSWORD')
  ) {
    return cy.request({
      method: 'POST',
      url: `${API_URL()}/login`,
      failOnStatusCode: false,
      body: { email, password },
    });
  }

  createUser({ nome, email, password, administrador = 'true' }) {
    return cy.request({
      method: 'POST',
      url: `${API_URL()}/usuarios`,
      failOnStatusCode: false,
      body: { nome, email, password, administrador },
    });
  }

  getUsers(queryParams = {}) {
    return cy.request({
      method: 'GET',
      url: `${API_URL()}/usuarios`,
      qs: queryParams,
    });
  }

  getUserById(id, token) {
    return cy.request({
      method: 'GET',
      url: `${API_URL()}/usuarios/${id}`,
      headers: token ? { Authorization: token } : {},
    });
  }

  updateUser(id, { nome, email, password, administrador }, token) {
    return cy.request({
      method: 'PUT',
      url: `${API_URL()}/usuarios/${id}`,
      failOnStatusCode: false,
      headers: token ? { Authorization: token } : {},
      body: { nome, email, password, administrador },
    });
  }

  deleteUser(id, token) {
    return cy.request({
      method: 'DELETE',
      url: `${API_URL()}/usuarios/${id}`,
      failOnStatusCode: false,
      headers: token ? { Authorization: token } : {},
    });
  }

  createProduct({ nome, preco, descricao, quantidade }, token) {
    return cy.request({
      method: 'POST',
      url: `${API_URL()}/produtos`,
      failOnStatusCode: false,
      headers: token ? { Authorization: token } : {},
      body: { nome, preco, descricao, quantidade },
    });
  }

  getProducts(token, queryParams = {}) {
    return cy.request({
      method: 'GET',
      url: `${API_URL()}/produtos`,
      qs: queryParams,
      headers: token ? { Authorization: token } : {},
    });
  }

  updateProduct(id, { nome, preco, descricao, quantidade }, token) {
    return cy.request({
      method: 'PUT',
      url: `${API_URL()}/produtos/${id}`,
      failOnStatusCode: false,
      headers: token ? { Authorization: token } : {},
      body: { nome, preco, descricao, quantidade },
    });
  }

  deleteProduct(id, token) {
    return cy.request({
      method: 'DELETE',
      url: `${API_URL()}/produtos/${id}`,
      failOnStatusCode: false,
      headers: token ? { Authorization: token } : {},
    });
  }
}

module.exports = new ApiPage();
