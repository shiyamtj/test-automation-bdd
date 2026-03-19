Feature: Cart functionality
  As a user
  I want to manage items in my shopping cart
  So that I can add and remove products before checkout

  @cart @smoke
  Scenario: Add multiple items to cart and verify count
    Given I am logged in with valid credentials
    When I add product 0 to the cart
    And I add product 1 to the cart
    Then the cart badge should show 2

  @cart @regression
  Scenario: Remove an item from cart and verify count
    Given I am logged in with valid credentials
    When I add product 0 to the cart
    And I add product 1 to the cart
    And I remove product 0 from the cart
    Then the cart badge should show 1
