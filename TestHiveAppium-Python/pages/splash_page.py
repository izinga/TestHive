from pages.base_page import BasePage

class SplashScreenPage(BasePage):
    """
    Page object representing the Splash Screen.
    """

    def __init__(self, driver):
        super().__init__(driver)
        # Locators for the splash screen elements
        self.SPLASH_SCREEN_CONTAINER = ('id', 'splash-screen')
        self.SPLASH_TITLE = ('xpath', "//android.widget.TextView[@text='TestHive']")

    def is_splash_screen_displayed(self):
        """
        Verifies if the splash screen container is visible.
        Used for TC-SPLASH-01.
        """
        return self._is_displayed(*self.SPLASH_SCREEN_CONTAINER)

    def get_splash_title(self):
        """
        Gets the title text from the splash screen.
        Used for TC-SPLASH-02.
        """
        return self._get_text(*self.SPLASH_TITLE)
