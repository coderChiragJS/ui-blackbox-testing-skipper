const { expect } = require('@wdio/globals');
const LoginPage = require('../pageobjects/login/LoginPage');

describe('Android Login Flow', () => {
    it('should complete login flow using page object', async () => {
        try {
            // Start screen recording to visualize steps
            try { await driver.startRecordingScreen(); } catch (_) {}
            
            // Use page object for login flow
            const credentials = global.testData.login.validCredentials;
            await LoginPage.performLogin(credentials);

            // Wait for navigation to next screen
            await driver.pause(5000);

            // Verify login success
            await LoginPage.verifyLoginSuccess();

            // Optionally keep the app open after test run (set KEEP_APP_OPEN=1)
            if (process.env.KEEP_APP_OPEN === '1') {
                console.log('KEEP_APP_OPEN is set - keeping app open for 1 hour...');
                await driver.pause(60 * 60 * 1000);
            }
            
            // Stop and save video if supported (ignore if not available)
            try {
                const b64 = await driver.stopRecordingScreen();
                require('fs').writeFileSync('./login-run.mp4', Buffer.from(b64, 'base64'));
            } catch (_) {}
            
            console.log('✅ Login flow completed successfully');
        } catch (error) {
            await driver.saveScreenshot('./error-screenshot.png');
            throw error;
        }
    });
});


