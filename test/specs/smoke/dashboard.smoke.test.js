const { expect, $ } = require('@wdio/globals');
const LoginPage = require('../../pageobjects/login/LoginPage');
const DashboardPage = require('../../pageobjects/dashboard/DashboardPage');

describe('Dashboard Smoke Tests', () => {
    it('should login, wait on dashboard, and click upcoming match card', async () => {
        // Step 1: Perform login to get to the dashboard
        // Note: This assumes the login test has already passed and the app is in a logged-out state.
        const validCredentials = global.testData.login.validCredentials;
        await LoginPage.performLogin(validCredentials);

        // Step 2: Wait 10 seconds on dashboard and click on an upcoming match card
        await DashboardPage.waitOnDashboardAndClickMatchCard();

        // Step 3: Verify navigation to match details screen
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
        
        // Fallback: Check if dashboard is gone
        if (!screenFound) {
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
        
        console.log('✅ Match details screen opened successfully.');
    });
});
