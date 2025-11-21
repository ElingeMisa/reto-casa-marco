#!/bin/bash
# OWASP ZAP Baseline Scan Script
# Performs a quick passive scan of the target application

set -e

TARGET_URL="${TARGET_URL:-http://frontend:80}"
REPORT_DIR="/zap/reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "=============================================="
echo "OWASP ZAP Baseline Scan"
echo "Target: ${TARGET_URL}"
echo "Timestamp: ${TIMESTAMP}"
echo "=============================================="

# Wait for target to be available
echo "Waiting for target application..."
until curl -s -o /dev/null -w "%{http_code}" "${TARGET_URL}" | grep -q "200\|301\|302"; do
    echo "Waiting for ${TARGET_URL}..."
    sleep 5
done
echo "Target is available!"

# Run baseline scan
echo "Starting baseline scan..."
zap-baseline.py \
    -t "${TARGET_URL}" \
    -g gen.conf \
    -r "${REPORT_DIR}/baseline_report_${TIMESTAMP}.html" \
    -J "${REPORT_DIR}/baseline_report_${TIMESTAMP}.json" \
    -w "${REPORT_DIR}/baseline_report_${TIMESTAMP}.md" \
    -I \
    -d

echo "=============================================="
echo "Baseline scan completed!"
echo "Reports saved to: ${REPORT_DIR}"
echo "=============================================="

# List generated reports
ls -la "${REPORT_DIR}/"
