const { $ } = require('@wdio/globals');

/**
 * Base page class containing common methods and utilities
 */
class BasePage {
    constructor() {
        this.timeout = {
            short: 5000,
            medium: 15000,
            long: 30000
        };
    }

    /**
     * Wait for element to be displayed
     */
    async waitForDisplayed(element, timeout = this.timeout.medium) {
        await element.waitForDisplayed({ timeout });
    }

    /**
     * Wait for element to be clickable
     */
    async waitForClickable(element, timeout = this.timeout.medium) {
        await element.waitForClickable({ timeout });
    }

    /**
     * Wait for element to not be displayed
     */
    async waitForElementNotDisplayed(element, timeout = this.timeout.medium) {
        await browser.waitUntil(
            async () => {
                try {
                    return !(await element.isDisplayed());
                } catch (err) {
                    // If element not found anymore, consider it as not displayed
                    return true;
                }
            },
            {
                timeout,
                timeoutMsg: `Element was still displayed after ${timeout}ms`,
            }
        );
    }

    /**
     * Wait for element to be enabled
     */
    async waitForElementEnabled(element, timeout = this.timeout.medium) {
        await browser.waitUntil(
            async () => await element.isEnabled(),
            {
                timeout,
                timeoutMsg: `Element was not enabled after ${timeout}ms`,
            }
        );
    }

    /**
     * Wait for element to be disabled
     */
    async waitForElementDisabled(element, timeout = this.timeout.medium) {
        await browser.waitUntil(
            async () => !(await element.isEnabled()),
            {
                timeout,
                timeoutMsg: `Element was still enabled after ${timeout}ms`,
            }
        );
    }

    /**
     * Safe click with wait and error handling - Mobile optimized
     */
    async safeClick(element, timeout = this.timeout.medium) {
        await this.waitForDisplayed(element, timeout);
        await element.click();
        await driver.pause(500); // Small pause after click
    }

    /**
     * Safe text input with clear
     */
    async safeSetValue(element, value, timeout = this.timeout.medium) {
        await this.waitForDisplayed(element, timeout);
        await element.clearValue();
        await element.setValue(value);
        await driver.pause(300);
    }

    /**
     * Take screenshot with custom name - disabled to prevent session timeouts
     */
    async takeScreenshot(name) {
        // Temporarily disabled to prevent WebDriver session timeouts
        console.log(`📸 Screenshot skipped: ${name}`);
        return;
    }

    /**
     * Scroll to element
     */
    async scrollToElement(element) {
        await element.scrollIntoView();
    }

    /**
     * Wait for page to load (override in child classes)
     */
    async waitForPageLoad() {
        await driver.pause(1000); // Base implementation
    }

    /**
     * Get element by accessibility id
     */
    getByAccessibilityId(id) {
        return $(`~${id}`);
    }

    /**
     * Get element by Android UIAutomator
     */
    getByAndroidUIAutomator(selector) {
        return $(`android=${selector}`);
    }

    /**
     * Get element by XPath
     */
    getByXPath(xpath) {
        return $(xpath);
    }

    /**
     * Verify element text
     */
    async verifyElementText(element, expectedText) {
        await this.waitForDisplayed(element);
        const actualText = await element.getText();
        expect(actualText).toBe(expectedText);
    }

    /**
     * Verify element is displayed
     */
    async verifyElementDisplayed(element) {
        await this.waitForDisplayed(element);
        expect(await element.isDisplayed()).toBe(true);
    }
}

module.exports = BasePage;
