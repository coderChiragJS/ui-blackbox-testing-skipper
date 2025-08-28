const BasePage = require('../base/BasePage');

class DashboardPage extends BasePage {
    constructor() {
        super();
    }

    // ---------------------------
    // Selectors
    // ---------------------------

    // Upcoming Matches section title
    get upcomingMatchesSection() {
        return this.getByAccessibilityId('Upcoming Matches');
    }

    // Match cards under Upcoming Matches
    get matchCards() {
        return $$('android=new UiSelector().className("android.view.ViewGroup")');
    }

    // ---------------------------
    // Actions
    // ---------------------------

    async openFirstUpcomingMatch() {
        // Wait for Upcoming Matches section
        await this.waitForDisplayed(this.upcomingMatchesSection, this.timeout.medium);

        // Collect cards
        const cards = await this.matchCards;
        if (cards.length === 0) {
            throw new Error('No upcoming match cards found');
        }

        // Click first card
        await this.safeClick(cards[0]);
        await this.takeScreenshot('first_match_opened');
    }
}

module.exports = new DashboardPage();
