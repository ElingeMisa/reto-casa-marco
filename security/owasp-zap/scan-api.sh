#!/bin/bash
# OWASP ZAP API Scan Script
# Performs security scanning on the backend API

set -e

API_URL="${API_URL:-http://backend:5001/api/v1}"
REPORT_DIR="/zap/reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "=============================================="
echo "OWASP ZAP API Scan"
echo "Target: ${API_URL}"
echo "Timestamp: ${TIMESTAMP}"
echo "=============================================="

# Wait for API to be available
echo "Waiting for API..."
until curl -s -o /dev/null -w "%{http_code}" "${API_URL}/health" | grep -q "200"; do
    echo "Waiting for ${API_URL}..."
    sleep 5
done
echo "API is available!"

# Run API scan
echo "Starting API scan..."
zap-api-scan.py \
    -t "${API_URL}" \
    -f openapi \
    -r "${REPORT_DIR}/api_report_${TIMESTAMP}.html" \
    -J "${REPORT_DIR}/api_report_${TIMESTAMP}.json" \
    -w "${REPORT_DIR}/api_report_${TIMESTAMP}.md" \
    -d || true

echo "=============================================="
echo "API scan completed!"
echo "Reports saved to: ${REPORT_DIR}"
echo "=============================================="

# List generated reports
ls -la "${REPORT_DIR}/"
