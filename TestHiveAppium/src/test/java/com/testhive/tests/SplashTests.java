package com.testhive.tests;

import com.testhive.base.BaseTest;
import com.testhive.pages.LoginPage;
import com.testhive.pages.SplashScreenPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class SplashTests extends BaseTest {

    @Test(description = "TC-SPLASH-01: Verify that the app launches successfully and the splash screen is displayed.")
    public void verifySplashScreenIsDisplayed() {
        SplashScreenPage splashScreenPage = new SplashScreenPage(driver);
        Assert.assertTrue(splashScreenPage.isSplashScreenDisplayed(), "Splash screen was not displayed on app launch.");
    }

    @Test(description = "TC-SPLASH-02: Verify that the TestHive logo and name are visible on the splash screen.")
    public void verifySplashScreenContent() {
        SplashScreenPage splashScreenPage = new SplashScreenPage(driver);
        Assert.assertEquals(splashScreenPage.getSplashTitle(), "TestHive", "The app title on the splash screen is incorrect.");
    }

    @Test(description = "TC-SPLASH-03: Verify navigation to the login screen after splash.")
    public void verifyNavigationToLogin() {
        // The BaseTest setUp ensures the app is launched. The splash screen shows for 3 seconds.
        // We just need to verify that we land on the LoginPage.
        LoginPage loginPage = new LoginPage(driver);
        Assert.assertTrue(loginPage.isLoginButtonDisplayed(), "App did not navigate to the login page after the splash screen timeout.");
    }
}
