import pytest
import traceback
from appium import webdriver
from appium.options.android import UiAutomator2Options

@pytest.fixture(scope="function")
def driver():
    """
    This pytest fixture sets up and tears down the Appium driver for each test function.
    """
    # Define the desired capabilities for the Android device and app.
    # Update these values based on your specific setup.
    capabilities = {
        "platformName": "Android",
        "appium:automationName": "UiAutomator2",# <-- IMPORTANT: Change this!
        "appium:appPackage": "com.testhiveapp",
        "appium:appActivity": ".MainActivity",
        "appium:noReset": True
    }

    # Convert capabilities to UiAutomator2Options object
    options = UiAutomator2Options().load_capabilities(capabilities)

    # Initialize the Appium driver
    appium_driver = None
    try:
        appium_driver = webdriver.Remote("http://127.0.0.1:4723", options=options)
        # 'yield' passes the driver object to the test function
        yield appium_driver
    except Exception as ext:
        print("An error occurred:", type(ext).__name__, "–", ext) #
        print(traceback.format_exc())
    finally:
        # This code runs after the test function has completed
        if appium_driver:
            appium_driver.quit()
