package com.testhive.pages;

import io.appium.java_client.AppiumBy;
import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

public class LoginPage {

    protected AndroidDriver driver;

    // Element Locators identified by their accessibilityLabel
    private final AppiumBy usernameInput = (AppiumBy) AppiumBy.accessibilityId("username-input");
    private final AppiumBy passwordInput = (AppiumBy) AppiumBy.accessibilityId("password-input");
    private final AppiumBy loginButton = (AppiumBy) AppiumBy.accessibilityId("login-button");
    private final AppiumBy errorMessage = (AppiumBy) AppiumBy.accessibilityId("error-message");

    public LoginPage(AndroidDriver driver) {
        this.driver = driver;
    }

    // --- Actions ---

    public void enterUsername(String username) {
        WebElement usernameField = driver.findElement(usernameInput);
        usernameField.clear();
        usernameField.sendKeys(username);
    }

    public void enterPassword(String password) {
        WebElement passwordField = driver.findElement(passwordInput);
        passwordField.clear();
        passwordField.sendKeys(password);
    }

    public void clickLoginButton() {
        driver.findElement(loginButton).click();
    }

    /**
     * A convenience method to perform a complete login action.
     * This will be used by our tests.
     */
    public ProductsPage login(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        clickLoginButton();
        // After a successful login, the app navigates to the Products page.
        // We return an object representing that page.
        return new ProductsPage(driver);
    }

    // --- Verification Methods for Tests ---

    /**
     * Checks if the login button is visible on the screen.
     * Supports TC-SPLASH-03.
     */
    public boolean isLoginButtonDisplayed() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            return wait.until(ExpectedConditions.visibilityOfElementLocated(loginButton)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Gets the text of the error message.
     * Supports TC-LOGIN-03, TC-LOGIN-04, TC-LOGIN-05.
     */
    public String getErrorMessage() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
            return wait.until(ExpectedConditions.visibilityOfElementLocated(errorMessage)).getText();
        } catch (Exception e) {
            return "Error message not found.";
        }
    }

    /**
     * Checks if the error message is currently displayed on the screen.
     * Supports TC-LOGIN-06.
     * @return true if the error message element is found and visible, false otherwise.
     */
    public boolean isErrorMessageDisplayed() {
        // We use findElements to avoid throwing an exception if the element doesn't exist.
        List<WebElement> errorMessages = driver.findElements(errorMessage);
        // If the list is not empty, it means the element was found.
        return !errorMessages.isEmpty() && errorMessages.get(0).isDisplayed();
    }

    /**
     * Checks if the password input field is masked.
     * Supports TC-LOGIN-07.
     * @return true if the password attribute is "true", false otherwise.
     */
    public boolean isPasswordMasked() {
        WebElement passwordField = driver.findElement(passwordInput);
        // The 'password' attribute indicates if the field is a secure text entry.
        return "true".equals(passwordField.getAttribute("password"));
    }
}
