const BasePage = require('../base/BasePage');

/**
 * Country picker page object
 */
class CountryPickerPage extends BasePage {
    constructor() {
        super();
    }

    // Selectors
    get searchField() {
        return $('android=new UiSelector().className("android.widget.EditText")');
    }

    get countryList() {
        return $$('android=new UiSelector().className("android.widget.TextView")');
    }

    // Dynamic selectors
    getCountryByName(countryName) {
        return $(`android=new UiSelector().textContains("${countryName}")`);
    }

    getCountryByCode(countryCode) {
        return $(`android=new UiSelector().descriptionContains("${countryCode}")`);
    }

    // Actions
    async searchCountry(searchTerm) {
        if (await this.searchField.isExisting()) {
            await this.safeClick(this.searchField);
            await this.safeSetValue(this.searchField, searchTerm);
            await driver.pause(500); // Wait for search results
        }
    }

    async selectCountry(countryCode) {
        let selected = false;
        
        // Wait for the centered picker to appear
        await driver.pause(2000);
        
        // Strategy 1: Look for centered country options with flag emojis
        if (countryCode === '+91') {
            const indiaSelectors = [
                () => $('android=new UiSelector().textContains("🇮🇳").textContains("+91")'),
                () => $('android=new UiSelector().descriptionContains("🇮🇳").descriptionContains("+91")'),
                () => $('android=new UiSelector().textContains("🇮🇳 +91")'),
                () => $('android=new UiSelector().textContains("India")'),
                () => $('android=new UiSelector().textContains("+91")')
            ];
            
            for (const getSelector of indiaSelectors) {
                try {
                    const element = getSelector();
                    if (await element.isExisting()) {
                        await this.safeClick(element);
                        selected = true;
                        console.log('✅ Selected India (+91)');
                        break;
                    }
                } catch (e) {
                    // Continue to next selector
                }
            }
        }
        
        // Strategy 2: Try search if available and not selected yet
        if (!selected && await this.searchField.isExisting()) {
            try {
                const countryName = this.getCountryNameByCode(countryCode);
                await this.searchCountry(countryName);
                const countryOption = this.getCountryByName(countryName);
                await this.waitForDisplayed(countryOption, this.timeout.short);
                await this.safeClick(countryOption);
                selected = true;
            } catch (e) {
                console.log('Search strategy failed, trying direct selection');
            }
        }

        // Strategy 3: Direct selection by code
        if (!selected) {
            try {
                const countryByCode = this.getCountryByCode(countryCode);
                if (await countryByCode.isExisting()) {
                    await this.safeClick(countryByCode);
                    selected = true;
                }
            } catch (e) {
                console.log('Direct code selection failed');
            }
        }

        // Strategy 4: Scroll and find
        if (!selected) {
            await this.scrollAndSelectCountry(countryCode);
        }

        await this.takeScreenshot('country_selected');
    }

    async scrollAndSelectCountry(countryCode) {
        const maxScrolls = 10;
        let scrollCount = 0;
        
        while (scrollCount < maxScrolls) {
            try {
                const countryOption = this.getCountryByCode(countryCode);
                if (await countryOption.isExisting()) {
                    await this.safeClick(countryOption);
                    return;
                }
                
                // Scroll down
                await driver.execute('mobile: scroll', {
                    direction: 'down',
                    percent: 0.8
                });
                
                scrollCount++;
                await driver.pause(500);
            } catch (e) {
                console.log(`Scroll attempt ${scrollCount} failed:`, e.message);
                scrollCount++;
            }
        }
        
        throw new Error(`Could not find country with code: ${countryCode}`);
    }

    // Helper method to map country codes to names
    getCountryNameByCode(countryCode) {
        const countryMap = {
            '+91': 'India',
            '+1': 'United States',
            '+44': 'United Kingdom',
            '+86': 'China',
            '+81': 'Japan',
            '+49': 'Germany',
            '+33': 'France',
            '+39': 'Italy',
            '+7': 'Russia',
            '+55': 'Brazil'
        };
        
        return countryMap[countryCode] || 'Unknown';
    }

    // Validation methods
    async verifyCountryPickerDisplayed() {
        // Check if any country options are visible
        const countryOptions = await this.countryList;
        expect(countryOptions.length).toBeGreaterThan(0);
    }

    async verifySearchFieldExists() {
        const searchExists = await this.searchField.isExisting();
        expect(searchExists).toBe(true);
    }
}

module.exports = CountryPickerPage;
