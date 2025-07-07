package com.testhive.tests;

import com.testhive.base.BaseTest;
import com.testhive.pages.LoginPage;
import com.testhive.pages.ProductsPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class LoginTests extends BaseTest {

    @Test(description = "TC-LOGIN-01 & TC-LOGIN-02: Verify successful login and navigation.")
    public void successfulLogin() {
        LoginPage loginPage = new LoginPage(driver);
        ProductsPage productsPage = loginPage.login("devicelab", "robustest");
        Assert.assertTrue(productsPage.isProductListDisplayed(), "User was not navigated to the Products page after login.");
    }

    @Test(description = "TC-LOGIN-03: Verify error with invalid username.")
    public void invalidUsername() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.login("wronguser", "robustest");
        Assert.assertEquals(loginPage.getErrorMessage(), "Invalid username or password", "Error message for invalid username was not correct.");
    }

    @Test(description = "TC-LOGIN-04: Verify error with invalid password.")
    public void invalidPassword() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.login("devicelab", "wrongpassword");
        Assert.assertEquals(loginPage.getErrorMessage(), "Invalid username or password", "Error message for invalid password was not correct.");
    }

    @Test(description = "TC-LOGIN-05: Verify error with empty credentials.")
    public void emptyCredentials() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.clickLoginButton(); // Click login without entering credentials
        Assert.assertEquals(loginPage.getErrorMessage(), "Invalid username or password", "Error message for empty credentials was not displayed or was incorrect.");
    }

    @Test(description = "TC-LOGIN-06: Verify error message disappears on typing.")
    public void errorMessageDisappearsOnTyping() {
        LoginPage loginPage = new LoginPage(driver);
        // First, trigger the error
        loginPage.login("wrong", "wrong");
        Assert.assertTrue(loginPage.isErrorMessageDisplayed(), "Error message was not initially displayed.");

        // Now, type in the username field and verify the error disappears
        loginPage.enterUsername("a");
        Assert.assertFalse(loginPage.isErrorMessageDisplayed(), "Error message did not disappear after typing in the username field.");
    }

    @Test(description = "TC-LOGIN-07: Verify password field is masked.")
    public void passwordFieldIsMasked() {
        LoginPage loginPage = new LoginPage(driver);
        Assert.assertTrue(loginPage.isPasswordMasked(), "Password field is not masked.");
    }

    @Test(description = "TC-GEN-01: Verify that the logout functionality works correctly.")
       public void verifyLogoutFunctionality() {
           // 1. Create a LoginPage object
           LoginPage loginPage = new LoginPage(driver);

           // 2. Log in, which returns a ProductsPage object
           ProductsPage productsPage = loginPage.login("devicelab", "robustest");

           // 3. Call logout() ON THE productsPage OBJECT
           loginPage = productsPage.logout();

           // 4. Assert you are back on the login page
           Assert.assertTrue(loginPage.isLoginButtonDisplayed(), "User was not returned to the login page after logout.");
       }
}
