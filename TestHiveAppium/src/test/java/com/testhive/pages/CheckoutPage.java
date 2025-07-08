package com.testhive.pages;


import io.appium.java_client.AppiumDriver;
import io.appium.java_client.AppiumBy;
import io.appium.java_client.android.AndroidDriver;

public class CheckoutPage {

    protected AppiumDriver driver;

    // --- Address Page Locators ---
    private final AppiumBy addressScreen = (AppiumBy) AppiumBy.accessibilityId("address-screen");
    private final AppiumBy addressInput = (AppiumBy) AppiumBy.accessibilityId("address-input");
    private final AppiumBy cityInput = (AppiumBy) AppiumBy.accessibilityId("city-input");
    private final AppiumBy zipInput = (AppiumBy) AppiumBy.accessibilityId("zip-input");
    private final AppiumBy nextButton = (AppiumBy) AppiumBy.accessibilityId("next-button");

    // --- Payment Page Locators ---
    private final AppiumBy paymentScreen = (AppiumBy) AppiumBy.accessibilityId("payment-screen");
    private final AppiumBy cardNumberInput = (AppiumBy) AppiumBy.accessibilityId("card-number-input");
    private final AppiumBy payNowButton = (AppiumBy) AppiumBy.accessibilityId("pay-now-button");

    // --- Success Page Locators ---
    private final AppiumBy successScreen = (AppiumBy) AppiumBy.accessibilityId("checkout-success-screen");
    private final AppiumBy backToHomeButton = (AppiumBy) AppiumBy.accessibilityId("back-to-home-button");

    public CheckoutPage(AppiumDriver driver) {
        this.driver = driver;
    }

    // --- Actions ---

    public void enterAddress(String address) {
        driver.findElement(addressInput).sendKeys(address);
    }

    public void enterCity(String city) {
        driver.findElement(cityInput).sendKeys(city);
    }

    public void enterZip(String zip) {
        driver.findElement(zipInput).sendKeys(zip);
    }

    public void fillAddress(String address, String city, String zip) {
        enterAddress(address);
        enterCity(city);
        enterZip(zip);
    }

    public void clickNextToPayment() {
        driver.findElement(nextButton).click();
    }

    public void enterCardNumber(String cardNumber) {
        driver.findElement(cardNumberInput).sendKeys(cardNumber);
    }

    public void fillPayment(String cardNumber) {
        enterCardNumber(cardNumber);
    }

    public void clickPayNow() {
        driver.findElement(payNowButton).click();
    }

    public ProductsPage clickBackToHome() {
        driver.findElement(backToHomeButton).click();
        return new ProductsPage(driver);
    }

    // --- Verification Methods ---

    public boolean isAddressPageDisplayed() {
        try {
            return driver.findElement(addressScreen).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isPaymentPageDisplayed() {
        try {
            return driver.findElement(paymentScreen).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isSuccessScreenDisplayed() {
        try {
            return driver.findElement(successScreen).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isNextButtonEnabled() {
        // The 'enabled' attribute is 'true' or 'false' as a string
        return "true".equals(driver.findElement(nextButton).getAttribute("enabled"));
    }

    public boolean isPayNowButtonEnabled() {
        return "true".equals(driver.findElement(payNowButton).getAttribute("enabled"));
    }
}
