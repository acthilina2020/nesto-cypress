Cypress.Commands.add("login", (username,email,password,passwordValue) => {
    cy.get(username).type(email);
    cy.get(password).type(passwordValue);
    cy.get("#form_signup_login").click();
    cy.wait(2000);
  });

Cypress.Commands.add("logout", () => {
  cy.get("#nav_logout").click();
  cy.url().should("include", "/login");
  cy.get("#form_signup_login").should("be.visible");
});
