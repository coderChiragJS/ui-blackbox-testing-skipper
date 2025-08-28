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

    // Alternative selector for Upcoming Matches text
    get upcomingMatchesText() {
        return $('android=new UiSelector().text("Upcoming Matches")');
    }

    // Match cards under Upcoming Matches - more specific selector
    get matchCards() {
        return $$('android=new UiSelector().className("android.view.ViewGroup").clickable(true)');
    }

    // Alternative match cards selector
    get matchCardsList() {
        return $$('android=new UiSelector().resourceId("*match*")');
    }

    // ---------------------------
    // Actions
    // ---------------------------

    async waitOnDashboardAndClickMatchCard() {
        console.log('📱 Navigated to Dashboard - waiting 10 seconds...');
        
        // Wait for 10 seconds without performing any action
        await driver.pause(10000);
        await this.takeScreenshot('dashboard_after_10_seconds');
        
        console.log('🔍 Looking for "Upcoming Matches" text...');
        
        // Look for "Upcoming Matches" text with multiple selector strategies
        let upcomingMatchesElement;
        try {
            // Try accessibility ID first
            upcomingMatchesElement = await this.upcomingMatchesSection;
            await this.waitForDisplayed(upcomingMatchesElement, this.timeout.short);
        } catch (error) {
            console.log('Accessibility ID not found, trying text selector...');
            try {
                // Try text selector
                upcomingMatchesElement = await this.upcomingMatchesText;
                await this.waitForDisplayed(upcomingMatchesElement, this.timeout.short);
            } catch (textError) {
                console.log('Text selector also failed, trying broader search...');
                // Try finding any element containing "Upcoming"
                upcomingMatchesElement = $('android=new UiSelector().textContains("Upcoming")');
                await this.waitForDisplayed(upcomingMatchesElement, this.timeout.short);
            }
        }
        
        console.log('✅ Found "Upcoming Matches" section');
        await this.takeScreenshot('upcoming_matches_found');
        
        // Look for match cards below the "Upcoming Matches" text
        console.log('🎯 Looking for match cards...');
        
        // Try multiple strategies to find clickable cards
        let cards = [];
        
        // Strategy 1: Look for clickable ViewGroups
        try {
            cards = await this.matchCards;
            if (cards.length === 0) {
                throw new Error('No cards found with first strategy');
            }
        } catch (error) {
            console.log('First strategy failed, trying alternative selectors...');
            
            // Strategy 2: Look for cards with match-related resource IDs
            try {
                cards = await this.matchCardsList;
                if (cards.length === 0) {
                    throw new Error('No cards found with second strategy');
                }
            } catch (error2) {
                // Strategy 3: Look for any clickable elements below the Upcoming Matches text
                cards = await $$('android=new UiSelector().clickable(true)');
                // Filter to get elements that are likely match cards (below the text)
                const filteredCards = [];
                for (const card of cards) {
                    try {
                        const location = await card.getLocation();
                        const upcomingLocation = await upcomingMatchesElement.getLocation();
                        // Only consider elements below the "Upcoming Matches" text
                        if (location.y > upcomingLocation.y) {
                            filteredCards.push(card);
                        }
                    } catch (locError) {
                        // Skip this card if we can't get location
                        continue;
                    }
                }
                cards = filteredCards;
            }
        }
        
        if (cards.length === 0) {
            throw new Error('No upcoming match cards found after trying all strategies');
        }
        
        console.log(`🎮 Found ${cards.length} match cards, clicking on the first one...`);
        
        // Click on the first available card
        await this.safeClick(cards[0]);
        await this.takeScreenshot('match_card_clicked');
        
        console.log('✅ Successfully clicked on a match card');
    }
}

module.exports = new DashboardPage();
