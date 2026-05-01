import { formatCurrency } from './utils';

/**
 * Manual Unit Tests
 * These functions can be integrated into a CI/CD pipeline or run locally.
 */
export function runTests() {
  console.group('SoloFinance Test Suite');
  
  testFormatCurrency();
  
  console.groupEnd();
}

function testFormatCurrency() {
  const cases = [
    { input: 0, expected: 'R$ 0,00' },
    { input: 1500.5, expected: 'R$ 1.500,50' },
    { input: -50, expected: '-R$ 50,00' }
  ];

  cases.forEach((c, i) => {
    const result = formatCurrency(c.input).replace(/\u00a0/g, ' '); // Normalize spaces for comparison
    const expected = c.expected;
    if (result === expected) {
      console.log(`✅ testFormatCurrency Case ${i+1} passed`);
    } else {
      console.error(`❌ testFormatCurrency Case ${i+1} failed. Expected ${expected}, got ${result}`);
    }
  });
}
