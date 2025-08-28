const BasePage = require('../base/BasePage');

/**
 * Profile page object for user profile management
 */
class ProfilePage extends BasePage {
    constructor() {
        super();
    }

    // Profile selectors
    get profileImage() {
        return this.getByAccessibilityId('Profile Image');
    }

    get editProfileButton() {
        return this.getByAccessibilityId('Edit Profile');
    }

    get nameField() {
        return $('android=new UiSelector().resourceId("name_field")');
    }

    get emailField() {
        return $('android=new UiSelector().resourceId("email_field")');
    }

    get phoneField() {
        return $('android=new UiSelector().resourceId("phone_field")');
    }

    get saveButton() {
        return this.getByAccessibilityId('Save');
    }

    get cancelButton() {
        return this.getByAccessibilityId('Cancel');
    }

    // Actions
    async waitForPageLoad() {
        await this.waitForDisplayed(this.profileImage, this.timeout.medium);
        await this.takeScreenshot('profile_page_loaded');
    }

    async editProfile() {
        await this.safeClick(this.editProfileButton);
        await this.takeScreenshot('edit_profile_opened');
    }

    async updateName(name) {
        await this.safeSetValue(this.nameField, name);
    }

    async updateEmail(email) {
        await this.safeSetValue(this.emailField, email);
    }

    async updatePhone(phone) {
        await this.safeSetValue(this.phoneField, phone);
    }

    async saveProfile() {
        await this.safeClick(this.saveButton);
        await this.takeScreenshot('profile_saved');
    }

    async cancelEdit() {
        await this.safeClick(this.cancelButton);
    }

    // Validation methods
    async verifyProfilePageDisplayed() {
        await this.verifyElementDisplayed(this.profileImage);
        await this.verifyElementDisplayed(this.editProfileButton);
    }

    async verifyProfileUpdated(expectedName) {
        const actualName = await this.nameField.getValue();
        expect(actualName).toBe(expectedName);
    }
}

module.exports = new ProfilePage();
