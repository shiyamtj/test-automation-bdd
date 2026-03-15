import { World, IWorldOptions } from "@cucumber/cucumber";
import { Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";

/**
 * Custom World class for Cucumber
 * Extends Cucumber's World to provide fixtures (page objects and browser context)
 * accessible via `this` in step definitions
 */
export class CustomWorld extends World {
  public page!: Page;
  public loginPage!: LoginPage;
  public inventoryPage!: InventoryPage;

  constructor(options: IWorldOptions) {
    super(options);
  }
}
