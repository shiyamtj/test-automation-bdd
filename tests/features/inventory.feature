Feature: Inventory Management
  As a user
  I want to manage products in the inventory
  So that I can add items to the cart and logout

  @inventory @smoke
  Scenario: Add first product to cart and verify cart badge
    Given I am logged in with valid credentials
    When I add the first product to the cart
    Then the cart badge should show "1"

  @inventory @regression
  Scenario: Logout from inventory page
    Given I am logged in with valid credentials
    When I logout from the application
    Then I should be redirected to the login page
