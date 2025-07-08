from appium.webdriver.common.appiumby import AppiumBy
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class BasePage:
    """
    The parent class for all page objects.
    It contains common methods that are shared across all pages of the app.
    """

    def __init__(self, driver):
        """
        Initializes the BasePage with the Appium driver.
        """
        self.driver = driver
        self.wait = WebDriverWait(self.driver, 10) # Default wait time of 10 seconds

    def _find_element(self, locator_type, locator_value):
        """
        Finds and returns a single element with an explicit wait.
        This is a private helper method.
        """
        try:
            if locator_type == 'id':
                return self.wait.until(EC.visibility_of_element_located((AppiumBy.ACCESSIBILITY_ID, locator_value)))
            elif locator_type == 'xpath':
                return self.wait.until(EC.visibility_of_element_located((AppiumBy.XPATH, locator_value)))
            # Add other locator strategies as needed (e.g., class_name)
            else:
                raise ValueError(f"Unsupported locator type: {locator_type}")
        except TimeoutException:
            raise NoSuchElementException(f"Element not found with {locator_type}='{locator_value}' after waiting.")

    def _tap(self, locator_type, locator_value):
        """
        Finds an element and taps on it.
        """
        element = self._find_element(locator_type, locator_value)
        element.click()

    def _send_keys(self, locator_type, locator_value, text):
        """
        Finds an element, clears its content, and sends text to it.
        """
        element = self._find_element(locator_type, locator_value)
        element.clear()
        element.send_keys(text)

    def _get_text(self, locator_type, locator_value):
        """
        Finds an element and returns its text content.
        """
        element = self._find_element(locator_type, locator_value)
        return element.text

    def _is_displayed(self, locator_type, locator_value):
        """
        Checks if an element is displayed on the screen.
        Returns True if the element is found and visible, False otherwise.
        """
        try:
            element = self._find_element(locator_type, locator_value)
            return element.is_displayed()
        except NoSuchElementException:
            return False
