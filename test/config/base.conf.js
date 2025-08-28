const { join } = require('path');

exports.config = {
    // Appium server configuration
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    protocol: 'http',
    
    // Runner Configuration
    runner: 'local',
    maxInstances: 1,
    
    // Test Configuration
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 30000,
    
    // Connection settings
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    
    // Framework
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 120000,
        retries: 2
    },
    
    // Reporters
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
        }],
        ['junit', {
            outputDir: './test-results',
            outputFileFormat: function(options) {
                return `results-${options.cid}-${options.capabilities}.xml`
            }
        }]
    ],
    
    // Services - Appium already running manually
    services: [],
    
    // Hooks
    beforeSession: function (config, capabilities, specs) {
        // Setup for test execution
    },
    
    before: function (capabilities, specs) {
        // Global test setup
        global.testData = require('../data/testData.json');
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
            
            // Save page source for debugging
            const pageSource = driver.getPageSource();
            require('fs').writeFileSync(`./page-sources/failed_${testName}.xml`, pageSource);
        }
    },
    
    onComplete: function(exitCode, config, capabilities, results) {
        // Generate reports, send notifications, etc.
        console.log('Test execution completed');
    }
};
