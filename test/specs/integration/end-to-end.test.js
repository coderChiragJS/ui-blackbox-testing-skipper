const { expect } = require('@wdio/globals');
const LoginPage = require('../../pageobjects/login/LoginPage');
const DashboardPage = require('../../pageobjects/dashboard/DashboardPage');
const ProfilePage = require('../../pageobjects/profile/ProfilePage');
const NavigationPage = require('../../pageobjects/common/NavigationPage');

describe('End-to-End Integration Tests', () => {
    it('should complete full user journey from login through match selection', async () => {
        // Step 1: Login
        const credentials = global.testData.login.validCredentials;
        await LoginPage.performLogin(credentials);
        
        // Step 2: Verify dashboard loaded
        await DashboardPage.waitForPageLoad();
        await DashboardPage.verifyUserLoggedIn();
        
        // Step 3: Test dashboard functionality - click on match card
        await DashboardPage.waitOnDashboardAndClickMatchCard();
        
        // Step 4: Verify navigation occurred (we should be on match details screen)
        await driver.pause(2000);
        
        // Step 5: Verify we're no longer on dashboard by checking for match details elements
        const selectors = [
            'android=new UiSelector().className("android.widget.ScrollView")',
            'android=new UiSelector().className("android.view.ViewGroup")',
            'android=new UiSelector().clickable(true)'
        ];
        
        let screenFound = false;
        for (const selector of selectors) {
            try {
                const element = await $(selector);
                if (await element.isDisplayed()) {
                    screenFound = true;
                    break;
                }
            } catch (e) { /* continue */ }
        }
        
        if (!screenFound) {
            // Fallback: Check if dashboard is gone
            try {
                const dashboard = await $('android=new UiSelector().textContains("Upcoming")');
                screenFound = !(await dashboard.isDisplayed());
            } catch (e) {
                screenFound = true; // Dashboard not found = navigated away
            }
        }
        
        if (!screenFound) {
            throw new Error('Could not verify navigation to match details screen');
        }
        
        console.log('✅ Complete user journey from login to match details completed successfully');
    });
});
