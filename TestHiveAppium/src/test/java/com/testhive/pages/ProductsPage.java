package com.testhive.pages;


import io.appium.java_client.AppiumDriver;
import io.appium.java_client.AppiumBy;
import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.By;
import java.time.Duration;
import java.util.List;

public class ProductsPage {

    protected AppiumDriver driver;
    // Element Locators
    private final AppiumBy productScreen = (AppiumBy) AppiumBy.accessibilityId("products-screen");
    private final AppiumBy searchInput = (AppiumBy) AppiumBy.accessibilityId("search-input");
    private final AppiumBy cartButton = (AppiumBy) AppiumBy.accessibilityId("cart-button");
    private final AppiumBy cartBadge = (AppiumBy) AppiumBy.accessibilityId("cart-badge");

    private final By noProductsFoundMessage = AppiumBy.xpath("//android.widget.TextView[@text='No products found']");
    private final By logoutButton = AppiumBy.xpath("//android.widget.Button[@text='Logout']");
    private final AppiumBy menuButton = (AppiumBy) AppiumBy.accessibilityId("menu-button");


    public ProductsPage(AppiumDriver driver) {
        this.driver = driver;
    }

    // --- Actions ---

    public void searchForProduct(String productName) {
        driver.findElement(searchInput).sendKeys(productName);
    }

    public void clickAddButton(String productName) {
        driver.findElement(AppiumBy.accessibilityId("add-to-cart-button-" + productName)).click();
    }

    public void clickIncreaseQuantity(String productName) {
        // The accessibilityId is the same for the initial add and the '+' button
        driver.findElement(AppiumBy.accessibilityId("add-to-cart-button-" + productName)).click();
    }

    public void clickDecreaseQuantity(String productName) {
        driver.findElement(AppiumBy.accessibilityId("remove-from-cart-button-" + productName)).click();
    }

    public ProductDetailPage selectProduct(String productName) {
        driver.findElement(AppiumBy.accessibilityId("product-item-" + productName)).click();
        return new ProductDetailPage(driver);
    }

    public CartPage clickCartIcon() {
        driver.findElement(cartButton).click();
        return new CartPage(driver);
    }

    // --- Verification Methods ---

    public boolean isProductListDisplayed() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            return wait.until(ExpectedConditions.visibilityOfElementLocated(productScreen)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isProductDisplayed(String productName) {
        try {
            return driver.findElement(AppiumBy.accessibilityId("product-item-" + productName)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isNoProductsFoundMessageDisplayed() {
        try {
            return driver.findElement(noProductsFoundMessage).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isQuantityControlDisplayed(String productName) {
        try {
            // Check for the presence of the quantity text, which only appears after adding an item.
            return driver.findElement(AppiumBy.accessibilityId("quantity-text-" + productName)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isCartBadgeDisplayed() {
        List<WebElement> badges = driver.findElements(cartBadge);
        return !badges.isEmpty() && badges.get(0).isDisplayed();
    }

    public String getCartBadgeCount() {
        try {
            return driver.findElement(cartBadge).findElement(AppiumBy.className("android.widget.TextView")).getText();
        } catch (Exception e) {
            return "0";
        }
    }

    public String getQuantityText(String productName) {
        try {
            return driver.findElement(AppiumBy.accessibilityId("quantity-text-" + productName)).getText();
        } catch (Exception e) {
            return "0";
        }
    }

    /**
     * Performs the complete logout sequence.
     * @return A new instance of the LoginPage.
     */
    public  LoginPage logout() {
        // Click the menu button in the header
        driver.findElement(menuButton).click();

        // Wait for the logout button in the alert to be visible and click it
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        wait.until(ExpectedConditions.visibilityOfElementLocated(logoutButton)).click();

        return new LoginPage(driver);
    }
}
