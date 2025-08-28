const BasePage = require('../base/BasePage');

/**
 * Common navigation elements across the app
 */
class NavigationPage extends BasePage {
    constructor() {
        super();
    }

    // Common navigation selectors
    get backButton() {
        return this.getByAccessibilityId('Back');
    }

    get homeButton() {
        return this.getByAccessibilityId('Home');
    }

    get navigationDrawer() {
        return $('android=new UiSelector().className("android.widget.DrawerLayout")');
    }

    get hamburgerMenu() {
        return this.getByAccessibilityId('Menu');
    }

    // Bottom navigation (if exists)
    get bottomNavigation() {
        return $('android=new UiSelector().resourceId("bottom_navigation")');
    }

    // Actions
    async goBack() {
        await this.safeClick(this.backButton);
        await this.takeScreenshot('navigation_back');
    }

    async goHome() {
        await this.safeClick(this.homeButton);
        await this.takeScreenshot('navigation_home');
    }

    async openNavigationDrawer() {
        await this.safeClick(this.hamburgerMenu);
        await this.takeScreenshot('navigation_drawer_opened');
    }

    async navigateToSection(sectionName) {
        await this.openNavigationDrawer();
        const sectionElement = this.getByAccessibilityId(sectionName);
        await this.safeClick(sectionElement);
        await this.takeScreenshot(`navigation_to_${sectionName.toLowerCase()}`);
    }

    // Validation methods
    async verifyNavigationElementsPresent() {
        // Check if basic navigation elements are present
        const elements = [this.backButton, this.homeButton];
        for (const element of elements) {
            if (await element.isExisting()) {
                await this.verifyElementDisplayed(element);
            }
        }
    }
}

module.exports = new NavigationPage();
