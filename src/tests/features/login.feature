Feature: Keycloak Admin Console Authentication
  As a Keycloak administrator
  I want to be able to log in to the admin console
  So that I can manage users, realms, and configurations

  Scenario: Successful login with admin credentials
    Given User navigates to the application
    When I enter the username as "admin"
    And I enter the password as "password"
    And I click on login button
    Then User should logged in successfully
    And Logout from the application

  @negative
  Scenario: Login attempt with invalid credentials
    Given User navigates to the application
    When I enter the username as "invaliduser"
    And I enter the password as "wrongpassword"
    And I click on login button
    Then I should see an error message