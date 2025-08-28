const { expect } = require('@wdio/globals');
const LoginPage = require('../../pageobjects/login/LoginPage');
const DashboardPage = require('../../pageobjects/dashboard/DashboardPage');
const ProfilePage = require('../../pageobjects/profile/ProfilePage');
const NavigationPage = require('../../pageobjects/common/NavigationPage');

describe('End-to-End Integration Tests', () => {
    it('should complete full user journey from login to profile update', async () => {
        // Step 1: Login
        const credentials = global.testData.login.validCredentials;
        await LoginPage.performLogin(credentials);
        
        // Step 2: Verify dashboard loaded
        await DashboardPage.waitForPageLoad();
        await DashboardPage.verifyUserLoggedIn();
        
        // Step 3: Navigate to profile
        await DashboardPage.openProfile();
        await ProfilePage.waitForPageLoad();
        
        // Step 4: Edit profile
        await ProfilePage.editProfile();
        await ProfilePage.updateName('Test User Updated');
        await ProfilePage.saveProfile();
        
        // Step 5: Navigate back to dashboard
        await NavigationPage.goBack();
        await DashboardPage.verifyDashboardDisplayed();
        
        // Complete flow verification
        await driver.pause(2000);
    });

    it('should handle navigation flow across multiple screens', async () => {
        const credentials = global.testData.login.validCredentials;
        await LoginPage.performLogin(credentials);
        
        await DashboardPage.waitForPageLoad();
        await NavigationPage.verifyNavigationElementsPresent();
        
        // Test navigation to different sections
        await DashboardPage.openSettings();
        await driver.pause(1000);
        
        await NavigationPage.goBack();
        await DashboardPage.verifyDashboardDisplayed();
    });
});
