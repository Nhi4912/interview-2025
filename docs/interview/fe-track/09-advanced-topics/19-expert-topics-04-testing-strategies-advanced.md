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

##
 Visual Regression Testing

### Screenshot Comparison

```javascript
class VisualRegressionTester {
  constructor(options = {}) {
    this.threshold = options.threshold || 0.1; // 10% difference threshold
    this.baselineDir = options.baselineDir || './baselines';
    this.snapshotDir = options.snapshotDir || './snapshots';
    this.diffDir = options.diffDir || './diffs';
  }

  async captureScreenshot(element, name) {
    // Use html2canvas or similar library
    const canvas = await html2canvas(element);
    const imageData = canvas.toDataURL('image/png');
    
    return {
      name,
      data: imageData,
      width: canvas.width,
      height: canvas.height
    };
  }

  async compareImages(baseline, snapshot) {
    const baselineImg = await this.loadImage(baseline);
    const snapshotImg = await this.loadImage(snapshot);

    if (baselineImg.width !== snapshotImg.width || 
        baselineImg.height !== snapshotImg.height) {
      return {
        match: false,
        reason: 'Dimensions mismatch',
        difference: 100
      };
    }

    const diff = this.calculateDifference(baselineImg, snapshotImg);
    
    return {
      match: diff.percentage < this.threshold,
      difference: diff.percentage,
      diffImage: diff.image
    };
  }

  calculateDifference(img1, img2) {
    const canvas1 = this.imageToCanvas(img1);
    const canvas2 = this.imageToCanvas(img2);
    
    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');
    
    const data1 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);
    const data2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
    
    const diffCanvas = document.createElement('canvas');
    diffCanvas.width = canvas1.width;
    diffCanvas.height = canvas1.height;
    const diffCtx = diffCanvas.getContext('2d');
    const diffData = diffCtx.createImageData(canvas1.width, canvas1.height);
    
    let differentPixels = 0;
    const totalPixels = data1.data.length / 4;
    
    for (let i = 0; i < data1.data.length; i += 4) {
      const r1 = data1.data[i];
      const g1 = data1.data[i + 1];
      const b1 = data1.data[i + 2];
      
      const r2 = data2.data[i];
      const g2 = data2.data[i + 1];
      const b2 = data2.data[i + 2];
      
      const diff = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
      
      if (diff > 30) { // Threshold for pixel difference
        differentPixels++;
        diffData.data[i] = 255;     // Red
        diffData.data[i + 1] = 0;
        diffData.data[i + 2] = 0;
        diffData.data[i + 3] = 255;
      } else {
        diffData.data[i] = r1;
        diffData.data[i + 1] = g1;
        diffData.data[i + 2] = b1;
        diffData.data[i + 3] = 100; // Semi-transparent
      }
    }
    
    diffCtx.putImageData(diffData, 0, 0);
    
    return {
      percentage: (differentPixels / totalPixels) * 100,
      image: diffCanvas.toDataURL('image/png')
    };
  }

  imageToCanvas(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return canvas;
  }

  async loadImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = dataUrl;
    });
  }

  async test(component, name) {
    const snapshot = await this.captureScreenshot(component, name);
    const baselinePath = `${this.baselineDir}/${name}.png`;
    
    // Check if baseline exists
    const baseline = await this.loadBaseline(baselinePath);
    
    if (!baseline) {
      // Create new baseline
      await this.saveBaseline(baselinePath, snapshot.data);
      return { status: 'baseline-created' };
    }
    
    // Compare with baseline
    const result = await this.compareImages(baseline, snapshot.data);
    
    if (!result.match) {
      // Save diff
      await this.saveDiff(`${this.diffDir}/${name}.png`, result.diffImage);
      await this.saveSnapshot(`${this.snapshotDir}/${name}.png`, snapshot.data);
    }
    
    return result;
  }

  async loadBaseline(path) {
    try {
      const response = await fetch(path);
      return response.ok ? await response.text() : null;
    } catch {
      return null;
    }
  }

  async saveBaseline(path, data) {
    // Save to filesystem or storage
    console.log('Saving baseline:', path);
  }

  async saveSnapshot(path, data) {
    console.log('Saving snapshot:', path);
  }

  async saveDiff(path, data) {
    console.log('Saving diff:', path);
  }
}

// Usage
const visualTester = new VisualRegressionTester({
  threshold: 0.1
});

const component = document.getElementById('my-component');
const result = await visualTester.test(component, 'my-component');

if (!result.match) {
  console.error('Visual regression detected!');
  console.error('Difference:', result.difference + '%');
}
```

## Performance Testing

### Load Testing

```javascript
class LoadTester {
  constructor(options = {}) {
    this.concurrency = options.concurrency || 10;
    this.duration = options.duration || 60000; // 1 minute
    this.rampUp = options.rampUp || 10000; // 10 seconds
    this.metrics = {
      requests: 0,
      successes: 0,
      failures: 0,
      responseTimes: [],
      errors: []
    };
  }

  async run(testFn) {
    const startTime = Date.now();
    const workers = [];
    
    // Ramp up workers
    for (let i = 0; i < this.concurrency; i++) {
      await this.delay(this.rampUp / this.concurrency);
      workers.push(this.worker(testFn, startTime));
    }
    
    // Wait for duration
    await this.delay(this.duration);
    
    // Stop all workers
    this.stopped = true;
    await Promise.all(workers);
    
    return this.getResults();
  }

  async worker(testFn, startTime) {
    while (!this.stopped && Date.now() - startTime < this.duration) {
      const requestStart = Date.now();
      
      try {
        await testFn();
        const responseTime = Date.now() - requestStart;
        
        this.metrics.requests++;
        this.metrics.successes++;
        this.metrics.responseTimes.push(responseTime);
      } catch (error) {
        this.metrics.requests++;
        this.metrics.failures++;
        this.metrics.errors.push(error.message);
      }
    }
  }

  getResults() {
    const responseTimes = this.metrics.responseTimes.sort((a, b) => a - b);
    
    return {
      totalRequests: this.metrics.requests,
      successes: this.metrics.successes,
      failures: this.metrics.failures,
      successRate: (this.metrics.successes / this.metrics.requests) * 100,
      throughput: this.metrics.requests / (this.duration / 1000),
      responseTime: {
        min: Math.min(...responseTimes),
        max: Math.max(...responseTimes),
        mean: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
        median: responseTimes[Math.floor(responseTimes.length / 2)],
        p95: responseTimes[Math.floor(responseTimes.length * 0.95)],
        p99: responseTimes[Math.floor(responseTimes.length * 0.99)]
      },
      errors: this.metrics.errors
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage
const loadTester = new LoadTester({
  concurrency: 50,
  duration: 60000,
  rampUp: 10000
});

const results = await loadTester.run(async () => {
  const response = await fetch('/api/endpoint');
  if (!response.ok) throw new Error('Request failed');
  return response.json();
});

console.log('Load Test Results:');
console.log('Total Requests:', results.totalRequests);
console.log('Success Rate:', results.successRate.toFixed(2) + '%');
console.log('Throughput:', results.throughput.toFixed(2), 'req/s');
console.log('Response Time (p95):', results.responseTime.p95, 'ms');
```

### Stress Testing

```javascript
class StressTester {
  constructor(options = {}) {
    this.startConcurrency = options.startConcurrency || 1;
    this.maxConcurrency = options.maxConcurrency || 100;
    this.step = options.step || 10;
    this.stepDuration = options.stepDuration || 30000;
    this.breakingPoint = null;
  }

  async run(testFn) {
    const results = [];
    
    for (let concurrency = this.startConcurrency; 
         concurrency <= this.maxConcurrency; 
         concurrency += this.step) {
      
      console.log(`Testing with ${concurrency} concurrent users...`);
      
      const loadTester = new LoadTester({
        concurrency,
        duration: this.stepDuration,
        rampUp: 5000
      });
      
      const result = await loadTester.run(testFn);
      results.push({
        concurrency,
        ...result
      });
      
      // Check if system is breaking
      if (result.successRate < 95 || result.responseTime.p95 > 5000) {
        this.breakingPoint = concurrency;
        console.log('Breaking point found at', concurrency, 'concurrent users');
        break;
      }
    }
    
    return {
      results,
      breakingPoint: this.breakingPoint,
      maxStableConcurrency: this.breakingPoint ? this.breakingPoint - this.step : this.maxConcurrency
    };
  }

  generateReport(results) {
    return {
      summary: {
        breakingPoint: results.breakingPoint,
        maxStableConcurrency: results.maxStableConcurrency
      },
      details: results.results.map(r => ({
        concurrency: r.concurrency,
        successRate: r.successRate.toFixed(2) + '%',
        throughput: r.throughput.toFixed(2),
        p95ResponseTime: r.responseTime.p95
      }))
    };
  }
}

// Usage
const stressTester = new StressTester({
  startConcurrency: 10,
  maxConcurrency: 200,
  step: 20,
  stepDuration: 30000
});

const results = await stressTester.run(async () => {
  const response = await fetch('/api/endpoint');
  if (!response.ok) throw new Error('Request failed');
  return response.json();
});

const report = stressTester.generateReport(results);
console.log('Stress Test Report:', report);
```

## Contract Testing

### Consumer-Driven Contracts

```javascript
class ContractTester {
  constructor() {
    this.contracts = new Map();
    this.violations = [];
  }

  defineContract(name, contract) {
    this.contracts.set(name, contract);
  }

  async verifyProvider(name, provider) {
    const contract = this.contracts.get(name);
    if (!contract) {
      throw new Error(`Contract ${name} not found`);
    }

    const violations = [];

    for (const interaction of contract.interactions) {
      try {
        const response = await provider(interaction.request);
        
        // Verify response matches contract
        const valid = this.verifyResponse(response, interaction.response);
        
        if (!valid.match) {
          violations.push({
            interaction: interaction.description,
            violations: valid.violations
          });
        }
      } catch (error) {
        violations.push({
          interaction: interaction.description,
          error: error.message
        });
      }
    }

    return {
      contract: name,
      valid: violations.length === 0,
      violations
    };
  }

  verifyResponse(actual, expected) {
    const violations = [];

    // Check status
    if (actual.status !== expected.status) {
      violations.push({
        field: 'status',
        expected: expected.status,
        actual: actual.status
      });
    }

    // Check headers
    if (expected.headers) {
      for (const [key, value] of Object.entries(expected.headers)) {
        if (actual.headers[key] !== value) {
          violations.push({
            field: `headers.${key}`,
            expected: value,
            actual: actual.headers[key]
          });
        }
      }
    }

    // Check body
    if (expected.body) {
      const bodyViolations = this.verifyObject(actual.body, expected.body);
      violations.push(...bodyViolations);
    }

    return {
      match: violations.length === 0,
      violations
    };
  }

  verifyObject(actual, expected, path = 'body') {
    const violations = [];

    for (const [key, value] of Object.entries(expected)) {
      const actualValue = actual[key];
      const fieldPath = `${path}.${key}`;

      if (typeof value === 'object' && value !== null) {
        if (value.type) {
          // Type matcher
          if (!this.matchType(actualValue, value.type)) {
            violations.push({
              field: fieldPath,
              expected: `type: ${value.type}`,
              actual: `type: ${typeof actualValue}`
            });
          }
        } else {
          // Nested object
          violations.push(...this.verifyObject(actualValue, value, fieldPath));
        }
      } else {
        // Exact match
        if (actualValue !== value) {
          violations.push({
            field: fieldPath,
            expected: value,
            actual: actualValue
          });
        }
      }
    }

    return violations;
  }

  matchType(value, type) {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number';
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && value !== null;
      default:
        return false;
    }
  }

  async verifyConsumer(name, consumer, mockProvider) {
    const contract = this.contracts.get(name);
    if (!contract) {
      throw new Error(`Contract ${name} not found`);
    }

    // Set up mock provider
    const mock = this.createMockProvider(contract);
    
    try {
      // Run consumer with mock
      await consumer(mock);
      
      // Verify all interactions were called
      const uncalledInteractions = contract.interactions.filter(
        i => !mock.calledInteractions.has(i.description)
      );

      return {
        contract: name,
        valid: uncalledInteractions.length === 0,
        uncalledInteractions: uncalledInteractions.map(i => i.description)
      };
    } catch (error) {
      return {
        contract: name,
        valid: false,
        error: error.message
      };
    }
  }

  createMockProvider(contract) {
    const calledInteractions = new Set();

    return {
      calledInteractions,
      request: async (req) => {
        const interaction = contract.interactions.find(
          i => i.request.method === req.method && 
               i.request.path === req.path
        );

        if (!interaction) {
          throw new Error(`No interaction found for ${req.method} ${req.path}`);
        }

        calledInteractions.add(interaction.description);
        return interaction.response;
      }
    };
  }
}

// Usage
const contractTester = new ContractTester();

// Define contract
contractTester.defineContract('user-service', {
  consumer: 'web-app',
  provider: 'user-api',
  interactions: [
    {
      description: 'get user by id',
      request: {
        method: 'GET',
        path: '/users/123'
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          id: { type: 'number' },
          name: { type: 'string' },
          email: { type: 'string' }
        }
      }
    }
  ]
});

// Verify provider
const providerResult = await contractTester.verifyProvider(
  'user-service',
  async (request) => {
    const response = await fetch(`http://api.example.com${request.path}`);
    return {
      status: response.status,
      headers: Object.fromEntries(response.headers),
      body: await response.json()
    };
  }
);

console.log('Provider verification:', providerResult);

// Verify consumer
const consumerResult = await contractTester.verifyConsumer(
  'user-service',
  async (mock) => {
    const user = await mock.request({
      method: 'GET',
      path: '/users/123'
    });
    console.log('Got user:', user);
  }
);

console.log('Consumer verification:', consumerResult);
```

## Test Automation

### CI/CD Integration

```javascript
class TestRunner {
  constructor(options = {}) {
    this.parallel = options.parallel || false;
    this.bail = options.bail || false;
    this.timeout = options.timeout || 30000;
    this.retries = options.retries || 0;
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0
    };
  }

  async runSuite(suite) {
    const startTime = Date.now();
    
    if (this.parallel) {
      await this.runParallel(suite.tests);
    } else {
      await this.runSequential(suite.tests);
    }
    
    this.results.duration = Date.now() - startTime;
    return this.results;
  }

  async runSequential(tests) {
    for (const test of tests) {
      if (this.bail && this.results.failed > 0) {
        break;
      }
      
      await this.runTest(test);
    }
  }

  async runParallel(tests) {
    await Promise.all(
      tests.map(test => this.runTest(test))
    );
  }

  async runTest(test) {
    this.results.total++;
    
    if (test.skip) {
      this.results.skipped++;
      return;
    }

    let attempts = 0;
    let lastError;

    while (attempts <= this.retries) {
      try {
        await this.runWithTimeout(test.fn, this.timeout);
        this.results.passed++;
        return;
      } catch (error) {
        lastError = error;
        attempts++;
      }
    }

    this.results.failed++;
    console.error(`Test failed: ${test.description}`);
    console.error(lastError);
  }

  async runWithTimeout(fn, timeout) {
    return Promise.race([
      fn(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Test timeout')), timeout)
      )
    ]);
  }

  generateReport() {
    return {
      summary: {
        total: this.results.total,
        passed: this.results.passed,
        failed: this.results.failed,
        skipped: this.results.skipped,
        duration: this.results.duration,
        passRate: ((this.results.passed / this.results.total) * 100).toFixed(2) + '%'
      },
      exitCode: this.results.failed > 0 ? 1 : 0
    };
  }
}

// Usage in CI/CD
const runner = new TestRunner({
  parallel: true,
  bail: false,
  timeout: 30000,
  retries: 2
});

const suite = {
  tests: [
    { description: 'test 1', fn: async () => { /* test code */ } },
    { description: 'test 2', fn: async () => { /* test code */ } },
    { description: 'test 3', fn: async () => { /* test code */ }, skip: true }
  ]
};

const results = await runner.runSuite(suite);
const report = runner.generateReport();

console.log(JSON.stringify(report, null, 2));
process.exit(report.exitCode);
```

## Summary

Advanced testing strategies include:
- **Testing Pyramid**: Proper distribution of unit, integration, and E2E tests
- **TDD**: Red-Green-Refactor cycle for test-driven development
- **BDD**: Gherkin-style tests for behavior-driven development
- **Property-Based Testing**: Generative testing with automatic shrinking
- **Mutation Testing**: Verify test suite effectiveness
- **Visual Regression**: Screenshot comparison for UI consistency
- **Performance Testing**: Load and stress testing
- **Contract Testing**: Consumer-driven contracts for API testing

These strategies ensure comprehensive test coverage, high code quality, and confidence in deployments.
