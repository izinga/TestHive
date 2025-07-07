package com.testhive.tests;

import com.testhive.base.BaseTest;
import com.testhive.pages.LoginPage;
import com.testhive.pages.ProductsPage;
import com.testhive.pages.ProductDetailPage;
import com.testhive.pages.CartPage;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class ProductTests extends BaseTest {

    private ProductsPage productsPage;

    // This method runs before each test in this class
    @BeforeMethod
    public void loginAndGoToProductsPage() {
        LoginPage loginPage = new LoginPage(driver);
        // We log in to ensure we start on the products page for each test
        productsPage = loginPage.login("devicelab", "robustest");
    }

    @Test(description = "TC-PROD-01: Verify that all products are listed on the page after a successful login.")
    public void verifyProductListIsDisplayed() {
        // A simple check to see if a known product is visible
        Assert.assertTrue(productsPage.isProductDisplayed("Appium"), "Appium product was not found in the list.");
        Assert.assertTrue(productsPage.isProductDisplayed("Selenium"), "Selenium product was not found in the list.");
    }

    @Test(description = "TC-PROD-02: Verify search functionality with a valid term.")
    public void verifySearchFiltersProducts() {
        productsPage.searchForProduct("Maestro");
        Assert.assertTrue(productsPage.isProductDisplayed("Maestro"), "Maestro product was not found after search.");
        Assert.assertFalse(productsPage.isProductDisplayed("Appium"), "Appium product was still visible after searching for Maestro.");
    }

    @Test(description = "TC-PROD-03: Verify 'No products found' message for invalid search.")
    public void verifyNoProductsFoundMessage() {
        productsPage.searchForProduct("nonexistentproduct");
        Assert.assertTrue(productsPage.isNoProductsFoundMessageDisplayed(), "'No products found' message was not displayed.");
    }

    @Test(description = "TC-PROD-04: Verify 'Add' button changes to quantity control.")
    public void verifyAddToCartButtonChanges() {
        productsPage.clickAddButton("Appium");
        Assert.assertTrue(productsPage.isQuantityControlDisplayed("Appium"), "Quantity control was not displayed after adding the item.");
    }

    @Test(description = "TC-PROD-05: Verify cart badge updates correctly.")
    public void verifyCartBadgeUpdates() {
        Assert.assertFalse(productsPage.isCartBadgeDisplayed(), "Cart badge was visible before adding items.");
        productsPage.clickAddButton("Cypress");
        Assert.assertTrue(productsPage.isCartBadgeDisplayed(), "Cart badge was not visible after adding an item.");
        Assert.assertEquals(productsPage.getCartBadgeCount(), "1", "Cart badge count is not correct.");
    }

    @Test(description = "TC-PROD-06: Verify increasing item quantity.")
    public void verifyIncreaseQuantity() {
        productsPage.clickAddButton("Playwright");
        productsPage.clickIncreaseQuantity("Playwright");
        Assert.assertEquals(productsPage.getQuantityText("Playwright"), "2", "Quantity did not increase to 2.");
        Assert.assertEquals(productsPage.getCartBadgeCount(), "2", "Cart badge count did not update to 2.");
    }

    @Test(description = "TC-PROD-07: Verify decreasing item quantity.")
    public void verifyDecreaseQuantity() {
        productsPage.clickAddButton("Jest");
        productsPage.clickAddButton("Jest"); // Quantity is now 2
        productsPage.clickDecreaseQuantity("Jest");
        Assert.assertEquals(productsPage.getQuantityText("Jest"), "1", "Quantity did not decrease to 1.");
        Assert.assertEquals(productsPage.getCartBadgeCount(), "1", "Cart badge count did not update to 1.");
    }

    @Test(description = "TC-PROD-08: Verify navigation to product detail page.")
    public void verifyNavigationToProductDetail() {
        ProductDetailPage detailPage = productsPage.selectProduct("Espresso");
        Assert.assertTrue(detailPage.isPageDisplayed(), "Did not navigate to the Product Detail page.");
    }

    @Test(description = "TC-PROD-09: Verify navigation to cart page.")
    public void verifyNavigationToCart() {
        CartPage cartPage = productsPage.clickCartIcon();
        Assert.assertTrue(cartPage.isPageDisplayed(), "Did not navigate to the Cart page.");
    }
}
