Feature: Keycloak Admin Console Navigation
  As a Keycloak administrator
  I want to be able to navigate the admin console after login
  So that I can view server information and manage the system

  Background:
    Given User navigates to the application
    When I enter the username from config
    And I enter the password from config
    And I click on login button
    Then User should logged in successfully

  Scenario: View server info on the console page
    Given the user has logged in to the admin console
    When I navigate to the server info section
    Then I should be able to view the server information
    And I should see the Keycloak version details
    And I should see the server status information

  Scenario: Navigate to realm settings
    Given the user has logged in to the admin console
    When I navigate to realm settings
    Then I should see the realm configuration options
    And I should be able to view general settings

  Scenario: Access user management
    Given the user has logged in to the admin console
    When I navigate to users section
    Then I should see the users management page
    And I should be able to view the users list
