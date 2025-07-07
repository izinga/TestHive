package com.testhive.tests;

import com.testhive.base.BaseTest;
import com.testhive.pages.LoginPage;
import com.testhive.pages.ProductDetailPage;
import com.testhive.pages.ProductsPage;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class ProductDetailTests extends BaseTest {

    private ProductDetailPage detailPage;
    private ProductsPage productsPage;

    @BeforeMethod
    public void setupProductDetailPage() {
        LoginPage loginPage = new LoginPage(driver);
        // Navigate to a specific product detail page to set up for the tests
        productsPage = loginPage.login("devicelab", "robustest");
        detailPage = productsPage.selectProduct("Maestro");
    }

    @Test(description = "TC-DETAIL-01: Verify that the correct product name, description, and price are displayed.")
    public void verifyProductDetails() {
        Assert.assertTrue(detailPage.isPageDisplayed(), "Product detail page is not displayed.");

        // We compare the details on the page with our expected hardcoded values
        Assert.assertEquals(detailPage.getProductName(), "Maestro", "Product name is incorrect.");
        Assert.assertEquals(detailPage.getProductPrice(), "Price: $5.99", "Product price is incorrect.");

        String expectedDescription = "The simplest and most effective mobile UI testing framework. Built for developers and testers.";
        Assert.assertEquals(detailPage.getProductDescription(), expectedDescription, "Product description is incorrect.");
    }

    @Test(description = "TC-DETAIL-02: Verify that the 'Back' button successfully navigates the user back to the Products page.")
    public void verifyBackButtonNavigation() {
        // From the detail page, click the back button
        productsPage = detailPage.clickBackButton();

        // Verify we are back on the products page
        Assert.assertTrue(productsPage.isProductListDisplayed(), "Did not navigate back to the Products page.");
    }
}
