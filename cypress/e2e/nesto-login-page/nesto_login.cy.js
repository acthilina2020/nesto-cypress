/// <reference types="cypress" />

describe("openning nesto login page and verifying the fetures", () => {
  beforeEach(() => {
    cy.visit("/", { retryOnNetworkFailure: true });
    Cypress.on("uncaught:exception", (err, runnable) => {
      return false;
    });
  });

  it("verify the url", () => {
    cy.url().should("include", "/login");
  });

  it("verify the title", () => {
    cy.title().should("include", "nesto");
  });

  it("verify nesto logo", () => {
    cy.get(".logocomponent__StyledImage-sc-1tre62t-1").should("be.visible");
  });

  it("verify login with valid username and password", () => {
    cy.login("#email", "acthilina@gmail.com", "#password", "Password123");
    cy.url().should("include", "/application/selection");
    cy.get("#dashboard_welcomeBack")
      .invoke("text")
      .then((welcome) => {
        // verify welcome message once logged in
        expect(welcome).equal("Welcome back");
      });
    cy.get(".iXqMaV")
      .invoke("text")
      .then((clientName) => {
        // verify logged in user's name
        expect(clientName).equal("Kasun");
      });
  });

  it("verify logout", () => {
    cy.login("#email", "acthilina@gmail.com", "#password", "Password123");
    cy.logout();
  });

  it("verify login with valid email and invalid password", () => {
    cy.login("#email", "acthilina@gmail.com", "#password", "invalidPassword");
    cy.get(".sc-bYwzuL").should("be.visible"); // error message pop up is displayed
    cy.get(".react-toast-notifications__toast__icon").should("be.visible"); // logo on error message is displayed
    cy.get("#toasts_invalidPassword_title")
      .invoke("text")
      .then((errorToastTitle) => {
        // verifying the first part of the error message on the pop up
        expect(errorToastTitle).equal(
          "Your email and/or your password is invalid."
        );
      });
    cy.get("#toasts_invalidPassword_message") //verifying the second part of the error message on the pop up
      .invoke("text")
      .should(
        "match",
        /Please check them and try again or click 'forgot password' to reset it./
      );
  });

  it("verify login with valid password and invalid email", () => {
    cy.login("#email", "invalidemail@gmail.com", "#password", "Password123");
    cy.get(".sc-bYwzuL").should("be.visible"); // error message pop up is displayed
    cy.get(".react-toast-notifications__toast__icon").should("be.visible"); // logo on error message is displayed
    cy.get("#toasts_invalidPassword_title")
      .invoke("text")
      .then((errorToastTitle) => {
        // verifying the first part of the error message on the pop up
        expect(errorToastTitle).equal(
          "Your email and/or your password is invalid."
        );
      });
    //Verifying errorToastMessage with regex
    cy.get("#toasts_invalidPassword_message")
      .invoke("text")
      .should(
        "match",
        /Please check them and try again or click 'forgot password' to reset it./
      );
  });

  it("verify login with empty email/password fields", () => {
    cy.get("#email").clear({ force: true });
    cy.get("#password").clear({ force: true });
    cy.get("#form_signup_login").click();
    cy.get(":nth-child(1) > .sc-hKFxyN > #validation_errors_isRequired")
      .invoke("text")
      .then((emailError) => {
        // verifying required error message for empty email
        expect(emailError).equal("Required");
      });
    cy.get(".hHUsYj > .sc-hKFxyN > #validation_errors_isRequired")
      .invoke("text")
      .then((passwordError) => {
        // verifying required error message for empty password
        expect(passwordError).equal("Required");
      });
  });

  it("verify forgot your password link", () => {
    cy.get("#form_signup_forgotPassword").click();
    cy.url().should("include", "/forgot");
    cy.get("#form_resetPassword_titleTop").should("be.visible");
  });

  it("verify sign up link", () => {
    cy.get("#loginPage_signUp > span").click();
    cy.url().should("include", "/signup");
    cy.get("#form_signup_createYourAccount").should("be.visible");
  });

  it("verify localization testing in french", () => {
    cy.get(".sc-jNnpgg > .sc-hKFxyN")
      .invoke("text")
      .then((frenchLanguage) => {
        expect(frenchLanguage).equal("FR"); // verifying the FR link
      });
    cy.get(".sc-jNnpgg > .sc-hKFxyN").click();
    cy.get("#userMenu_login")
      .invoke("text")
      .then((loginButtonInFrench) => {
        expect(loginButtonInFrench).equal("Connexion");
      }); //login button in FR
    cy.get("#form_login_title")
      .invoke("text")
      .then((titleInFrench) => {
        expect(titleInFrench).equal("Connectez-vous à votre compte");
      }); //title in FR
    //verify the image for FR
    cy.get(".fvcQsv")
      .find("img")
      .should("have.attr", "src")
      .should(
        "include",
        "/static/media/nesto_secure_logo_fr_mobile.49975870.png"
      );
  });
});
