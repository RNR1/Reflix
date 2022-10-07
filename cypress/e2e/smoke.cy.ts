import { faker } from "@faker-js/faker";

describe("smoke tests", () => {
  it("should allow you to register and login", () => {
    const loginForm = {
      username: `${faker.internet.userName()}`,
      avatar: faker.internet.avatar(),
    };
    cy.then(() => ({ username: loginForm.username })).as("user");

    cy.visitAndCheck("/");
    cy.findByRole("link", { name: /create profile/i }).click();

    cy.findByRole("textbox", { name: /name/i }).type(loginForm.username);
    cy.findByRole("textbox", { name: /avatar/i }).type(loginForm.avatar);
    cy.findByRole("button", { name: /create profile/i }).click();

    cy.findByRole("link", {
      name: /enter as/i,
      timeout: 1000 * 15,
    }).click();
    cy.findByRole("button", { name: /logout/i }).click();
    cy.findByRole("link", { name: /go to profiles/i, timeout: 1000 * 15 });
  });

  it("should allow you to enter the movies screen", () => {
    cy.login();
    cy.visitAndCheck("/");

    cy.findByRole("link", { name: /enter as/i }).click({
      timeout: 1000 * 15,
    });
    cy.findByText("No movies yet");
  });
});
