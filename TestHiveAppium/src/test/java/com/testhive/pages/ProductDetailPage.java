package com.testhive.pages;

import io.appium.java_client.AppiumBy;
import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.By;

import java.time.Duration;

public class ProductDetailPage {

    protected AndroidDriver driver;

    // Element Locators
    private final AppiumBy backButton = (AppiumBy) AppiumBy.accessibilityId("back-button");
    private final AppiumBy detailScreen = (AppiumBy) AppiumBy.accessibilityId("product-detail-screen");
    private final By  productName =  AppiumBy.xpath("//android.view.ViewGroup[@content-desc='product-detail-screen']/android.view.ViewGroup/android.widget.TextView[2]");
    private final By  productPrice = AppiumBy.xpath("//android.widget.ScrollView/android.view.ViewGroup/android.widget.TextView[1]");
    private final By  productDescription =AppiumBy.xpath("//android.widget.ScrollView/android.view.ViewGroup/android.widget.TextView[2]");

    public ProductDetailPage(AndroidDriver driver) {
        this.driver = driver;
    }

    // --- Actions ---

    public ProductsPage clickBackButton() {
        driver.findElement(backButton).click();
        return new ProductsPage(driver);
    }

    // --- Verification Methods ---

    public boolean isPageDisplayed() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            return wait.until(ExpectedConditions.visibilityOfElementLocated(detailScreen)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public String getProductName() {
        try {
            return driver.findElement(productName).getText();
        } catch (Exception e) {
            return "Product name not found.";
        }
    }

    public String getProductPrice() {
        try {
            return driver.findElement(productPrice).getText();
        } catch (Exception e) {
            return "Product price not found.";
        }
    }

    public String getProductDescription() {
        try {
            return driver.findElement(productDescription).getText();
        } catch (Exception e) {
            return "Product description not found.";
        }
    }
}
