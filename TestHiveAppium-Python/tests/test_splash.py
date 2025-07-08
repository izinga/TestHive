import pytest
from pages.splash_page import SplashScreenPage
from pages.login_page import LoginPage

@pytest.mark.smoke
class TestSplashScreen:
    """
    Test suite for the Splash Screen functionality.
    """

    def test_splash_screen_is_displayed(self, driver):
        """
        TC-SPLASH-01: Verify that the app launches successfully and the splash screen is displayed.
        """
        splash_page = SplashScreenPage(driver)
        assert splash_page.is_splash_screen_displayed(), "Splash screen was not displayed on app launch."

    def test_splash_screen_content(self, driver):
        """
        TC-SPLASH-02: Verify that the TestHive logo and name are visible on the splash screen.
        """
        splash_page = SplashScreenPage(driver)
        assert splash_page.get_splash_title() == "TestHive", "The app title on the splash screen is incorrect."

    def test_navigation_to_login(self, driver):
        """
        TC-SPLASH-03: Verify navigation to the login screen after splash.
        """
        # The splash screen has a 3-second timer. The explicit wait in the page object will handle this delay.
        login_page = LoginPage(driver)
        assert login_page.is_login_page_displayed(), "App did not navigate to the login page after the splash screen."
