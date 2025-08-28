const BasePage = require('../base/BasePage');
const CountryPickerPage = require('./CountryPickerPage');

/**
 * Login page object with enhanced selectors and methods
 */
class LoginPage extends BasePage {
    constructor() {
        super();
        this.countryPicker = new CountryPickerPage();
    }

    // Selectors
    get loginTitle() {
        return this.getByAccessibilityId('Login');
    }

    get countryCodeButton() {
        return this.getByXPath('//android.view.View[contains(@content-desc, "+")]');
    }

    get phoneNumberField() {
        return $('(//android.widget.EditText)[1]');
    }

    get passwordField() {
        return $('(//android.widget.EditText)[2]');
    }

    get ageConfirmationCheckbox() {
        return $('android=new UiSelector().className("android.widget.CheckBox")');
    }

    get continueButton() {
        return this.getByAccessibilityId('Continue');
    }

    get passwordVisibilityToggle() {
        return $('//android.widget/EditText[@password="true"]//android.widget.Button');
    }

    // Popup close button (cross icon on top-right corner)
    get popupCloseButton() {
        return this.getByXPath(
            '//android.widget.ImageView[contains(@content-desc,"close") or contains(@resource-id,"close")]'
        );
    }

    // Page Actions
    async waitForPageLoad() {
        await this.waitForDisplayed(this.loginTitle, this.timeout.long);
        await this.takeScreenshot('login_page_loaded');
    }

    async selectCountryCode(countryCode = '+91') {
        await this.safeClick(this.countryCodeButton);
        await this.takeScreenshot('country_picker_opened');
        await this.countryPicker.selectCountry(countryCode);
    }

    async enterPhoneNumber(phoneNumber) {
        await this.waitForDisplayed(this.phoneNumberField, this.timeout.medium);
        await this.phoneNumberField.click();
        await driver.pause(500);
        await this.phoneNumberField.clearValue();
        await this.phoneNumberField.setValue(phoneNumber);
        await this.takeScreenshot('phone_number_entered');
    }

    async enterPassword(password) {
        await this.waitForDisplayed(this.passwordField, this.timeout.medium);
        await this.passwordField.click();
        await driver.pause(500);
        await this.passwordField.clearValue();
        await this.passwordField.setValue(password);
        await this.takeScreenshot('password_entered');
    }

    async togglePasswordVisibility() {
        await this.safeClick(this.passwordVisibilityToggle);
    }

    async confirmAge() {
        // Wait for checkbox to be available
        await this.waitForDisplayed(this.ageConfirmationCheckbox, this.timeout.medium);
        
        // Check if already checked
        const isChecked = await this.ageConfirmationCheckbox.getAttribute('checked');
        if (String(isChecked) !== 'true') {
            await this.safeClick(this.ageConfirmationCheckbox);
            await driver.pause(1000); // Wait for state change
            
            // Verify it got checked
            const newState = await this.ageConfirmationCheckbox.getAttribute('checked');
            if (String(newState) !== 'true') {
                throw new Error('Age confirmation checkbox was not checked successfully');
            }
        }
        await this.takeScreenshot('age_confirmed');
    }

    async clickContinue() {
        await this.safeClick(this.continueButton);
        await this.takeScreenshot('continue_clicked');
    }

    // Complete login flow
    async performLogin(credentials) {
        const { phone, password, countryCode } = credentials;

        await this.waitForPageLoad();
        await this.selectCountryCode(countryCode);
        await this.enterPhoneNumber(phone);
        await this.enterPassword(password);
        await this.confirmAge();
        
        // Validate all fields are properly filled before continuing
        await this.validateAllFieldsComplete(phone);
        
        await this.clickContinue();

        // Verify success after login
        await this.verifyLoginSuccess();
    }

    // Validate all required fields are complete
    async validateAllFieldsComplete(expectedPhone) {
        // Verify phone number is entered
        const phoneValue = await this.phoneNumberField.getAttribute('text');
        if (!phoneValue || phoneValue.trim() === '') {
            throw new Error('Phone number field is empty');
        }

        // Verify password field has content (can't read actual password)
        const passwordExists = await this.passwordField.isDisplayed();
        if (!passwordExists) {
            throw new Error('Password field not found');
        }

        // Verify checkbox is checked
        const isChecked = await this.ageConfirmationCheckbox.getAttribute('checked');
        if (String(isChecked) !== 'true') {
            throw new Error('Age confirmation checkbox is not checked');
        }

        // Verify continue button is enabled
        const continueEnabled = await this.continueButton.isEnabled();
        if (!continueEnabled) {
            throw new Error('Continue button is not enabled - form may be incomplete');
        }

        await this.takeScreenshot('all_fields_validated');
    }

    // Verify login success (popup first, then proceed)
    async verifyLoginSuccess() {
        // Step 1: Wait for login screen to disappear
        await this.waitForElementNotDisplayed(this.loginTitle, 10000);

        // Step 2: If popup appears, close it
        if (await this.popupCloseButton.isDisplayed().catch(() => false)) {
            await this.safeClick(this.popupCloseButton);
            await this.takeScreenshot('popup_closed');
        }

        // Step 3: Final confirmation screenshot
        await this.takeScreenshot('login_success');
    }

    // Validation methods
    async verifyLoginPageDisplayed() {
        await this.verifyElementDisplayed(this.loginTitle);
        await this.verifyElementDisplayed(this.phoneNumberField);
        await this.verifyElementDisplayed(this.passwordField);
        await this.verifyElementDisplayed(this.continueButton);
    }

    async verifyPhoneNumberEntered(expectedNumber) {
        const actualValue = await this.phoneNumberField.getAttribute('text');
        expect(actualValue).toBe(expectedNumber);
    }

    async verifyAgeConfirmationChecked() {
        const isChecked = await this.ageConfirmationCheckbox.getAttribute('checked');
        expect(isChecked).toBe('true');
    }

    async verifyContinueButtonEnabled() {
        const isEnabled = await this.continueButton.isEnabled();
        expect(isEnabled).toBe(true);
    }
}

module.exports = new LoginPage();
