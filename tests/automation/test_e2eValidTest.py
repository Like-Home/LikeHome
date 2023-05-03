import time

from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities


class TestE2eValidTest():
    def setup_method(self, method):
        self.driver = webdriver.Remote(
            command_executor='http://localhost:4444/wd/hub', desired_capabilities=DesiredCapabilities.CHROME)
        self.vars = {}

    def teardown_method(self, method):
        self.driver.quit()

    def wait_for_window(self, timeout=2):
        time.sleep(round(timeout / 1000))
        wh_now = self.driver.window_handles
        wh_then = self.vars["window_handles"]
        if len(wh_now) > len(wh_then):
            return set(wh_now).difference(set(wh_then)).pop()

    def test_e2eValidTest(self):
        self.driver.get("https://likehome.dev/")
        self.driver.set_window_size(860, 804)
        self.driver.find_element(By.CSS_SELECTOR, ".MuiAvatar-root").click()
        self.driver.find_element(By.CSS_SELECTOR, ".css-10rmb3b").click()
        self.driver.find_element(
            By.CSS_SELECTOR, "form > .MuiButtonBase-root").click()
        self.driver.find_element(
            By.CSS_SELECTOR, ".JDAKTe:nth-child(2) .w1I7fb").click()
        self.driver.find_element(By.CSS_SELECTOR, ".css-vubbuv").click()
        self.driver.find_element(
            By.CSS_SELECTOR, ".css-pelz90:nth-child(1)").click()
        self.driver.find_element(By.ID, ":r2:").send_keys(
            "San Jose - Silicon Valley - CA")
        self.driver.find_element(By.NAME, "date").click()
        self.driver.find_element(By.CSS_SELECTOR, ".css-jbxpc8").click()
        element = self.driver.find_element(
            By.CSS_SELECTOR, ".card:nth-child(1) > .MuiButtonBase-root > .MuiStack-root > .MuiStack-root")
        actions = ActionChains(self.driver)
        actions.move_to_element(element).perform()
        element = self.driver.find_element(By.CSS_SELECTOR, "body")
        actions = ActionChains(self.driver)
        actions.move_to_element(element, 0, 0).perform()
        self.vars["window_handles"] = self.driver.window_handles
        self.driver.find_element(
            By.CSS_SELECTOR, ".card:nth-child(2) > .MuiButtonBase-root > .MuiStack-root > .MuiStack-root > .MuiStack-root:nth-child(1) > .MuiTypography-root").click()
        self.vars["win9745"] = self.wait_for_window(2000)
        self.driver.switch_to.window(self.vars["win9745"])
        self.driver.find_element(By.ID, "simple-tab-1").click()
        self.driver.find_element(By.ID, "simple-tab-3").click()
        self.driver.find_element(
            By.CSS_SELECTOR, ".MuiGrid2-root:nth-child(2) .MuiButtonBase-root").click()
        self.driver.find_element(
            By.CSS_SELECTOR, ".Mui-focused > .MuiInputBase-input").click()
        self.driver.find_element(
            By.CSS_SELECTOR, ".Mui-focused > .MuiInputBase-input").send_keys("Noah")
        self.driver.find_element(
            By.CSS_SELECTOR, ".Mui-focused > .MuiInputBase-input").click()
        self.driver.find_element(
            By.CSS_SELECTOR, ".Mui-focused > .MuiInputBase-input").send_keys("N")
        self.driver.find_element(
            By.CSS_SELECTOR, ".Mui-focused > .MuiInputBase-input").click()
        self.driver.find_element(
            By.CSS_SELECTOR, ".Mui-focused > .MuiInputBase-input").send_keys("asdfg@gmail.com")
        self.driver.find_element(
            By.CSS_SELECTOR, ".Mui-focused > .MuiInputBase-input").click()
        self.driver.find_element(
            By.CSS_SELECTOR, ".Mui-focused > .MuiInputBase-input").send_keys("123456789")
        self.driver.find_element(
            By.CSS_SELECTOR, ".PrivateSwitchBase-input").click()
        self.driver.find_element(
            By.CSS_SELECTOR, ".MuiButton-contained").click()
        self.driver.find_element(By.ID, "email").click()
        self.driver.find_element(By.ID, "email").send_keys("asdfg@gmail.com")
        self.driver.find_element(By.ID, "cardNumber").click()
        self.driver.find_element(By.ID, "cardNumber").send_keys(
            "4242 4242 4242 4242")
        self.driver.find_element(By.ID, "cardExpiry").click()
        self.driver.find_element(By.ID, "cardExpiry").send_keys("04 / 24")
        self.driver.find_element(By.ID, "cardCvc").click()
        self.driver.find_element(By.ID, "cardCvc").send_keys("424")
        self.driver.find_element(By.ID, "billingName").click()
        self.driver.find_element(By.ID, "billingName").send_keys("asdfgh")
        self.driver.find_element(By.ID, "billingPostalCode").click()
        self.driver.find_element(By.ID, "billingPostalCode").send_keys("42424")
        self.driver.find_element(By.ID, "enableStripePass").click()
        self.driver.find_element(
            By.CSS_SELECTOR, ".SubmitButton-IconContainer").click()
        self.driver.find_element(By.CSS_SELECTOR, ".MuiSvgIcon-root").click()
        self.driver.find_element(
            By.CSS_SELECTOR, ".MuiMenuItem-root:nth-child(3)").click()
        self.driver.find_element(By.CSS_SELECTOR, ".MuiBackdrop-root").click()
