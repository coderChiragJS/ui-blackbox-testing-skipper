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

    // Profile navigation button
    get profileButton() {
        return $('android=new UiSelector().textContains("Profile")');
    }

    // Settings navigation button  
    get settingsButton() {
        return $('android=new UiSelector().textContains("Settings")');
    }

    // Dashboard indicator elements
    get dashboardTitle() {
        return $('android=new UiSelector().textContains("Dashboard")');
    }

    // CREATE TEAM button selectors - multiple strategies for robustness
    get createTeamButton() {
        return $('android=new UiSelector().text("CREATE TEAM")');
    }

    get createTeamButtonByDesc() {
        return $('android=new UiSelector().description("CREATE TEAM")');
    }

    get createTeamButtonByContains() {
        return $('android=new UiSelector().textContains("CREATE")');
    }

    get createTeamButtonByClass() {
        return $('android=new UiSelector().className("android.widget.Button").textContains("CREATE")');
    }

    // ---------------------------
    // Actions
    // ---------------------------

    async waitForPageLoad() {
        try {
            await this.waitForDisplayed(this.upcomingMatchesSection, this.timeout.medium);
        } catch (error) {
            await this.waitForDisplayed(this.upcomingMatchesText, this.timeout.medium);
        }
        await this.takeScreenshot('dashboard_loaded');
    }

    async verifyUserLoggedIn() {
        // Verify we're on dashboard by checking for upcoming matches section
        const isUpcomingVisible = await this.upcomingMatchesText.isDisplayed().catch(() => false);
        const isUpcomingAccessible = await this.upcomingMatchesSection.isDisplayed().catch(() => false);
        
        if (!isUpcomingVisible && !isUpcomingAccessible) {
            throw new Error('User not logged in - dashboard not displayed');
        }
        
        console.log('✅ User successfully logged in and dashboard displayed');
        await this.takeScreenshot('user_logged_in_verified');
    }

    async verifyDashboardDisplayed() {
        await this.verifyUserLoggedIn();
    }

    async openProfile() {
        await this.safeClick(this.profileButton);
        await this.takeScreenshot('profile_opened');
        console.log('✅ Profile opened');
    }

    async openSettings() {
        await this.safeClick(this.settingsButton);
        await this.takeScreenshot('settings_opened');
        console.log('✅ Settings opened');
    }

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

    async waitForMatchDetailsAndClickCreateTeam() {
        console.log('⏳ Waiting for Match Details screen to load...');
        
        // Wait for match details screen to load
        await driver.pause(3000);
        await this.takeScreenshot('match_details_loaded');
        
        console.log('🔍 Looking for CREATE TEAM button...');
        
        // Try multiple strategies to find the CREATE TEAM button
        let createTeamBtn;
        let found = false;
        
        // Strategy 1: Exact text match
        try {
            createTeamBtn = this.createTeamButton;
            await this.waitForDisplayed(createTeamBtn, this.timeout.short);
            found = true;
            console.log('✅ Found CREATE TEAM button using exact text match');
        } catch (error) {
            console.log('Exact text match failed, trying description...');
        }
        
        // Strategy 2: Description match
        if (!found) {
            try {
                createTeamBtn = this.createTeamButtonByDesc;
                await this.waitForDisplayed(createTeamBtn, this.timeout.short);
                found = true;
                console.log('✅ Found CREATE TEAM button using description');
            } catch (error) {
                console.log('Description match failed, trying text contains...');
            }
        }
        
        // Strategy 3: Text contains "CREATE"
        if (!found) {
            try {
                createTeamBtn = this.createTeamButtonByContains;
                await this.waitForDisplayed(createTeamBtn, this.timeout.short);
                found = true;
                console.log('✅ Found CREATE TEAM button using text contains');
            } catch (error) {
                console.log('Text contains failed, trying class + text...');
            }
        }
        
        // Strategy 4: Button class with CREATE text
        if (!found) {
            try {
                createTeamBtn = this.createTeamButtonByClass;
                await this.waitForDisplayed(createTeamBtn, this.timeout.short);
                found = true;
                console.log('✅ Found CREATE TEAM button using class + text');
            } catch (error) {
                console.log('Class + text failed, trying broad search...');
            }
        }
        
        // Strategy 5: Broad search for any button with "+" or "CREATE"
        if (!found) {
            try {
                // Look for buttons with "+" symbol or "CREATE" text
                const buttons = await $$('android=new UiSelector().clickable(true)');
                for (const button of buttons) {
                    try {
                        const text = await button.getText();
                        const desc = await button.getAttribute('content-desc');
                        if (text.includes('CREATE') || text.includes('+') || 
                            desc.includes('CREATE') || desc.includes('+')) {
                            createTeamBtn = button;
                            found = true;
                            console.log('✅ Found CREATE TEAM button using broad search');
                            break;
                        }
                    } catch (e) {
                        // Skip this button if we can't get its text/description
                        continue;
                    }
                }
            } catch (error) {
                console.log('Broad search also failed');
            }
        }
        
        if (!found) {
            throw new Error('CREATE TEAM button not found after trying all strategies');
        }
        
        // Click the CREATE TEAM button
        console.log('🎯 Clicking CREATE TEAM button...');
        await this.safeClick(createTeamBtn);
        await this.takeScreenshot('create_team_clicked');
        
        console.log('✅ Successfully clicked CREATE TEAM button');
        
        // Wait for team creation screen to load
        await driver.pause(2000);
        await this.takeScreenshot('team_creation_screen');
    }
}

module.exports = new DashboardPage();
