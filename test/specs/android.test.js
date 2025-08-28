const { expect } = require('@wdio/globals');

// Test suite for Android app testing
describe('Android App Test', () => {
    // Test case to verify app launch
    it('should open the app successfully', async () => {
        try {
            // Wait for the app to be installed and launched
            await driver.pause(5000);
            
            // Take a screenshot for debugging
            await driver.saveScreenshot('./screenshot.png');
            
            // Verify the app is running by checking the page source
            const source = await driver.getPageSource();
            expect(source).toBeTruthy();
            console.log('App launched successfully!');
            
        } catch (error) {
            console.error('Test failed:', error);
            // Take screenshot on failure
            await driver.saveScreenshot('./error-screenshot.png');
            throw error;
        }
    });
});
