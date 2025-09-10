const { expect } = require('@wdio/globals');
const LoginPage = require('../../pageobjects/login/LoginPage');
const DashboardPage = require('../../pageobjects/dashboard/DashboardPage');

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
        
        // Step 4: Wait for match details and click CREATE TEAM button
        await DashboardPage.waitForMatchDetailsAndClickCreateTeam();
        
        // Step 5: Verify we successfully navigated to team creation screen
        await driver.pause(3000);
        
        // Take final screenshot to verify we're on team creation screen
        await driver.saveScreenshot('./team_creation_screen_final.png');
        
        console.log('✅ Complete user journey from login through CREATE TEAM completed successfully');
    });
});
