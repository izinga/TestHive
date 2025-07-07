package com.testhive.tests;

import com.testhive.base.BaseTest;
import com.testhive.pages.LoginPage;
import com.testhive.pages.ProductsPage;
import com.testhive.pages.CartPage;
import com.testhive.pages.CheckoutPage;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class CartTests extends BaseTest {

    private ProductsPage productsPage;
    private CartPage cartPage;

    @BeforeMethod
    public void setupCartTests() {
        LoginPage loginPage = new LoginPage(driver);
        productsPage = loginPage.login("devicelab", "robustest");
    }

    @Test(description = "TC-CART-01: Verify that added items are correctly listed in the cart.")
    public void verifyItemsListedInCart() {
        productsPage.clickAddButton("Appium");
        productsPage.clickAddButton("Maestro");
        cartPage = productsPage.clickCartIcon();

        Assert.assertTrue(cartPage.isItemInCart("Appium"), "Appium is not listed in the cart.");
        Assert.assertTrue(cartPage.isItemInCart("Maestro"), "Maestro is not listed in the cart.");
    }

    @Test(description = "TC-CART-02: Verify that the total cost for each item line is calculated correctly.")
    public void verifyLineItemTotal() {
        productsPage.clickAddButton("Appium");
        productsPage.clickAddButton("Appium"); // Add a second time to check quantity
        cartPage = productsPage.clickCartIcon();

        Assert.assertEquals(cartPage.getLineItemText("Appium"), "$7.50 x 2 = $15.00", "Appium line item total is incorrect.");
    }

    @Test(description = "TC-CART-03: Verify that the grand total for all items is calculated correctly.")
    public void verifyGrandTotal() {
        productsPage.clickAddButton("Appium"); // 7.50
        productsPage.clickAddButton("Maestro"); // 5.99
        cartPage = productsPage.clickCartIcon();

        Assert.assertEquals(cartPage.getGrandTotal(), "Total: $13.49", "Grand total is incorrect.");
    }

    @Test(description = "TC-CART-04: Verify that the quantity controls on the cart page work correctly.")
    public void verifyCartQuantityControls() {
        productsPage.clickAddButton("Cypress"); // Add 1
        cartPage = productsPage.clickCartIcon();

        // Increase quantity from within the cart
        cartPage.clickIncreaseQuantity("Cypress");
        Assert.assertEquals(cartPage.getQuantityText("Cypress"), "2", "Quantity did not increase to 2 in the cart.");
        Assert.assertEquals(cartPage.getGrandTotal(), "Total: $16.20", "Grand total did not update after increasing quantity.");

        // Decrease quantity from within the cart
        cartPage.clickDecreaseQuantity("Cypress");
        Assert.assertEquals(cartPage.getQuantityText("Cypress"), "1", "Quantity did not decrease to 1 in the cart.");
        Assert.assertEquals(cartPage.getGrandTotal(), "Total: $8.10", "Grand total did not update after decreasing quantity.");
    }

    @Test(description = "TC-CART-05: Verify 'Your cart is empty' message.")
    public void verifyEmptyCartMessage() {
        // Go to cart without adding items
        cartPage = productsPage.clickCartIcon();
        Assert.assertTrue(cartPage.isCartEmptyMessageDisplayed(), "'Your cart is empty' message was not displayed.");
    }

    @Test(description = "TC-CART-06: Verify navigation to the checkout address page.")
    public void verifyNavigationToCheckout() {
        productsPage.clickAddButton("TestNG");
        cartPage = productsPage.clickCartIcon();
        CheckoutPage checkoutPage = cartPage.clickCheckoutButton();

        // Verify we are on the address page by checking for its title
        Assert.assertTrue(checkoutPage.isAddressPageDisplayed(), "Did not navigate to the Address page for checkout.");
    }
}
