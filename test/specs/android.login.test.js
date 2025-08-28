const { expect } = require('@wdio/globals');
const LoginPage = require('../pageobjects/login/LoginPage');

describe('Android Login Flow', () => {
    it('should select +91, fill credentials, accept age, and continue', async () => {
        try {
            // Start screen recording to visualize steps
            try { await driver.startRecordingScreen(); } catch (_) {}
            
            // Use new page object for login flow
            const credentials = global.testData.login.validCredentials;
            await LoginPage.performLogin(credentials);

            // Wait a bit to see what happens after continue
            await driver.pause(5000);

            // Save page source for debugging
            const pageSource = await driver.getPageSource();
            require('fs').writeFileSync('./pagesource-after-password.xml', pageSource);

            // 3) Select India +91 in the list
            // Try by code first, then by country name
            // Try 3 strategies to select India (+91): search field, text match, or manual swipes
            let selected = false;
            // Strategy A: search field present
            const searchFieldCandidates = await $$('android=new UiSelector().className("android.widget.EditText")');
            if (searchFieldCandidates.length > 0) {
                try {
                    await searchFieldCandidates[0].click();
                    await driver.pause(300);
                    await searchFieldCandidates[0].setValue('India');
                    await driver.pause(500);
                    const indiaByText = await $('android=new UiSelector().textContains("India")');
                    await indiaByText.waitForExist({ timeout: 5000 });
                    await indiaByText.click();
                    selected = true;
                } catch (_) { /* fall through */ }
            }
            // Strategy B: direct text/desc lookup without search
            if (!selected) {
                let indiaOption = await $('android=new UiSelector().textContains("India")');
                if (!(await indiaOption.isExisting())) {
                    indiaOption = await $('android=new UiSelector().descriptionContains("India")');
                }
                if (await indiaOption.isExisting()) {
                    await indiaOption.click();
                    selected = true;
                }
            }
            // Strategy C: swipe and search for '+91' or 'India'
            if (!selected) {
                const { height, width } = await driver.getWindowSize();
                const startX = Math.floor(width * 0.5);
                const startY = Math.floor(height * 0.8);
                const endY = Math.floor(height * 0.3);
                for (let i = 0; i < 8 && !selected; i++) {
                    // Try to find India or +91 on current view
                    let option = await $('android=new UiSelector().textContains("India")');
                    if (!(await option.isExisting())) {
                        option = await $('android=new UiSelector().textContains("+91")');
                    }
                    if (!(await option.isExisting())) {
                        option = await $('android=new UiSelector().descriptionContains("India")');
                    }
                    if (!(await option.isExisting())) {
                        option = await $('android=new UiSelector().descriptionContains("+91")');
                    }
                    if (await option.isExisting()) {
                        await option.click();
                        selected = true;
                        break;
                    }
                    // swipe up to load more
                    await driver.touchAction([
                        { action: 'press', x: startX, y: startY },
                        { action: 'wait', ms: 300 },
                        { action: 'moveTo', x: startX, y: endY },
                        { action: 'release' }
                    ]);
                }
            }
            if (!selected) {
                throw new Error('Could not select India (+91) in country picker');
            }

            // 4) Enter phone
            // Click then slow-type phone so it is visible
            await phoneField.click();
            await driver.pause(200);
            await phoneField.clearValue();
            for (const ch of '9993297888') {
                await phoneField.addValue(ch);
                await driver.pause(120);
            }
            // Verify phone got typed and capture screenshot
            const typedPhone = await phoneField.getText();
            await driver.saveScreenshot('./screenshot-phone-filled.png');
            expect(typedPhone).toContain('7888');

            // 5) Enter password
            const passwordField = await $('(//android.widget.EditText)[2]');
            await passwordField.waitForExist({ timeout: 20000 });
            await passwordField.click();
            await driver.pause(200);
            await passwordField.clearValue();
            // Use setValue to ensure exact password including special chars
            await passwordField.setValue('test@123');
            // Best-effort verification: masked fields may not expose text; still take a screenshot
            const srcAfterPwd = await driver.getPageSource();
            fs.writeFileSync('./pagesource-after-password.xml', srcAfterPwd);
            await driver.saveScreenshot('./screenshot-password-filled.png');

            // 6) Tick 18+ confirmation checkbox
            const ageCheckbox = await $('android=new UiSelector().className("android.widget.CheckBox")');
            await ageCheckbox.waitForExist({ timeout: 20000 });
            const checked = await ageCheckbox.getAttribute('checked');
            if (String(checked) !== 'true') {
                await ageCheckbox.click();
            }

            // 7) Tap Continue
            const continueBtn = await $('~Continue');
            await continueBtn.waitForExist({ timeout: 20000 });
            await continueBtn.click();
            await driver.saveScreenshot('./screenshot-after-continue.png');

            // 8) Basic post-action assertion placeholder (replace with a real element on the next screen)
            // Example: wait for OTP screen or home screen identifier
            // Placeholder assertion: wait for Continue to disappear (next screen)
            await continueBtn.waitForExist({ reverse: true, timeout: 30000 });
            // Optionally keep the app open after test run (set KEEP_APP_OPEN=1)
            if (process.env.KEEP_APP_OPEN === '1') {
                console.log('KEEP_APP_OPEN is set - keeping app open for 1 hour...');
                await driver.pause(60 * 60 * 1000);
            }
            // Stop and save video if supported (ignore if not available)
            try {
                const b64 = await driver.stopRecordingScreen();
                fs.writeFileSync('./login-run.mp4', Buffer.from(b64, 'base64'));
            } catch (_) {}
        } catch (error) {
            await driver.saveScreenshot('./error-screenshot.png');
            throw error;
        }
    });
});


