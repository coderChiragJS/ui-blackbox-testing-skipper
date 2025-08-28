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

        // Step 3: Verify that the match details screen is displayed
        // We'll look for a generic ScrollView, which is a common container on new screens.
        const matchDetailsScreen = $('android=new UiSelector().className("android.widget.ScrollView")');
        await expect(matchDetailsScreen).toBeDisplayed();
        
        console.log('✅ Match details screen opened successfully.');
    });
});
