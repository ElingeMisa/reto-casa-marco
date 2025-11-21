#!/bin/bash
# OWASP ZAP Full Scan Script
# Performs an active security scan with spider and active scanning

set -e

TARGET_URL="${TARGET_URL:-http://frontend:80}"
REPORT_DIR="/zap/reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "=============================================="
echo "OWASP ZAP Full Active Scan"
echo "Target: ${TARGET_URL}"
echo "Timestamp: ${TIMESTAMP}"
echo "WARNING: This scan may take 30-60 minutes"
echo "=============================================="

# Wait for target to be available
echo "Waiting for target application..."
until curl -s -o /dev/null -w "%{http_code}" "${TARGET_URL}" | grep -q "200\|301\|302"; do
    echo "Waiting for ${TARGET_URL}..."
    sleep 5
done
echo "Target is available!"

# Run full scan
echo "Starting full active scan..."
zap-full-scan.py \
    -t "${TARGET_URL}" \
    -g gen.conf \
    -r "${REPORT_DIR}/full_report_${TIMESTAMP}.html" \
    -J "${REPORT_DIR}/full_report_${TIMESTAMP}.json" \
    -w "${REPORT_DIR}/full_report_${TIMESTAMP}.md" \
    -m 60 \
    -d

echo "=============================================="
echo "Full scan completed!"
echo "Reports saved to: ${REPORT_DIR}"
echo "=============================================="

# List generated reports
ls -la "${REPORT_DIR}/"
