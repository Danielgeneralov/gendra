# Gendra API Synthetic Tests

This folder contains a synthetic testing script that verifies the health and correctness of Gendra's key API endpoints.

## Installation

```bash
cd scripts
npm install
```

## Usage

### Run tests against local development server:

```bash
npm run test
```

### Run tests against production:

```bash
npm run test:prod
```

### Run tests with custom parameters:

```bash
npx tsx syntheticTest.ts --base=https://staging.gendra.app --verbose --timeout=15000
```

## Available Options

- `--base, -b`: Base URL for API endpoints (default: "http://localhost:3000")
- `--verbose, -v`: Show detailed log output
- `--timeout, -t`: Request timeout in milliseconds (default: 10000)

## Tests Performed

1. **RFQ Parsing**: Tests the ability to extract structured data from text
2. **Input Validation**: Tests validation of invalid inputs
3. **Quote Calculation**: Tests the quote calculation endpoint
4. **Quote Submission**: Tests the end-to-end quote submission flow
5. **Industry Config**: Tests the industry configuration retrieval

## Output

The script will display test results with pass/fail status, duration, and error details if any tests fail. It will exit with a non-zero code if any test fails, making it suitable for CI/CD pipelines.

## Example Output

```
🚀 Starting Gendra API Synthetic Tests
Base URL: http://localhost:3000
Timeout: 10000ms

🔍 [TEST] RFQ Parsing...
✔️  [PASS] RFQ Parsing (200) - 450ms
🔍 [TEST] Invalid RFQ Input...
✔️  [PASS] Invalid RFQ Input (400) - 123ms
🔍 [TEST] Quote Calculation...
✔️  [PASS] Quote Calculation (200) - 378ms
🔍 [TEST] Quote Submission...
❌ [FAIL] Quote Submission (503) - 2034ms
       Error: Database connection failed

--- Synthetic Test Summary ---
5 tests run | 4 passed | 1 failed

❌ Some tests failed 