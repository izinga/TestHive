from pages.base_page import BasePage

class LoginPage(BasePage):
    """
    Page object for the Login Screen.
    """

    def __init__(self, driver):
        super().__init__(driver)
        # Locator for an element that is unique to the login page
        self.LOGIN_BUTTON = ('id', 'login-button')

    def is_login_page_displayed(self):
        """
        Verifies if the login page is displayed by checking for the login button.
        """
        return self._is_displayed(*self.LOGIN_BUTTON)
