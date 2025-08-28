const { expect } = require('@wdio/globals');
const LoginPage = require('../../pageobjects/login/LoginPage');

describe('Login Smoke Tests', () => {
    it('should complete full login flow', async () => {
        // Step 1: Verify login page elements
        await LoginPage.waitForPageLoad();
        await LoginPage.verifyLoginPageDisplayed();
        
        // Step 2: Perform login with valid credentials
        const validCredentials = global.testData.login.validCredentials;
        await LoginPage.performLogin(validCredentials);
        
        // Step 3: Wait for navigation to next screen
        await driver.pause(5000);
        
        // Step 4: Verify actual login success
        await LoginPage.verifyLoginSuccess();
        
        // Step 5: Save page source for debugging
        const pageSource = await driver.getPageSource();
        require('fs').writeFileSync('./pagesource-after-login.xml', pageSource);
        
        console.log('✅ Login flow completed successfully');
    });
});
