package com.testhive.tests;

import com.testhive.base.BaseTest;
import com.testhive.pages.LoginPage;
import com.testhive.pages.ProductsPage;
import com.testhive.pages.CartPage;
import com.testhive.pages.CheckoutPage;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class CheckoutTests extends BaseTest {

    private ProductsPage productsPage;
    private CartPage cartPage;
    private CheckoutPage checkoutPage;

    @BeforeMethod
    public void setupCheckoutTests() {
        LoginPage loginPage = new LoginPage(driver);
        productsPage = loginPage.login("devicelab", "robustest");
        productsPage.clickAddButton("Appium"); // Add an item to the cart
        cartPage = productsPage.clickCartIcon();
        checkoutPage = cartPage.clickCheckoutButton();
    }

    @Test(description = "TC-CHECKOUT-01, 03, 05: Verify successful end-to-end checkout flow.")
    public void verifySuccessfulCheckoutFlow() {
        // Address Page
        Assert.assertTrue(checkoutPage.isAddressPageDisplayed(), "Address page is not displayed.");
        checkoutPage.fillAddress("123 Test St", "Automation City", "12345");
        checkoutPage.clickNextToPayment();

        // Payment Page
        Assert.assertTrue(checkoutPage.isPaymentPageDisplayed(), "Payment page is not displayed.");
        checkoutPage.fillPayment("4111111111111111");
        checkoutPage.clickPayNow();

        // Success Page
        Assert.assertTrue(checkoutPage.isSuccessScreenDisplayed(), "Checkout success screen is not displayed.");
    }

    @Test(description = "TC-CHECKOUT-02: Verify 'Next: Payment' button is disabled until form is complete.")
    public void verifyNextButtonIsDisabledForIncompleteAddress() {
        Assert.assertFalse(checkoutPage.isNextButtonEnabled(), "'Next' button is enabled before filling the address form.");

        checkoutPage.enterAddress("123 Test St");
        checkoutPage.enterCity("Automation City");
        checkoutPage.enterZip("12345");

        Assert.assertTrue(checkoutPage.isNextButtonEnabled(), "'Next' button is not enabled after filling the address form.");
    }

    @Test(description = "TC-CHECKOUT-04: Verify 'Pay Now' button is disabled until form is complete.")
    public void verifyPayNowButtonIsDisabledForIncompletePayment() {
        // First, get to the payment page
        checkoutPage.fillAddress("123 Test St", "Automation City", "12345");
        checkoutPage.clickNextToPayment();

        Assert.assertTrue(checkoutPage.isPaymentPageDisplayed(), "Did not navigate to payment page.");
        Assert.assertFalse(checkoutPage.isPayNowButtonEnabled(), "'Pay Now' button is enabled before filling the payment form.");

        checkoutPage.enterCardNumber("4111111111111111");
        Assert.assertTrue(checkoutPage.isPayNowButtonEnabled(), "'Pay Now' button is not enabled after filling the payment form.");
    }

    @Test(description = "TC-CHECKOUT-06: Verify 'Back to Products' clears cart and navigates home.")
    public void verifyBackToHomeClearsCart() {
        // Complete the entire checkout process
        checkoutPage.fillAddress("123 Test St", "Automation City", "12345");
        checkoutPage.clickNextToPayment();
        checkoutPage.fillPayment("4111111111111111");
        checkoutPage.clickPayNow();

        // On the success screen, click the back to home button
        productsPage = checkoutPage.clickBackToHome();

        // Verify we are back on the products page
        Assert.assertTrue(productsPage.isProductListDisplayed(), "Did not navigate back to products page.");

        // Verify the cart is now empty
        cartPage = productsPage.clickCartIcon();
        Assert.assertTrue(cartPage.isCartEmptyMessageDisplayed(), "Cart was not empty after completing an order.");
    }
}
