class ListUsersPage {
  visit() {
    cy.visit('/admin/listarusuarios');
  }

  findByNameColumn(name) {
    return cy.contains('table tr td', name).closest('tr');
  }

  shouldShowUserByName(name) {
    this.findByNameColumn(name).should('exist');
  }

  shouldNotShowUserByName(name) {
    cy.contains('table tr td', name).should('not.exist');
  }
}

module.exports = new ListUsersPage();
