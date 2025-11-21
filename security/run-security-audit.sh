#!/bin/bash
# =============================================================================
# OWASP Security Audit Runner for Museo MARCO
# =============================================================================
# This script orchestrates security scanning using OWASP ZAP
#
# Usage:
#   ./security/run-security-audit.sh [baseline|full|api|all|ui]
#
# Options:
#   baseline  - Quick passive scan (~5-10 minutes)
#   full      - Comprehensive active scan (~30-60 minutes)
#   api       - API-focused security scan (~15-30 minutes)
#   all       - Run all scans sequentially
#   ui        - Start ZAP web interface for manual testing
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# Functions
print_header() {
    echo -e "${BLUE}"
    echo "=============================================="
    echo "  OWASP Security Audit - Museo MARCO"
    echo "=============================================="
    echo -e "${NC}"
}

print_section() {
    echo -e "${YELLOW}>>> $1${NC}"
}

print_success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}"
}

print_error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed or not in PATH"
        exit 1
    fi

    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running"
        exit 1
    fi
}

start_services() {
    print_section "Starting application services..."
    docker compose up -d postgres backend frontend

    echo "Waiting for services to be healthy..."
    sleep 10

    # Wait for frontend
    until curl -s -o /dev/null -w "%{http_code}" http://localhost:80 | grep -q "200\|301\|302" 2>/dev/null; do
        echo "  Waiting for frontend..."
        sleep 5
    done
    print_success "Services are ready!"
}

run_baseline_scan() {
    print_section "Running OWASP ZAP Baseline Scan..."
    echo "This scan performs passive security analysis (~5-10 minutes)"
    echo ""

    docker compose -f docker-compose.yml -f docker-compose.security.yml run --rm owasp-zap-baseline

    print_success "Baseline scan completed! Check reports in security/owasp-zap/reports/"
}

run_full_scan() {
    print_section "Running OWASP ZAP Full Active Scan..."
    echo "This scan performs comprehensive security testing (~30-60 minutes)"
    echo -e "${RED}WARNING: This scan actively probes for vulnerabilities${NC}"
    echo ""

    docker compose -f docker-compose.yml -f docker-compose.security.yml run --rm owasp-zap-full

    print_success "Full scan completed! Check reports in security/owasp-zap/reports/"
}

run_api_scan() {
    print_section "Running OWASP ZAP API Scan..."
    echo "This scan tests the backend API for vulnerabilities (~15-30 minutes)"
    echo ""

    docker compose -f docker-compose.yml -f docker-compose.security.yml run --rm owasp-zap-api

    print_success "API scan completed! Check reports in security/owasp-zap/reports/"
}

start_ui() {
    print_section "Starting OWASP ZAP Web UI..."
    echo "ZAP interface will be available at: http://localhost:8080/zap/"
    echo "Press Ctrl+C to stop"
    echo ""

    docker compose -f docker-compose.yml -f docker-compose.security.yml up owasp-zap-ui
}

show_usage() {
    echo "Usage: $0 [baseline|full|api|all|ui]"
    echo ""
    echo "Options:"
    echo "  baseline  - Quick passive scan (~5-10 minutes)"
    echo "  full      - Comprehensive active scan (~30-60 minutes)"
    echo "  api       - API-focused security scan (~15-30 minutes)"
    echo "  all       - Run all scans sequentially"
    echo "  ui        - Start ZAP web interface for manual testing"
    echo ""
    echo "Examples:"
    echo "  $0 baseline    # Run quick baseline scan"
    echo "  $0 all         # Run all security scans"
    echo "  $0 ui          # Start interactive ZAP UI"
}

generate_summary() {
    print_section "Generating scan summary..."

    REPORT_DIR="$PROJECT_ROOT/security/owasp-zap/reports"
    SUMMARY_FILE="$REPORT_DIR/SCAN_SUMMARY_$(date +%Y%m%d_%H%M%S).txt"

    {
        echo "=============================================="
        echo "OWASP ZAP Security Scan Summary"
        echo "Date: $(date)"
        echo "=============================================="
        echo ""
        echo "Reports generated:"
        ls -la "$REPORT_DIR"/*.html 2>/dev/null || echo "No HTML reports found"
        echo ""
        echo "JSON reports:"
        ls -la "$REPORT_DIR"/*.json 2>/dev/null || echo "No JSON reports found"
        echo ""
        echo "=============================================="
        echo "OWASP Top 10 Reference Categories:"
        echo "=============================================="
        echo "A01:2021 - Broken Access Control"
        echo "A02:2021 - Cryptographic Failures"
        echo "A03:2021 - Injection"
        echo "A04:2021 - Insecure Design"
        echo "A05:2021 - Security Misconfiguration"
        echo "A06:2021 - Vulnerable and Outdated Components"
        echo "A07:2021 - Identification and Authentication Failures"
        echo "A08:2021 - Software and Data Integrity Failures"
        echo "A09:2021 - Security Logging and Monitoring Failures"
        echo "A10:2021 - Server-Side Request Forgery (SSRF)"
        echo ""
    } > "$SUMMARY_FILE"

    print_success "Summary saved to: $SUMMARY_FILE"
}

# Main execution
print_header
check_docker

case "${1:-help}" in
    baseline)
        start_services
        run_baseline_scan
        generate_summary
        ;;
    full)
        start_services
        run_full_scan
        generate_summary
        ;;
    api)
        start_services
        run_api_scan
        generate_summary
        ;;
    all)
        start_services
        run_baseline_scan
        run_full_scan
        run_api_scan
        generate_summary
        ;;
    ui)
        start_services
        start_ui
        ;;
    help|--help|-h|*)
        show_usage
        exit 0
        ;;
esac

echo ""
print_success "Security audit completed!"
echo "Reports are available in: $PROJECT_ROOT/security/owasp-zap/reports/"
