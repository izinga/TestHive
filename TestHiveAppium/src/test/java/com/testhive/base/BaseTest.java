package com.testhive.base;

import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

import io.appium.java_client.android.options.UiAutomator2Options;
import java.net.MalformedURLException;

import java.net.URL;
import java.time.Duration;

public class BaseTest {

    protected AndroidDriver driver;

    @BeforeMethod
    public void setUp() throws MalformedURLException {
        // --- Desired Capabilities Setup ---
        DesiredCapabilities caps = new DesiredCapabilities();

        caps.setCapability("appium:platformName", "Android");
        caps.setCapability("appium:automationName", "UiAutomator2");

        caps.setCapability("appium:appPackage", "com.testhiveapp");
        caps.setCapability("appium:appActivity", ".MainActivity");

        // --- IMPORTANT ---
        // You must build the TestHiveApp and install the APK on your device/emulator.
        // caps.setCapability("app", "/path/to/your/TestHiveApp.apk"); // <-- IMPORTANT: Change this!

        // --- Appium Server Connection ---
        // This connects to the Appium server running on your local machine.
        // URL appiumServerUrl = new URL("http://0.0.0.0:4723");

        // --- Driver Initialization ---
        UiAutomator2Options options = new UiAutomator2Options()
            .setAppPackage("com.testhiveapp")
            .setAppActivity(".MainActivity");

        URL appiumServerUrl = new URL("http://localhost:4723");
        driver = new AndroidDriver( appiumServerUrl, options);

        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(15));
    }

    @AfterMethod
    public void tearDown() {
        // --- Test Cleanup ---
        if (driver != null) {
            driver.quit();
        }
    }
}
