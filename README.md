# 📱 Mobile App Testing - Simple & Easy

> **For Beginners**: This project tests the Skipper11 Android app automatically. No coding experience needed!

## 🚀 Quick Start (3 Steps)

### Step 1: Setup (One Time Only)
```bash
npm install
npm run setup:dirs
```

### Step 2: Start Your Android Emulator
- Open Android Studio
- Start any Android emulator
- Make sure the app APK is in the project folder

### Step 3: Run Tests
```bash
npm run test:smoke    # Quick 5-minute test
npm run test:full     # Complete test suite
```

## 📁 What's Inside (Simple Explanation)

```
📦 Project Root
├── 📱 skipper11-2025-08-25-debug.apk  # The app we're testing
├── 📋 package.json                     # Project settings (don't touch)
├── 📖 README.md                        # This file
│
├── 🧪 test/                           # All test files live here
│   ├── ⚙️  config/                    # Settings for tests
│   │   └── main.conf.js               # Main configuration
│   │
│   ├── 📄 data/                       # Test information
│   │   └── testData.json              # Login details, etc.
│   │
│   ├── 📱 pageobjects/                # App screen definitions
│   │   ├── login/                     # Login screen
│   │   ├── dashboard/                 # Home screen
│   │   └── profile/                   # Profile screen
│   │
│   └── 🧪 specs/                      # Actual tests
│       ├── smoke/                     # Quick tests
│       └── regression/                # Detailed tests
│
├── 📊 screenshots/                    # Test screenshots
├── 📋 test-results/                   # Test reports
└── 🗂️  allure-results/               # Detailed reports

## 🎮 Running Tests

### Prerequisites
1. **APK File**: Place your Android APK file in the project directory
2. **Appium Server**: Make sure Appium server is running on `127.0.0.1:4723`
3. **Android Emulator**: Ensure emulator `emulator-5554` is running

### Quick Start
```bash
# Set APK path and run smoke tests
export APK_PATH="/path/to/your/app.apk"
npm run test:smoke

# Or specify APK inline
APK_PATH="/path/to/your/app.apk" npm run test:smoke

# Run specific test suites
npm run test:login      # Login functionality only
npm run test:dashboard  # Dashboard functionality only
npm run test:regression # Error handling tests
npm run test:full       # All tests

# Generate HTML report after tests
npm run test:report
```

### Example with APK
```bash
# If your APK is in the project root
export APK_PATH="./your-app.apk"
npm run test:smoke
```

## 🔧 Before Running Tests

### ✅ Checklist
- [ ] Android emulator is running
- [ ] App APK file is in project folder
- [ ] Ran `npm install` once
- [ ] Ran `npm run setup:dirs` once

### 📱 Emulator Setup
1. Open Android Studio
2. Click "AVD Manager" 
3. Start any Android device
4. Wait for it to fully load

## 📊 Understanding Results

### ✅ Test Passed
- Green checkmarks ✅
- Screenshots in `screenshots/` folder
- Test completed successfully

### ❌ Test Failed  
- Red X marks ❌
- Error screenshots saved automatically
- Check `test-results/` for details

## 🆘 Common Problems & Solutions

### Problem: "Appium server not running"
**Solution**: The test will start Appium automatically. Just wait.

### Problem: "App not found"
**Solution**: Make sure the APK file is in the main project folder.

### Problem: "No devices found"
**Solution**: Start your Android emulator first.

### Problem: Tests are slow
**Solution**: This is normal. Tests take 2-15 minutes depending on type.

## 📝 Adding New Tests

### For Non-Coders:
1. Ask a developer to add new tests
2. Provide clear steps of what to test
3. Specify expected results

### For Developers:
1. Add page objects in `test/pageobjects/`
2. Create test files in `test/specs/`
3. Update test data in `test/data/testData.json`

## 🎯 What Gets Tested

- ✅ App launches correctly
- ✅ Login screen appears
- ✅ Country code selection works
- ✅ Phone number input works  
- ✅ Password input works
- ✅ Age confirmation works
- ✅ Continue button works
- ✅ Error handling

## 📞 Need Help?

1. **Check screenshots** in `screenshots/` folder
2. **Check test results** in `test-results/` folder  
3. **Run again** - sometimes tests fail randomly
4. **Ask the team** - share the error message

---

**Remember**: This is automated testing. The computer will control your phone/emulator and test the app automatically. Just sit back and watch! 🍿
