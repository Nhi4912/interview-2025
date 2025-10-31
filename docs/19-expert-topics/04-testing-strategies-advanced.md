# Advanced Testing Strategies

## Table of Contents
- [Testing Pyramid](#testing-pyramid)
- [Test-Driven Development](#test-driven-development)
- [Behavior-Driven Development](#behavior-driven-development)
- [Property-Based Testing](#property-based-testing)
- [Mutation Testing](#mutation-testing)
- [Visual Regression Testing](#visual-regression-testing)
- [Performance Testing](#performance-testing)
- [Contract Testing](#contract-testing)

## Testing Pyramid

### Test Strategy

**Pyramid Levels**:
```
        /\
       /E2E\      <- Few, slow, expensive
      /------\
     /Integration\ <- Some, moderate speed
    /------------\
   /  Unit Tests  \ <- Many, fast, cheap
  /----------------\
```

**Test Distribution**:
```javascript
class TestStrategy {
  constructor() {
    this.distribution = {
      unit: 0.70,        // 70% unit tests
      integration: 0.20, // 20% integration tests
      e2e: 0.10         // 10% end-to-end tests
    };
  }

  calculateTestCount(totalTests) {
    return {
      unit: Math.floor(totalTests * this.distribution.unit),
      integration: Math.floor(totalTests * this.distribution.integration),
      e2e: Math.floor(totalTests * this.distribution.e2e)
    };
  }

  validateCoverage(coverage) {
    const thresholds = {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80
    };

    const failures = [];

    for (const [metric, threshold] of Object.entries(thresholds)) {
      if (coverage[metric] < threshold) {
        failures.push({
          metric,
          actual: coverage[metric],
          expected: threshold
        });
      }
    }

    return {
      passed: failures.length === 0,
      failures
    };
  }
}
```

## Test-Driven Development

### TDD Cycle

**Red-Green-Refactor**:
```javascript
// 1. RED: Write failing test
describe('Calculator', () => {
  it('should add two numbers', () => {
    const calc = new Calculator();
    expect(calc.add(2, 3)).toBe(5);
  });
});

// 2. GREEN: Write minimal code to pass
class Calculator {
  add(a, b) {
    return a + b;
  }
}

// 3. REFACTOR: Improve code quality
class Calculator {
  add(...numbers) {
    return numbers.reduce((sum, num) => sum + num, 0);
  }
}
```

### TDD Framework

```javascript
class TDDFramework {
  constructor() {
    this.tests = [];
    this.beforeEachHooks = [];
    this.afterEachHooks = [];
    this.results = {
      passed: 0,
      failed: 0,
      skipped: 0
    };
  }

  describe(description, fn) {
    console.log(`\n${description}`);
    fn();
  }

  it(description, fn) {
    this.tests.push({ description, fn, skip: false });
  }

  xit(description, fn) {
    this.tests.push({ description, fn, skip: true });
  }

  beforeEach(fn) {
    this.beforeEachHooks.push(fn);
  }

  afterEach(fn) {
    this.afterEachHooks.push(fn);
  }

  async run() {
    for (const test of this.tests) {
      if (test.skip) {
        console.log(`  ⊘ ${test.description} (skipped)`);
        this.results.skipped++;
        continue;
      }

      try {
        // Run beforeEach hooks
        for (const hook of this.beforeEachHooks) {
          await hook();
        }

        // Run test
        await test.fn();

        // Run afterEach hooks
        for (const hook of this.afterEachHooks) {
          await hook();
        }

        console.log(`  ✓ ${test.description}`);
        this.results.passed++;
      } catch (error) {
        console.log(`  ✗ ${test.description}`);
        console.log(`    ${error.message}`);
        this.results.failed++;
      }
    }

    this.printSummary();
  }

  printSummary() {
    console.log('\nTest Summary:');
    console.log(`  Passed: ${this.results.passed}`);
    console.log(`  Failed: ${this.results.failed}`);
    console.log(`  Skipped: ${this.results.skipped}`);
    console.log(`  Total: ${this.tests.length}`);
  }

  expect(actual) {
    return {
      toBe(expected) {
        if (actual !== expected) {
          throw new Error(`Expected ${actual} to be ${expected}`);
        }
      },
      toEqual(expected) {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
        }
      },
      toBeTruthy() {
        if (!actual) {
          throw new Error(`Expected ${actual} to be truthy`);
        }
      },
      toBeFalsy() {
        if (actual) {
          throw new Error(`Expected ${actual} to be falsy`);
        }
      },
      toThrow() {
        try {
          actual();
          throw new Error('Expected function to throw');
        } catch (error) {
          // Expected
        }
      }
    };
  }
}

// Usage
const test = new TDDFramework();

test.describe('Calculator', () => {
  let calc;

  test.beforeEach(() => {
    calc = new Calculator();
  });

  test.it('should add numbers', () => {
    test.expect(calc.add(2, 3)).toBe(5);
  });

  test.it('should subtract numbers', () => {
    test.expect(calc.subtract(5, 3)).toBe(2);
  });

  test.xit('should multiply numbers', () => {
    test.expect(calc.multiply(2, 3)).toBe(6);
  });
});

test.run();
```

## Behavior-Driven Development

### Gherkin-Style Tests

```javascript
class BDDFramework {
  constructor() {
    this.features = [];
    this.steps = new Map();
  }

  feature(description, fn) {
    const feature = {
      description,
      scenarios: []
    };
    
    this.currentFeature = feature;
    fn();
    this.features.push(feature);
    this.currentFeature = null;
  }

  scenario(description, fn) {
    const scenario = {
      description,
      steps: []
    };
    
    this.currentScenario = scenario;
    fn();
    this.currentFeature.scenarios.push(scenario);
    this.currentScenario = null;
  }

  given(description, fn) {
    this.currentScenario.steps.push({
      type: 'given',
      description,
      fn
    });
  }

  when(description, fn) {
    this.currentScenario.steps.push({
      type: 'when',
      description,
      fn
    });
  }

  then(description, fn) {
    this.currentScenario.steps.push({
      type: 'then',
      description,
      fn
    });
  }

  and(description, fn) {
    this.currentScenario.steps.push({
      type: 'and',
      description,
      fn
    });
  }

  async run() {
    for (const feature of this.features) {
      console.log(`\nFeature: ${feature.description}`);
      
      for (const scenario of feature.scenarios) {
        console.log(`  Scenario: ${scenario.description}`);
        
        const context = {};
        
        try {
          for (const step of scenario.steps) {
            console.log(`    ${step.type.toUpperCase()}: ${step.description}`);
            await step.fn(context);
          }
          console.log('    ✓ Passed');
        } catch (error) {
          console.log(`    ✗ Failed: ${error.message}`);
        }
      }
    }
  }
}

// Usage
const bdd = new BDDFramework();

bdd.feature('User Authentication', () => {
  bdd.scenario('User logs in with valid credentials', () => {
    bdd.given('a user exists with email "user@example.com"', (context) => {
      context.user = { email: 'user@example.com', password: 'password123' };
    });

    bdd.when('the user submits login form', async (context) => {
      context.result = await login(context.user.email, context.user.password);
    });

    bdd.then('the user should be authenticated', (context) => {
      if (!context.result.authenticated) {
        throw new Error('User not authenticated');
      }
    });

    bdd.and('a session token should be created', (context) => {
      if (!context.result.token) {
        throw new Error('No session token');
      }
    });
  });

  bdd.scenario('User logs in with invalid credentials', () => {
    bdd.given('a user exists with email "user@example.com"', (context) => {
      context.user = { email: 'user@example.com', password: 'password123' };
    });

    bdd.when('the user submits login form with wrong password', async (context) => {
      context.result = await login(context.user.email, 'wrongpassword');
    });

    bdd.then('the user should not be authenticated', (context) => {
      if (context.result.authenticated) {
        throw new Error('User should not be authenticated');
      }
    });

    bdd.and('an error message should be shown', (context) => {
      if (!context.result.error) {
        throw new Error('No error message');
      }
    });
  });
});

bdd.run();
```

## Property-Based Testing

### Property Testing Framework

```javascript
class PropertyTester {
  constructor() {
    this.generators = new Map();
    this.shrinkStrategies = new Map();
  }

  // Generators
  integer(min = -1000, max = 1000) {
    return () => Math.floor(Math.random() * (max - min + 1)) + min;
  }

  string(minLength = 0, maxLength = 100) {
    return () => {
      const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
      return Array.from({ length }, () => 
        String.fromCharCode(97 + Math.floor(Math.random() * 26))
      ).join('');
    };
  }

  array(generator, minLength = 0, maxLength = 100) {
    return () => {
      const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
      return Array.from({ length }, () => generator());
    };
  }

  object(schema) {
    return () => {
      const obj = {};
      for (const [key, generator] of Object.entries(schema)) {
        obj[key] = generator();
      }
      return obj;
    };
  }

  oneOf(...generators) {
    return () => {
      const generator = generators[Math.floor(Math.random() * generators.length)];
      return generator();
    };
  }

  // Property testing
  async forAll(generators, property, options = {}) {
    const runs = options.runs || 100;
    const shrinkAttempts = options.shrinkAttempts || 100;

    for (let i = 0; i < runs; i++) {
      const inputs = generators.map(gen => gen());
      
      try {
        await property(...inputs);
      } catch (error) {
        // Try to shrink failing input
        const shrunk = await this.shrink(generators, inputs, property, shrinkAttempts);
        
        throw new Error(
          `Property failed after ${i + 1} tests\n` +
          `Failing input: ${JSON.stringify(shrunk)}\n` +
          `Error: ${error.message}`
        );
      }
    }

    return { passed: true, runs };
  }

  async shrink(generators, inputs, property, attempts) {
    let current = inputs;
    
    for (let i = 0; i < attempts; i++) {
      const shrunk = this.shrinkInputs(current);
      
      if (JSON.stringify(shrunk) === JSON.stringify(current)) {
        break; // Can't shrink further
      }
      
      try {
        await property(...shrunk);
        break; // Shrunk input passes, use previous
      } catch (error) {
        current = shrunk; // Shrunk input still fails, continue
      }
    }
    
    return current;
  }

  shrinkInputs(inputs) {
    return inputs.map(input => {
      if (typeof input === 'number') {
        return Math.floor(input / 2);
      }
      if (typeof input === 'string') {
        return input.slice(0, Math.floor(input.length / 2));
      }
      if (Array.isArray(input)) {
        return input.slice(0, Math.floor(input.length / 2));
      }
      return input;
    });
  }
}

// Usage
const tester = new PropertyTester();

// Test: Reversing an array twice returns original
await tester.forAll(
  [tester.array(tester.integer(), 0, 100)],
  (arr) => {
    const reversed = arr.slice().reverse().reverse();
    if (JSON.stringify(reversed) !== JSON.stringify(arr)) {
      throw new Error('Double reverse should return original');
    }
  },
  { runs: 1000 }
);

// Test: Adding then subtracting returns original
await tester.forAll(
  [tester.integer(), tester.integer()],
  (a, b) => {
    const result = (a + b) - b;
    if (result !== a) {
      throw new Error('(a + b) - b should equal a');
    }
  }
);

// Test: String concatenation is associative
await tester.forAll(
  [tester.string(), tester.string(), tester.string()],
  (a, b, c) => {
    const left = (a + b) + c;
    const right = a + (b + c);
    if (left !== right) {
      throw new Error('String concatenation should be associative');
    }
  }
);
```

## Mutation Testing

### Mutation Testing Framework

```javascript
class MutationTester {
  constructor() {
    this.mutators = [
      this.arithmeticMutator,
      this.comparisonMutator,
      this.logicalMutator,
      this.returnMutator
    ];
  }

  arithmeticMutator(code) {
    const mutations = [];
    const operators = {
      '+': ['-', '*', '/'],
      '-': ['+', '*', '/'],
      '*': ['+', '-', '/'],
      '/': ['+', '-', '*']
    };

    for (const [original, replacements] of Object.entries(operators)) {
      for (const replacement of replacements) {
        const mutated = code.replace(
          new RegExp(`\\${original}`, 'g'),
          replacement
        );
        if (mutated !== code) {
          mutations.push({
            type: 'arithmetic',
            original,
            replacement,
            code: mutated
          });
        }
      }
    }

    return mutations;
  }

  comparisonMutator(code) {
    const mutations = [];
    const operators = {
      '<': ['<=', '>', '>=', '==', '!='],
      '<=': ['<', '>', '>=', '==', '!='],
      '>': ['>=', '<', '<=', '==', '!='],
      '>=': ['>', '<', '<=', '==', '!='],
      '==': ['!=', '<', '<=', '>', '>='],
      '!=': ['==', '<', '<=', '>', '>=']
    };

    for (const [original, replacements] of Object.entries(operators)) {
      for (const replacement of replacements) {
        const mutated = code.replace(
          new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          replacement
        );
        if (mutated !== code) {
          mutations.push({
            type: 'comparison',
            original,
            replacement,
            code: mutated
          });
        }
      }
    }

    return mutations;
  }

  logicalMutator(code) {
    const mutations = [];
    const operators = {
      '&&': ['||'],
      '||': ['&&']
    };

    for (const [original, replacements] of Object.entries(operators)) {
      for (const replacement of replacements) {
        const mutated = code.replace(
          new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          replacement
        );
        if (mutated !== code) {
          mutations.push({
            type: 'logical',
            original,
            replacement,
            code: mutated
          });
        }
      }
    }

    return mutations;
  }

  returnMutator(code) {
    const mutations = [];
    
    // Mutate return values
    const returnPattern = /return\s+([^;]+);/g;
    let match;
    
    while ((match = returnPattern.exec(code)) !== null) {
      const original = match[1].trim();
      const replacements = this.getReturnReplacements(original);
      
      for (const replacement of replacements) {
        const mutated = code.replace(match[0], `return ${replacement};`);
        mutations.push({
          type: 'return',
          original,
          replacement,
          code: mutated
        });
      }
    }

    return mutations;
  }

  getReturnReplacements(value) {
    if (value === 'true') return ['false'];
    if (value === 'false') return ['true'];
    if (!isNaN(value)) return ['0', '1', '-1'];
    if (value.startsWith('"') || value.startsWith("'")) return ['""', "''"];
    return ['null', 'undefined'];
  }

  async test(code, testSuite) {
    const mutations = this.generateMutations(code);
    const results = {
      total: mutations.length,
      killed: 0,
      survived: 0,
      timeout: 0
    };

    for (const mutation of mutations) {
      try {
        const testResult = await this.runTests(mutation.code, testSuite);
        
        if (testResult.failed > 0) {
          results.killed++;
        } else {
          results.survived++;
          console.log('Mutation survived:', mutation);
        }
      } catch (error) {
        results.timeout++;
      }
    }

    results.score = (results.killed / results.total) * 100;
    return results;
  }

  generateMutations(code) {
    const mutations = [];
    
    for (const mutator of this.mutators) {
      mutations.push(...mutator.call(this, code));
    }
    
    return mutations;
  }

  async runTests(code, testSuite) {
    // Execute mutated code and run tests
    const fn = new Function('return ' + code)();
    return testSuite(fn);
  }
}

// Usage
const mutationTester = new MutationTester();

const code = `
function add(a, b) {
  return a + b;
}
`;

const testSuite = (fn) => {
  const tests = [
    () => fn(2, 3) === 5,
    () => fn(0, 0) === 0,
    () => fn(-1, 1) === 0
  ];
  
  let failed = 0;
  for (const test of tests) {
    if (!test()) failed++;
  }
  
  return { failed, total: tests.length };
};

const results = await mutationTester.test(code, testSuite);
console.log('Mutation Score:', results.score + '%');
console.log('Killed:', results.killed);
console.log('Survived:', results.survived);
```

I'll continue with more testing content:

<function_calls>
<invoke name="fsAppend">
<parameter name="path">docs/19-expert-topics/04-testing-strategies-advanced.md