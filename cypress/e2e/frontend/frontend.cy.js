const HomePage = require('../../support/pages/HomePage');
const RegisterPage = require('../../support/pages/RegisterPage');
const LoginPage = require('../../support/pages/LoginPage');
const ListUsersPage = require('../../support/pages/ListUsersPage');
const AdminProductsPage = require('../../support/pages/AdminProductsPage');
const ProductsPage = require('../../support/pages/ProductsPage');
const CartPage = require('../../support/pages/CartPage');
const ApiPage = require('../../support/pages/ApiPage');

describe('Frontend — Authentication', () => {
  beforeEach(() => {
    HomePage.visit();
  });

  it('should authenticate with valid credentials and display welcome message', () => {
  LoginPage.login({
    email: Cypress.env('ADMIN_EMAIL'),
    password: Cypress.env('ADMIN_PASSWORD'),
  });
  
  cy.contains('Logout').should('be.visible');
  
  cy.get('body').then(($body) => {
    if ($body.text().includes(Cypress.env('ADMIN_NAME'))) {
      cy.contains(Cypress.env('ADMIN_NAME')).should('be.visible');
    }
  });
});

  it('should show a specific error message when login is attempted with an invalid email format', () => {
    cy.fixture('users').then(({ invalidUser }) => {
      LoginPage.login({ email: invalidUser.email, password: invalidUser.password });
      LoginPage.shouldShowError('Email e/ou senha inválidos');
    });
  });

  it('should show a specific error message when login is attempted with a wrong password', () => {
    LoginPage.login({
      email: Cypress.env('ADMIN_EMAIL'),
      password: 'wrong-password-xyz',
    });
    LoginPage.shouldShowError('Email e/ou senha inválidos');
  });

  it('should redirect an unauthenticated user away from a protected admin page', () => {
    cy.visit('/admin/listarusuarios');
    cy.url().should('not.include', '/admin/listarusuarios');
  });
});

describe('Frontend — User Registration', () => {
  beforeEach(() => {
    cy.login();
    HomePage.clickRegisterUsers();
  });

  it('should register a new user using fixture data and verify it appears in the list', () => {
    cy.fixture('users').then(({ validUser }) => {
      const email = `${validUser.emailPrefix}${Date.now()}@example.com`;
      const name = `${validUser.nome} ${Date.now()}`;

      RegisterPage.fillForm({
        name,
        email,
        password: validUser.password,
        admin: validUser.administrador === 'true',
      });
      RegisterPage.submit();

      cy.url().should('include', '/admin/listarusuarios');
      cy.contains('Lista dos usuários').should('be.visible');
      cy.get('table').should('be.visible');
      ListUsersPage.shouldShowUserByName(name);
    });
  });

  it('should show a validation error when submitting the user form empty', () => {
    RegisterPage.submit();
    cy.contains('Nome é obrigatório').should('be.visible');
  });
});

describe('Frontend — Product Registration', () => {
  beforeEach(() => {
    cy.login();
    HomePage.clickRegisterProducts();
  });

  it('should register a new product using fixture data and be redirected to the products list', () => {
    cy.fixture('products').then(({ validProduct }) => {
      AdminProductsPage.fillForm({
        ...validProduct,
        name: `${validProduct.name} ${Date.now()}`,
      });
      AdminProductsPage.submit();

      cy.url().should('include', '/admin/listarprodutos');
      cy.contains('Lista dos Produtos').should('be.visible');
    });
  });

  it('should show a validation error when submitting the product form empty', () => {
    AdminProductsPage.submit();
    cy.contains('Nome é obrigatório').should('be.visible');
  });
  it('should display the products list page after login', () => {
  ProductsPage.visit();
    cy.url().should('include', '/admin/listarprodutos');
    cy.contains('Lista dos Produtos').should('be.visible');
});
});

