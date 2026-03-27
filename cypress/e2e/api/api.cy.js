const ApiPage = require('../../support/pages/ApiPage');

describe('API — Authentication (/login)', () => {
  it('should authenticate with valid credentials and return a Bearer token', () => {
    ApiPage.login().then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('authorization').and.be.a('string');
      expect(response.body.authorization).to.match(/^Bearer\s.+/);
    });
  });

  it('should return 400 when email format is invalid', () => {
  cy.fixture('users').then(({ invalidUser }) => {
    ApiPage.login(invalidUser.email, invalidUser.password).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property('message');
    });
  });
});
  it('should return 401 when password is wrong', () => {
    ApiPage.login(Cypress.env('ADMIN_EMAIL'), 'wrong-password-xyz').then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property('message');
    });
  });
});

describe('API — Users (/usuarios)', () => {
  it('should list all users and verify the response structure', () => {
    ApiPage.getUsers().then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('quantidade').and.be.a('number');
      expect(res.body).to.have.property('usuarios').and.be.an('array');
    });
  });

  it('should filter users by name and return only matching results', () => {
    cy.fixture('users').then(({ validUser }) => {
      const email = `filter${Date.now()}@example.com`;
      const nome = `Filter User ${Date.now()}`;

      ApiPage.createUser({ ...validUser, nome, email }).then((res) => {
        expect(res.status).to.eq(201);
        const userId = res.body._id;

        ApiPage.getUsers({ nome })
          .then((filterRes) => {
            expect(filterRes.status).to.eq(200);
            expect(filterRes.body.usuarios).to.be.an('array');
            filterRes.body.usuarios.forEach((u) => {
              expect(u.nome).to.eq(nome);
            });
          })
          .then(() => {
            return ApiPage.deleteUser(userId);
          });
      });
    });
  });

  it('should register a new user and verify it is retrievable by id', () => {
    cy.fixture('users').then(({ validUser }) => {
      const email = `${validUser.emailPrefix}${Date.now()}@example.com`;

      ApiPage.createUser({ ...validUser, email })
        .then((res) => {
          expect(res.status).to.eq(201);
          expect(res.body).to.have.property('message', 'Cadastro realizado com sucesso');
          expect(res.body).to.have.property('_id').and.be.a('string');
          return res.body._id;
        })
        .then((userId) => {
          return ApiPage.getUserById(userId).then((getRes) => {
            expect(getRes.status).to.eq(200);
            expect(getRes.body.email).to.eq(email);
            expect(getRes.body.nome).to.eq(validUser.nome);
            return ApiPage.deleteUser(userId);
          });
        });
    });
  });

  it('should return 400 when registering a duplicate email', () => {
    cy.fixture('users').then(({ validUser }) => {
      const email = `duplicate${Date.now()}@example.com`;

      ApiPage.createUser({ ...validUser, email })
        .then((res) => {
          expect(res.status).to.eq(201);
          const userId = res.body._id;
          return ApiPage.createUser({ ...validUser, email }).then((dupRes) => {
            expect(dupRes.status).to.eq(400);
            expect(dupRes.body).to.have.property('message', 'Este email já está sendo usado');
            return ApiPage.deleteUser(userId);
          });
        });
    });
  });

  it('should delete a user by id and confirm it is removed', () => {
    cy.fixture('users').then(({ validUser }) => {
      const email = `delete${Date.now()}@example.com`;

      ApiPage.createUser({ ...validUser, email })
        .then((res) => {
          expect(res.status).to.eq(201);
          return res.body._id;
        })
        .then((userId) => {
          return ApiPage.deleteUser(userId).then((delRes) => {
            expect(delRes.status).to.eq(200);
            expect(delRes.body).to.have.property('message', 'Registro excluído com sucesso');
          });
        });
    });
  });

  it('should update a user name via PUT and verify the change', () => {
    cy.fixture('users').then(({ validUser }) => {
      const email = `put${Date.now()}@example.com`;

      ApiPage.createUser({ ...validUser, email })
        .then((res) => {
          expect(res.status).to.eq(201);
          return res.body._id;
        })
        .then((userId) => {
          const updatedName = 'Updated QA Name';
          return ApiPage.updateUser(userId, {
            nome: updatedName,
            email,
            password: validUser.password,
            administrador: validUser.administrador,
          }).then((putRes) => {
            expect(putRes.status).to.eq(200);
            expect(putRes.body).to.have.property('message', 'Registro alterado com sucesso');
            return ApiPage.getUserById(userId).then((getRes) => {
              expect(getRes.body.nome).to.eq(updatedName);
              return ApiPage.deleteUser(userId); 
            });
          });
        });
    });
  });
});

describe('API — Products (/produtos)', () => {
  let adminToken;

  beforeEach(() => {
    cy.apiLogin().then((token) => {
      adminToken = token;
    });
  });

  it('should list all products and verify the response structure', () => {
    ApiPage.getProducts().then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('quantidade').and.be.a('number');
      expect(res.body).to.have.property('produtos').and.be.an('array');
    });
  });

  it('should filter products by name and return only matching results', () => {
    cy.fixture('products').then(({ validProduct }) => {
      const productName = `Filter Product ${Date.now()}`;

      ApiPage.createProduct(
        {
          nome: productName,
          preco: validProduct.price,
          descricao: validProduct.description,
          quantidade: Number(validProduct.quantity),
        },
        adminToken
      )
        .then((res) => {
          expect(res.status).to.eq(201);
          return res.body._id;
        })
        .then((productId) => {
          return ApiPage.getProducts(adminToken, { nome: productName }).then((filterRes) => {
            expect(filterRes.status).to.eq(200);
            expect(filterRes.body.produtos).to.be.an('array');
            expect(filterRes.body.produtos).to.have.length.greaterThan(0);
            filterRes.body.produtos.forEach((p) => expect(p.nome).to.eq(productName));
            return ApiPage.deleteProduct(productId, adminToken); 
          });
        });
    });
  });

  it('should register a new product with valid token and verify it in the list', () => {
    cy.fixture('products').then(({ validProduct }) => {
      const productName = `${validProduct.name} ${Date.now()}`;

      ApiPage.createProduct(
        {
          nome: productName,
          preco: validProduct.price,
          descricao: validProduct.description,
          quantidade: Number(validProduct.quantity),
        },
        adminToken
      )
        .then((res) => {
          expect(res.status).to.eq(201);
          expect(res.body).to.have.property('message', 'Cadastro realizado com sucesso');
          expect(res.body).to.have.property('_id').and.be.a('string');
          return res.body._id;
        })
        .then((productId) => {
          return ApiPage.getProducts(adminToken).then((getRes) => {
            expect(getRes.status).to.eq(200);
            expect(getRes.body.produtos.some((p) => p._id === productId), 'product should appear in the list').to.be.true;
            return ApiPage.deleteProduct(productId, adminToken);
          });
        });
    });
  });

  it('should return 401 when registering a product without a token', () => {
    cy.fixture('products').then(({ validProduct }) => {
      ApiPage.createProduct({
        nome: validProduct.name,
        preco: validProduct.price,
        descricao: validProduct.description,
        quantidade: Number(validProduct.quantity),
      }).then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body).to.have.property('message');
      });
    });
  });

  it('should delete a product by id and confirm success', () => {
    cy.fixture('products').then(({ validProduct }) => {
      ApiPage.createProduct(
        {
          nome: `To Delete ${Date.now()}`,
          preco: validProduct.price,
          descricao: validProduct.description,
          quantidade: Number(validProduct.quantity),
        },
        adminToken
      )
        .then((res) => {
          expect(res.status).to.eq(201);
          return res.body._id;
        })
        .then((productId) => {
          return ApiPage.deleteProduct(productId, adminToken).then((delRes) => {
            expect(delRes.status).to.eq(200);
            expect(delRes.body).to.have.property('message', 'Registro excluído com sucesso');
          });
        });
    });
  });

  it('should update a product via PUT and verify the change', () => {
    cy.fixture('products').then(({ validProduct }) => {
      ApiPage.createProduct(
        {
          nome: `To Update ${Date.now()}`,
          preco: validProduct.price,
          descricao: validProduct.description,
          quantidade: Number(validProduct.quantity),
        },
        adminToken
      )
        .then((res) => {
          expect(res.status).to.eq(201);
          return res.body._id;
        })
        .then((productId) => {
          const updatedName = `Updated Product ${Date.now()}`;
          return ApiPage.updateProduct(
            productId,
            { nome: updatedName, preco: 199, descricao: 'Updated description', quantidade: 20 },
            adminToken
          ).then((putRes) => {
            expect(putRes.status).to.eq(200);
            expect(putRes.body).to.have.property('message', 'Registro alterado com sucesso');
            return ApiPage.getProducts(adminToken).then((getRes) => {
              const updated = getRes.body.produtos.find((p) => p._id === productId);
              expect(updated, 'updated product should exist in list').to.exist;
              expect(updated.nome).to.eq(updatedName);
              expect(updated.preco).to.eq(199);
              return ApiPage.deleteProduct(productId, adminToken);
            });
          });
        });
    });
  });
});
