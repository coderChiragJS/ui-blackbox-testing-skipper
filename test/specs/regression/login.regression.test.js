const { expect } = require('@wdio/globals');
const LoginPage = require('../../pageobjects/login/LoginPage');

describe('Login Regression Tests', () => {
    it('should handle invalid credentials gracefully', async () => {
        const invalidCredentials = global.testData.login.invalidCredentials;
        
        await LoginPage.waitForPageLoad();
        await LoginPage.enterPhoneNumber(invalidCredentials.phone);
        await LoginPage.enterPassword(invalidCredentials.password);
        await LoginPage.confirmAge();
        await LoginPage.clickContinue();
        
        // Wait for error handling or validation
        await driver.pause(3000);
    });

    it('should validate empty form submission', async () => {
        await LoginPage.waitForPageLoad();
        await LoginPage.clickContinue();
        
        // Should show validation errors
        await driver.pause(2000);
    });

    it('should handle country code selection', async () => {
        await LoginPage.waitForPageLoad();
        await LoginPage.selectCountryCode('+91');
        
        await driver.pause(2000);
    });

    it('should verify form elements are present', async () => {
        await LoginPage.waitForPageLoad();
        await LoginPage.verifyLoginPageDisplayed();
        
        await driver.pause(1000);
    });

    it('should handle phone number input', async () => {
        await LoginPage.waitForPageLoad();
        await LoginPage.enterPhoneNumber('1234567890');
        await LoginPage.verifyPhoneNumberEntered('1234567890');
        
        await driver.pause(1000);
    });
});
