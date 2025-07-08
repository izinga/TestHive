package com.testhive.base;

// import io.appium.java_client.android.AndroidDriver;
// import org.openqa.selenium.remote.DesiredCapabilities;
// import org.testng.annotations.AfterMethod;
// import org.testng.annotations.BeforeMethod;

// import java.net.MalformedURLException;
// import java.net.URL;
// import java.time.Duration;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.options.UiAutomator2Options;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import java.net.URL;
import java.net.MalformedURLException;
import java.time.Duration;
public class BaseTest {

    protected AppiumDriver driver;

    @BeforeMethod
    public void setUp() throws MalformedURLException {
        // --- Desired Capabilities Setup ---
        UiAutomator2Options caps = new UiAutomator2Options();

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
        // new URL ("http://127.0.0.1:4723/wd/hub")
        driver = new AppiumDriver(new URL ("http://172.18.0.2:4723/wd/hub"), caps);

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
