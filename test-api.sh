#!/bin/bash

# API Integration Test Script
# Tests critical API endpoints and functionality

API_URL="${API_URL:-http://localhost:3000}"
BOT_URL="${BOT_URL:-http://localhost:3001}"

echo "========================================="
echo "Stars Grabber API Integration Tests"
echo "========================================="
echo ""
echo "API URL: $API_URL"
echo "Bot URL: $BOT_URL"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local expected_status=$4
    local data=$5
    local headers=$6

    echo -n "Testing: $name... "

    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -X GET "$API_URL$endpoint" $headers)
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            $headers \
            -d "$data")
    fi

    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (Status: $status_code)"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (Expected: $expected_status, Got: $status_code)"
        echo "Response: $body"
        ((TESTS_FAILED++))
        return 1
    fi
}

echo "========================================="
echo "1. Health Check Tests"
echo "========================================="
echo ""

test_endpoint "API Health Check" "GET" "/health" "200"
test_endpoint "Bot Health Check" "GET" "/health" "200" "" "" "$BOT_URL"

echo ""
echo "========================================="
echo "2. Authentication Tests"
echo "========================================="
echo ""

# Test invalid initData
test_endpoint "Login with invalid initData" "POST" "/api/auth/login" "401" \
    '{"initData":"invalid_data"}'

# Test missing initData
test_endpoint "Login with missing initData" "POST" "/api/auth/login" "400" \
    '{}'

echo ""
echo "========================================="
echo "3. Authorization Tests"
echo "========================================="
echo ""

# Test unauthorized access
test_endpoint "Access tasks without token" "GET" "/api/tasks" "401"

# Test admin access without token
test_endpoint "Access admin without token" "GET" "/api/admin/stats" "401"

echo ""
echo "========================================="
echo "4. Input Validation Tests"
echo "========================================="
echo ""

# Test invalid task ID
test_endpoint "Verify task with invalid ID" "POST" "/api/tasks/abc/verify" "400" \
    '{}' '-H "Authorization: Bearer fake_token"'

# Test invalid withdrawal amount
test_endpoint "Withdrawal with negative amount" "POST" "/api/withdrawals" "400" \
    '{"amount":-100}' '-H "Authorization: Bearer fake_token"'

# Test withdrawal below minimum
test_endpoint "Withdrawal below minimum" "POST" "/api/withdrawals" "400" \
    '{"amount":50}' '-H "Authorization: Bearer fake_token"'

echo ""
echo "========================================="
echo "5. Rate Limiting Tests"
echo "========================================="
echo ""

echo "Testing rate limiting (this may take a moment)..."

# Test auth rate limiting (should fail after 5 attempts)
for i in {1..6}; do
    if [ $i -le 5 ]; then
        test_endpoint "Auth attempt $i/5" "POST" "/api/auth/login" "401" \
            '{"initData":"test"}' > /dev/null 2>&1
    else
        test_endpoint "Auth attempt $i (should be rate limited)" "POST" "/api/auth/login" "429" \
            '{"initData":"test"}'
    fi
done

echo ""
echo "========================================="
echo "6. CORS Tests"
echo "========================================="
echo ""

# Test CORS headers
echo -n "Testing CORS configuration... "
cors_response=$(curl -s -I -X OPTIONS "$API_URL/api/tasks" \
    -H "Origin: http://localhost:5173" \
    -H "Access-Control-Request-Method: GET")

if echo "$cors_response" | grep -q "Access-Control-Allow-Origin"; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo "========================================="
echo "7. Error Handling Tests"
echo "========================================="
echo ""

# Test 404 handling
test_endpoint "Non-existent endpoint" "GET" "/api/nonexistent" "404"

# Test malformed JSON
echo -n "Testing malformed JSON handling... "
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{invalid json}")
status_code=$(echo "$response" | tail -n1)

if [ "$status_code" = "400" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (Expected: 400, Got: $status_code)"
    ((TESTS_FAILED++))
fi

echo ""
echo "========================================="
echo "Test Summary"
echo "========================================="
echo ""
echo "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed. Please review the output above.${NC}"
    exit 1
fi
