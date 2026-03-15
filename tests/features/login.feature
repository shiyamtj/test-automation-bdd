Feature: SauceDemo Login
  As a user
  I want to log in to the SauceDemo application
  So that I can access the inventory page

  @smoke @login
  Scenario: Successful login with valid credentials
    Given I navigate to the SauceDemo login page
    When I enter username "standard_user"
    And I enter password "secret_sauce"
    And I click the login button
    Then I should be redirect to the inventory page
    And I should see the products list

  @login @regression
  Scenario: Login fails with invalid credentials
    Given I navigate to the SauceDemo login page
    When I enter username "invalid_user"
    And I enter password "wrong_password"
    And I click the login button
    Then I should see an error message
    And the error message should contain "Username and password do not match"

  @login @regression
  Scenario: Login fails with empty username
    Given I navigate to the SauceDemo login page
    When I leave the username field empty
    And I enter password "secret_sauce"
    And I click the login button
    Then I should see an error message
    And the error message should contain "Username is required"
