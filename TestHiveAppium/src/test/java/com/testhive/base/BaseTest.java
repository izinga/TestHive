package com.testhive.base;

import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;

public class BaseTest {

    protected AndroidDriver driver;

    @BeforeMethod
    public void setUp() throws MalformedURLException {
        // --- Desired Capabilities Setup ---
        DesiredCapabilities caps = new DesiredCapabilities();

        caps.setCapability("platformName", "Android");
        caps.setCapability("automationName", "UiAutomator2");

        caps.setCapability("appPackage", "com.testhiveapp");
        caps.setCapability("appActivity", ".MainActivity");

        // --- IMPORTANT ---
        // You must build the TestHiveApp and install the APK on your device/emulator.
        // caps.setCapability("app", "/path/to/your/TestHiveApp.apk"); // <-- IMPORTANT: Change this!

        // --- Appium Server Connection ---
        // This connects to the Appium server running on your local machine.
        // URL appiumServerUrl = new URL("http://0.0.0.0:4723");

        // --- Driver Initialization ---
        driver = new AndroidDriver(new URL("http://localhost:4723/wd/hub"), caps);

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
