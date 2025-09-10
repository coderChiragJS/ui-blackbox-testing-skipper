#!/bin/bash

# Maestro Test Runner Script for Skipper11 App
# Provides easy commands to run different test suites

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Maestro is installed
check_maestro() {
    if ! command -v maestro &> /dev/null; then
        print_error "Maestro CLI is not installed!"
        print_status "Please install Maestro: https://maestro.mobile.dev/getting-started/installing-maestro"
        exit 1
    fi
    print_success "Maestro CLI is installed"
}

# Check if emulator is running
check_emulator() {
    if ! adb devices | grep -q "emulator-5554"; then
        print_warning "Emulator emulator-5554 not found"
        print_status "Please start your Android emulator first"
        print_status "Expected emulator: emulator-5554"
    else
        print_success "Emulator emulator-5554 is running"
    fi
}

# Create directories for reports and screenshots
setup_directories() {
    mkdir -p maestro-screenshots
    mkdir -p maestro-reports
    print_success "Created output directories"
}

# Show help
show_help() {
    echo ""
    echo "🎮 Maestro Test Runner for Skipper11 App"
    echo "========================================="
    echo ""
    echo "Usage: ./run-tests.sh [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  smoke         Run smoke tests (login + dashboard)"
    echo "  login         Run login test only"
    echo "  dashboard     Run dashboard test only"
    echo "  full          Run complete user journey test"
    echo "  regression    Run regression tests"
    echo "  country       Run country picker tests"
    echo "  all           Run all test flows"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./run-tests.sh smoke"
    echo "  ./run-tests.sh login"
    echo "  ./run-tests.sh all"
    echo ""
}

# Run smoke tests
run_smoke() {
    print_status "Running smoke tests..."
    maestro test maestro/flows/login.yaml
    maestro test maestro/flows/dashboard.yaml
    print_success "Smoke tests completed!"
}

# Run individual tests
run_login() {
    print_status "Running login test..."
    maestro test maestro/flows/login.yaml
    print_success "Login test completed!"
}

run_dashboard() {
    print_status "Running dashboard test..."
    maestro test maestro/flows/dashboard.yaml
    print_success "Dashboard test completed!"
}

run_full() {
    print_status "Running full flow test..."
    maestro test maestro/flows/full-flow.yaml
    print_success "Full flow test completed!"
}

run_regression() {
    print_status "Running regression tests..."
    maestro test maestro/flows/regression-login.yaml
    print_success "Regression tests completed!"
}

run_country() {
    print_status "Running country picker tests..."
    maestro test maestro/flows/country-picker.yaml
    print_success "Country picker tests completed!"
}

# Run all tests
run_all() {
    print_status "Running all test flows..."
    maestro test maestro/flows/login.yaml
    maestro test maestro/flows/dashboard.yaml
    maestro test maestro/flows/full-flow.yaml
    maestro test maestro/flows/country-picker.yaml
    maestro test maestro/flows/regression-login.yaml
    print_success "All tests completed!"
}

# Main script logic
main() {
    print_status "Maestro Test Runner for Skipper11 App"
    print_status "======================================"
    
    # Pre-flight checks
    check_maestro
    check_emulator
    setup_directories
    
    # Handle command line arguments
    case "${1:-help}" in
        "smoke")
            run_smoke
            ;;
        "login")
            run_login
            ;;
        "dashboard")
            run_dashboard
            ;;
        "full")
            run_full
            ;;
        "regression")
            run_regression
            ;;
        "country")
            run_country
            ;;
        "all")
            run_all
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function with all arguments
main "$@"
