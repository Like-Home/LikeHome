import pytest
import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

class TestE2eValidTest():
  def setup_method(self, method):
    self.driver = webdriver.Remote(command_executor='http://localhost:4444/wd/hub', desired_capabilities=DesiredCapabilities.CHROME)
    self.vars = {}
  
  def teardown_method(self, method):
    self.driver.quit()
  
  def wait_for_window(self, timeout = 2):
    time.sleep(round(timeout / 1000))
    wh_now = self.driver.window_handles
    wh_then = self.vars["window_handles"]
    if len(wh_now) > len(wh_then):
      return set(wh_now).difference(set(wh_then)).pop()
  
  def test_e2eValidTest(self):
    self.driver.get("https://likehome.dev/")
    self.driver.set_window_size(874, 804)
    self.driver.find_element(By.CSS_SELECTOR, ".MuiAvatar-img").click()
    self.driver.find_element(By.CSS_SELECTOR, ".css-l2zibg").click()
    self.driver.find_element(By.CSS_SELECTOR, "form > .MuiButtonBase-root").click()
    self.driver.find_element(By.CSS_SELECTOR, ".JDAKTe:nth-child(2) .wLBAL").click()
    self.driver.find_element(By.ID, ":r0:").click()
    self.driver.find_element(By.ID, ":r0:").send_keys("San Francisco Area - CA")
    self.driver.find_element(By.CSS_SELECTOR, ".MuiBox-root:nth-child(3)").click()
    self.driver.find_element(By.CSS_SELECTOR, " div:nth-of-type(2) > .MuiStack-root.css-zg1vud > .MuiPaper-elevation.MuiPaper-elevation1.MuiPaper-root.MuiPaper-rounded.css-7w62nw > .MuiStack-root.css-1yjo05o > .MuiStack-root.css-fp9407 > .MuiInputBase-colorPrimary.MuiInputBase-root.css-bsrcuz > input[name=\'date\']").click()
    self.driver.find_element(By.CSS_SELECTOR, " div:nth-of-type(2) > .MuiStack-root.css-zg1vud > .MuiPaper-elevation.MuiPaper-elevation1.MuiPaper-root.MuiPaper-rounded.css-7w62nw > .MuiStack-root.css-1yjo05o > .MuiStack-root.css-fp9407 > .MuiInputBase-colorPrimary.MuiInputBase-root.css-bsrcuz > input[name=\'date\']").send_keys("2023-05-03")
    self.driver.find_element(By.CSS_SELECTOR, "div:nth-of-type(3) > .MuiStack-root.css-zg1vud > .MuiPaper-elevation.MuiPaper-elevation1.MuiPaper-root.MuiPaper-rounded.css-7w62nw > .MuiStack-root.css-1yjo05o > .MuiStack-root.css-fp9407 > .MuiInputBase-colorPrimary.MuiInputBase-root.css-bsrcuz > input[name=\'date\']").click()
    self.driver.find_element(By.CSS_SELECTOR, "div:nth-of-type(3) > .MuiStack-root.css-zg1vud > .MuiPaper-elevation.MuiPaper-elevation1.MuiPaper-root.MuiPaper-rounded.css-7w62nw > .MuiStack-root.css-1yjo05o > .MuiStack-root.css-fp9407 > .MuiInputBase-colorPrimary.MuiInputBase-root.css-bsrcuz > input[name=\'date\']").send_keys("2023-05-05")
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-contained").click()
    self.driver.find_element(By.XPATH, "//div[@id=\'root\']/div/div/div/div[2]/div/div/div/div").click()
    element = self.driver.find_element(By.XPATH, "//span[2]")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).click_and_hold().perform()
    element = self.driver.find_element(By.XPATH, "//span[2]")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    element = self.driver.find_element(By.XPATH, "//span[2]")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).release().perform()
    self.driver.find_element(By.XPATH, "//div/span").click()
    self.driver.find_element(By.CSS_SELECTOR, " div[role=\'radiogroup\'] > label:nth-of-type(2)").click()
    self.vars["window_handles"] = self.driver.window_handles
    self.driver.find_element(By.CSS_SELECTOR, " [class=\'MuiGrid-root MuiGrid-direction-xs-row MuiGrid-grid-xs-12 MuiGrid-grid-md-4 css-grry9j\'] div").click()
    self.vars["win7109"] = self.wait_for_window(60000)
    self.driver.switch_to.window(self.vars["win7109"])
    self.driver.find_element(By.ID, "simple-tab-1").click()
    self.driver.find_element(By.CSS_SELECTOR, ".MuiGrid2-root:nth-child(1) > .MuiPaper-root .MuiButtonBase-root").click()
    self.driver.find_element(By.XPATH, "//input[@value=\'\']").click()
    self.driver.find_element(By.XPATH, "//input[@value=\'\']").send_keys("nha")
    self.driver.find_element(By.CSS_SELECTOR, ".MuiGrid2-root:nth-child(2) > .MuiPaper-root").click()
    self.driver.find_element(By.XPATH, "/html//div[@id=\'root\']/div[@class=\'MuiBox-root css-9zm4ok\']/div[@class=\'MuiBox-root css-0\']/div[@class=\'MuiStack-root css-ikzlcq\']/div/div[@class=\'MuiStack-root css-151r4pm\']/div[2]/div[1]/div[2]/div/div[@class=\'MuiStack-root css-1yjo05o\']/div[@class=\'MuiStack-root css-fp9407\']/div/input").click()
    self.driver.find_element(By.XPATH, "/html//div[@id=\'root\']/div[@class=\'MuiBox-root css-9zm4ok\']/div[@class=\'MuiBox-root css-0\']/div[@class=\'MuiStack-root css-ikzlcq\']/div/div[@class=\'MuiStack-root css-151r4pm\']/div[2]/div[1]/div[2]/div/div[@class=\'MuiStack-root css-1yjo05o\']/div[@class=\'MuiStack-root css-fp9407\']/div/input").send_keys("alvarado")
    self.driver.find_element(By.XPATH, "/html//div[@id=\'root\']/div[@class=\'MuiBox-root css-9zm4ok\']/div[@class=\'MuiBox-root css-0\']/div[@class=\'MuiStack-root css-ikzlcq\']/div/div[@class=\'MuiStack-root css-151r4pm\']/div[2]/div[1]/div[3]/div/div[@class=\'MuiStack-root css-1yjo05o\']/div[@class=\'MuiStack-root css-fp9407\']/div/input").click()
    self.driver.find_element(By.XPATH, "/html//div[@id=\'root\']/div[@class=\'MuiBox-root css-9zm4ok\']/div[@class=\'MuiBox-root css-0\']/div[@class=\'MuiStack-root css-ikzlcq\']/div/div[@class=\'MuiStack-root css-151r4pm\']/div[2]/div[1]/div[3]/div/div[@class=\'MuiStack-root css-1yjo05o\']/div[@class=\'MuiStack-root css-fp9407\']/div/input").send_keys("nha@gmail.com")
    self.driver.find_element(By.XPATH, "/html//div[@id=\'root\']/div[@class=\'MuiBox-root css-9zm4ok\']/div[@class=\'MuiBox-root css-0\']/div[@class=\'MuiStack-root css-ikzlcq\']/div/div[@class=\'MuiStack-root css-151r4pm\']/div[2]/div[1]/div[4]/div/div[@class=\'MuiStack-root css-1yjo05o\']/div[@class=\'MuiStack-root css-fp9407\']/div/input").click()
    self.driver.find_element(By.XPATH, "/html//div[@id=\'root\']/div[@class=\'MuiBox-root css-9zm4ok\']/div[@class=\'MuiBox-root css-0\']/div[@class=\'MuiStack-root css-ikzlcq\']/div/div[@class=\'MuiStack-root css-151r4pm\']/div[2]/div[1]/div[4]/div/div[@class=\'MuiStack-root css-1yjo05o\']/div[@class=\'MuiStack-root css-fp9407\']/div/input").send_keys("4083456789")
    self.driver.find_element(By.XPATH, "/html//div[@id=\'root\']/div[@class=\'MuiBox-root css-9zm4ok\']/div[@class=\'MuiBox-root css-0\']/div[@class=\'MuiStack-root css-ikzlcq\']/div//input[@class=\'PrivateSwitchBase-input css-1m9pwf3\']").click()
    self.driver.find_element(By.CSS_SELECTOR, " .MuiButton-contained.MuiButton-containedPrimary.MuiButton-containedSizeMedium.MuiButton-root.MuiButton-sizeMedium.MuiButtonBase-root.css-1qpprnv").click()
    self.driver.find_element(By.CSS_SELECTOR, ".ReadOnlyFormField-email").click()
    self.driver.find_element(By.ID, "cardNumber").click()
    self.driver.find_element(By.ID, "cardNumber").send_keys("4242 4242 4242 4242")
    self.driver.find_element(By.ID, "cardExpiry").click()
    self.driver.find_element(By.ID, "cardExpiry").send_keys("04 / 24")
    self.driver.find_element(By.ID, "cardCvc").click()
    self.driver.find_element(By.ID, "cardCvc").send_keys("424")
    self.driver.find_element(By.ID, "billingName").click()
    self.driver.find_element(By.ID, "billingName").send_keys("Nha Alvarado")
    self.driver.find_element(By.ID, "billingPostalCode").click()
    self.driver.find_element(By.ID, "billingPostalCode").send_keys("42424")
    self.driver.find_element(By.ID, "enableStripePass").click()
    self.driver.find_element(By.CSS_SELECTOR, ".SubmitButton-IconContainer").click()
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-containedError").click()
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-contained:nth-child(1)").click()
    self.driver.find_element(By.CSS_SELECTOR, ".MuiAvatar-img").click()
    self.driver.find_element(By.CSS_SELECTOR, ".MuiMenuItem-root:nth-child(3)").click()
    self.driver.find_element(By.CSS_SELECTOR, ".MuiBackdrop-root").click()
    self.driver.find_element(By.XPATH, "//div[@id=\'root\']//div[@class=\'MuiBox-root css-0\']//div[@class=\'MuiTabs-root css-orq8zk\']/div/div[@role=\'tablist\']/button[3]").click()
  
