const { execSync } = require('child_process');
const path = require('path');

/**
 * Test Runner utility for executing different test suites
 */
class TestRunner {
    constructor() {
        this.configPath = path.join(__dirname, '../config');
        this.resultsPath = path.join(__dirname, '../../test-results');
    }

    /**
     * Run smoke tests
     */
    async runSmokeTests() {
        const configFile = path.join(this.configPath, 'main.conf.js');
        const specPath = path.join(__dirname, '../specs/smoke/**/*.js');
        const command = `npx wdio run ${configFile} --spec "${specPath}"`;
        
        console.log('Running smoke tests...');
        return this.executeCommand(command);
    }

    /**
     * Run regression tests
     */
    async runRegressionTests() {
        const configFile = path.join(this.configPath, 'main.conf.js');
        const specPath = path.join(__dirname, '../specs/regression/**/*.js');
        const command = `npx wdio run ${configFile} --spec "${specPath}"`;
        
        console.log('Running regression tests...');
        return this.executeCommand(command);
    }

    /**
     * Run full test suite
     */
    async runFullSuite() {
        const configFile = path.join(this.configPath, 'main.conf.js');
        const specPath = path.join(__dirname, '../specs/**/*.js');
        const command = `npx wdio run ${configFile} --spec "${specPath}"`;
        
        console.log('Running full test suite...');
        return this.executeCommand(command);
    }

    /**
     * Run specific test file
     */
    async runSpecificTest(testFile) {
        const configFile = path.join(this.configPath, 'main.conf.js');
        const command = `npx wdio run ${configFile} --spec "${testFile}"`;
        
        console.log(`Running specific test: ${testFile}...`);
        return this.executeCommand(command);
    }

    /**
     * Execute command with proper error handling
     */
    executeCommand(command) {
        try {
            const output = execSync(command, { 
                stdio: 'inherit',
                cwd: path.join(__dirname, '../..')
            });
            return { success: true, output };
        } catch (error) {
            console.error(`Command failed: ${command}`);
            console.error(error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Generate test report
     */
    generateReport() {
        try {
            // Generate Allure report if available
            execSync('npx allure generate allure-results --clean -o allure-report', {
                stdio: 'inherit',
                cwd: path.join(__dirname, '../..')
            });
            console.log('Test report generated successfully');
        } catch (error) {
            console.log('Could not generate Allure report:', error.message);
        }
    }
}

module.exports = new TestRunner();
