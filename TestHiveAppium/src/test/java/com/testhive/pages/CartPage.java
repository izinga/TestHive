package com.testhive.pages;


import io.appium.java_client.AppiumDriver;
import io.appium.java_client.AppiumBy;
import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import org.openqa.selenium.By;
import java.time.Duration;

public class CartPage {

    protected AppiumDriver driver;

    // Element Locators
    private final AppiumBy cartScreen = (AppiumBy) AppiumBy.accessibilityId("cart-screen");
    private final By emptyCartMessage =  AppiumBy.xpath("//android.widget.TextView[@text='Your cart is empty.']");
    private final AppiumBy grandTotalText = (AppiumBy) AppiumBy.accessibilityId("cart-total-text");
    private final AppiumBy checkoutButton = (AppiumBy) AppiumBy.accessibilityId("checkout-button");

    public CartPage(AppiumDriver driver) {
        this.driver = driver;
    }

    // --- Dynamic Element Locators ---
    private WebElement getCartItem(String productName) {
        return driver.findElement(AppiumBy.accessibilityId("cart-item-" + productName));
    }

    // --- Actions ---

    public void clickIncreaseQuantity(String productName) {
        getCartItem(productName).findElement(AppiumBy.accessibilityId("add-to-cart-button-" + productName)).click();
    }

    public void clickDecreaseQuantity(String productName) {
        getCartItem(productName).findElement(AppiumBy.accessibilityId("remove-from-cart-button-" + productName)).click();
    }

    public CheckoutPage clickCheckoutButton() {
        driver.findElement(checkoutButton).click();
        return new CheckoutPage(driver);
    }

    // --- Verification Methods ---

    public boolean isPageDisplayed() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            return wait.until(ExpectedConditions.visibilityOfElementLocated(cartScreen)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isItemInCart(String productName) {
        try {
            return getCartItem(productName).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public String getLineItemText(String productName) {
        try {
            // The price and quantity text is a child of the cart item view group
            WebElement lineItem = getCartItem(productName).findElement(AppiumBy.xpath(".//android.widget.TextView[2]"));
            return lineItem.getText();
        } catch (Exception e) {
            return "Line item text not found.";
        }
    }

    public String getQuantityText(String productName) {
        try {
            return getCartItem(productName).findElement(AppiumBy.accessibilityId("quantity-text-" + productName)).getText();
        } catch (Exception e) {
            return "0";
        }
    }

    public String getGrandTotal() {
        try {
            return driver.findElement(grandTotalText).getText();
        } catch (Exception e) {
            return "Grand total not found.";
        }
    }

    public boolean isCartEmptyMessageDisplayed() {
        try {
            return driver.findElement(emptyCartMessage).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
}
