const { join } = require('path');

exports.config = {
    // Appium server address - using default Appium settings
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',  // Using root path as per Appium's default
    protocol: 'http',
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    
    // Test specs: run all Android tests matching this pattern
    specs: [
        './test/specs/android*.test.js'
    ],
    
    // Capabilities
    capabilities: [{
        platformName: 'Android',
        'appium:deviceName': 'emulator-5554',
        'appium:app': '/Users/chiragtankwal/projects/ui-test-blackbox/skipper11-2025-08-25-debug.apk',
        'appium:automationName': 'UiAutomator2',
        // Keep app state between runs so it doesn't close/logout
        'appium:noReset': true,
        // Try not to stop app on session reset
        'appium:dontStopAppOnReset': true,
        'appium:fullReset': false,
        'appium:appWaitActivity': '*',
        'appium:appWaitDuration': 30000,
        'appium:autoGrantPermissions': true,
        'appium:newCommandTimeout': 300,
        'appium:adbExecTimeout': 120000,
        'appium:uiautomator2ServerLaunchTimeout': 120000,
        'appium:uiautomator2ServerInstallTimeout': 120000,
        'appium:appWaitForLaunch': true,
        'appium:ignoreHiddenApiPolicyError': true,
        'appium:disableWindowAnimation': true
    }],
    
    // Test framework
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 120000  // Increased timeout
    },
    
    // Hooks
    before: function() {
        // Add any setup code here
    },
    
    after: async function() {
        const { exec } = require('child_process');
        // If flag set, keep the app open by sleeping instead of quitting session
        if (process.env.KEEP_APP_OPEN === '1') {
            console.log('KEEP_APP_OPEN is set - keeping session alive for 1 hour');
            await browser.pause(60 * 60 * 1000);
            return;
        }

        // If flag set, relaunch the app right after the session ends
        if (process.env.KEEP_APP_RELAUNCH === '1') {
            try {
                const pkg = await driver.getCurrentPackage();
                // Delay and relaunch via monkey to default activity
                const cmd = `bash -lc 'sleep 2; adb shell monkey -p ${pkg} -c android.intent.category.LAUNCHER 1'`;
                console.log(`Scheduling app relaunch for package: ${pkg}`);
                exec(cmd, { detached: true, stdio: 'ignore' });
            } catch (e) {
                console.warn('Failed to schedule relaunch:', e?.message || e);
            }
        }
    },
    
    // Reporters
    reporters: ['spec'],
    
    // Disable automatic Appium service since we're starting it manually
    services: []
};
