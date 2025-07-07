package com.testhive.pages;

import io.appium.java_client.AppiumBy;
import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import org.openqa.selenium.By;
import java.time.Duration;

public class SplashScreenPage {

    protected AndroidDriver driver;

    // Element Locators
    private final AppiumBy splashScreen = (AppiumBy) AppiumBy.accessibilityId("splash-screen");
    private final By splashTitle =  AppiumBy.xpath("//android.widget.TextView[@text='TestHive']");

    public SplashScreenPage(AndroidDriver driver) {
        this.driver = driver;
    }

    // --- Verification Methods ---

    /**
     * Checks if the splash screen container is visible.
     */
    public boolean isSplashScreenDisplayed() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
            return wait.until(ExpectedConditions.visibilityOfElementLocated(splashScreen)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Gets the title text from the splash screen.
     */
    public String getSplashTitle() {
        try {
            return driver.findElement(splashTitle).getText();
        } catch (Exception e) {
            return "Title not found.";
        }
    }
}
