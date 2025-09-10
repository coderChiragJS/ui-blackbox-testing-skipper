exports.config = {
    // Appium server configuration
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    protocol: 'http',
    
    // Runner Configuration
    runner: 'local',
    maxInstances: 1,
    
    // Test specs
    specs: [
        './test/specs/**/*.js'
    ],
    
    // Android capabilities - simplified for mobile
    capabilities: [{
        platformName: 'Android',
        'appium:deviceName': 'emulator-5554',
        'appium:app': process.env.APK_PATH || '/Users/chiragtankwal/projects/ui-test-blackbox/skipper11-2025-09-08-debug.apk',
        'appium:automationName': 'UiAutomator2',
        'appium:noReset': true,
        'appium:dontStopAppOnReset': true,
        'appium:autoGrantPermissions': true,
        'appium:newCommandTimeout': 600,
        // Disable problematic web-based features
        'appium:disableWindowAnimation': false,
        'appium:skipDeviceInitialization': false
    }],
    
    // Test Configuration
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 30000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    
    // Framework
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 120000
    },
    
    // Reporters
    reporters: ['spec'],
    
    // Run Appium manually to avoid startup race/warnings from service
    services: [],
    
    // Hooks
    before: function (capabilities, specs) {
        // Load test data
        global.testData = require('./test/data/testData.json');
    },
    
    beforeTest: function (test, context) {
        // Take screenshot before each test
        const testName = test.title.replace(/\s+/g, '_');
        driver.saveScreenshot(`./screenshots/before_${testName}.png`);
    },
    
    afterTest: function(test, context, { error, result, duration, passed, retries }) {
        if (!passed) {
            const testName = test.title.replace(/\s+/g, '_');
            driver.saveScreenshot(`./screenshots/failed_${testName}.png`);
        }
    },
    
    after: async function(result, capabilities, specs) {
        try {
            if (global.browser && browser.sessionId && typeof browser.pause === 'function') {
                console.log('🔄 Keeping app open for manual inspection...');
                console.log('📱 App will remain open - press Ctrl+C to close when done');
                await browser.pause(300000);
            }
        } catch (e) {
            // No active session; nothing to keep open
        }
    }
};
