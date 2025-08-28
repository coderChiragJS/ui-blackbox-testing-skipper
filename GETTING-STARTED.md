# 🚀 Getting Started - For Complete Beginners

## What This Does
This project automatically tests the Skipper11 mobile app. The computer will:
- Open your app
- Click buttons
- Fill forms  
- Check if everything works
- Take screenshots
- Generate reports

## Prerequisites (What You Need)
- ✅ Computer with Node.js installed
- ✅ Android Studio with emulator
- ✅ The app file (skipper11-2025-08-25-debug.apk)

## Step-by-Step Setup

### 1️⃣ First Time Setup (5 minutes)
```bash
# Install dependencies
npm install

# Create folders for test results
npm run setup:dirs
```

### 2️⃣ Start Android Emulator
1. Open **Android Studio**
2. Click **"AVD Manager"** (phone icon)
3. Click **▶️ Play** button next to any device
4. Wait for emulator to fully load (shows home screen)

### 3️⃣ Run Your First Test
```bash
# Quick test (2-5 minutes)
npm run test:smoke
```

## Daily Usage

### Quick Commands
```bash
npm test           # Shows available options
npm run help       # Shows all commands
npm run test:smoke # Quick test (recommended)
npm run test:full  # Complete test (10-15 min)
```

### What Happens During Tests
1. **Appium starts automatically** (don't worry about errors initially)
2. **App opens on emulator** 
3. **Tests run automatically** (you'll see clicking, typing, etc.)
4. **Screenshots are saved** in `screenshots/` folder
5. **Results appear** in terminal

## Understanding Results

### ✅ Success Looks Like:
```
✓ should display login page elements correctly
✓ should successfully login with valid credentials  
✓ should select different country codes

3 passing (2m 15s)
```

### ❌ Failure Looks Like:
```
✗ should display login page elements correctly
  Error: Element not found
  
1 failing (45s)
```

## Troubleshooting Guide

### "Command not found: npm"
**Problem**: Node.js not installed  
**Solution**: Install Node.js from https://nodejs.org

### "Appium server not running"
**Problem**: Normal startup message  
**Solution**: Wait 30-60 seconds, Appium starts automatically

### "No devices found"
**Problem**: Emulator not running  
**Solution**: Start Android emulator first

### Tests are very slow
**Problem**: Normal behavior  
**Solution**: Tests take 2-15 minutes, be patient

### App doesn't open
**Problem**: APK file missing or wrong location  
**Solution**: Ensure `skipper11-2025-08-25-debug.apk` is in main folder

## File Structure (What Not to Touch)

### ✅ Safe to Look At:
- `README.md` - Documentation
- `screenshots/` - Test screenshots  
- `test-results/` - Test reports
- `allure-results/` - Detailed reports

### ⚠️ Don't Modify:
- `test/` folder - Test code
- `package.json` - Project settings
- `node_modules/` - Dependencies

### 🔧 Only for Developers:
- `test/config/` - Test configuration
- `test/pageobjects/` - App screen definitions
- `test/specs/` - Test scripts

## Getting Help

### Self-Help Checklist:
1. ✅ Is Android emulator running?
2. ✅ Is APK file in main folder?
3. ✅ Did you run `npm install`?
4. ✅ Are you waiting long enough? (tests are slow)

### When to Ask for Help:
- Tests fail consistently (3+ times)
- Error messages you don't understand
- Need to test new app features
- Want to modify test behavior

### What to Share When Asking for Help:
1. **Command you ran**: `npm run test:smoke`
2. **Error message**: Copy the red text
3. **Screenshots**: From `screenshots/` folder
4. **What you expected**: "Login should work"

## Next Steps

### Once Tests Work:
1. **Run tests regularly** (daily/weekly)
2. **Check screenshots** to see what happened
3. **Share results** with team
4. **Report issues** found by tests

### For Team Members:
- **QA Team**: Use `npm run test:full` before releases
- **Developers**: Use `npm run test:smoke` after code changes  
- **Managers**: Check `test-results/` for reports

---

**Remember**: You don't need to understand the code. Just follow the commands and the computer does the testing for you! 🤖
