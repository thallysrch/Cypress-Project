const { AUTH } = require('./selectors/auth');
const ApiPage = require('./pages/ApiPage');

Cypress.Commands.add('login', (
  email = Cypress.env('ADMIN_EMAIL'),
  password = Cypress.env('ADMIN_PASSWORD')
) => {
  cy.visit('/');
  cy.get(AUTH.emailInput).type(email);
  cy.get(AUTH.passwordInput).type(password);
  cy.get(AUTH.submitBtn).click();
});

Cypress.Commands.add('apiLogin', (
  email = Cypress.env('ADMIN_EMAIL'),
  password = Cypress.env('ADMIN_PASSWORD')
) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('API_URL')}/login`,
    body: { email, password },
  }).then((response) => {
    expect(response.status).to.eq(200);
    return response.body.authorization;
  });
});

Cypress.Commands.add('loginBySession', (
  email = Cypress.env('ADMIN_EMAIL'),
  password = Cypress.env('ADMIN_PASSWORD')
) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('API_URL')}/login`,
    body: { email, password },
  }).then((response) => {
    const token = response.body.authorization;
    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.setItem('serverest/userToken', token);
      win.localStorage.setItem('serverest/userEmail', email);
      win.localStorage.setItem('serverest/userName', Cypress.env('ADMIN_NAME'));
    });
    cy.reload();
  });
});
Cypress.Commands.add('createAdminSession', () => {
  const email = `admin${Date.now()}@qa.test`;
  const password = 'Senha123!';

  return ApiPage.createUser({ nome: 'QA Admin', email, password, administrador: 'true' })
    .then((res) => {
      expect(res.status).to.eq(201);
      const userId = res.body._id;
      return ApiPage.login(email, password).then((loginRes) => {
        expect(loginRes.status).to.eq(200);
        return { token: loginRes.body.authorization, userId };
      });
    });
});
