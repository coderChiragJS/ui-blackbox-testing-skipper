const { config } = require('./base.conf');

// Main test configuration
exports.config = {
    ...config,
    
    // Test specs
    specs: [
        './test/specs/**/*.js'
    ],
    
    // Android capabilities
    capabilities: [{
        platformName: 'Android',
        'appium:deviceName': 'emulator-5554',
        'appium:app': '/Users/chiragtankwal/projects/ui-test-blackbox/skipper11-2025-08-25-debug.apk',
        'appium:automationName': 'UiAutomator2',
        'appium:noReset': true,
        'appium:dontStopAppOnReset': true,
        'appium:fullReset': false,
        'appium:autoGrantPermissions': true,
        'appium:newCommandTimeout': 300,
        'appium:appWaitActivity': '*',
        'appium:appWaitDuration': 30000,
        'appium:adbExecTimeout': 120000,
        'appium:uiautomator2ServerLaunchTimeout': 120000,
        'appium:uiautomator2ServerInstallTimeout': 120000,
        'appium:appWaitForLaunch': true,
        'appium:ignoreHiddenApiPolicyError': true,
        // Enable animations and visual feedback
        'appium:disableWindowAnimation': false,
        'appium:skipDeviceInitialization': false,
        'appium:skipServerInstallation': false,
        // Make actions visible
        'appium:actionWaitDuration': 1000,
        'appium:waitForIdleTimeout': 1000
    }],
    
    // Test settings
    logLevel: 'info',
    
    // Setup
    before: function (capabilities, specs) {
        config.before(capabilities, specs);
        process.env.TEST_ENV = 'test';
    }
};
