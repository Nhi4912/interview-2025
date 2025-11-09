# Development Tools - Practical Applications / Ứng Dụng Thực Tế

## Table of Contents / Mục Lục

1. [Real-World Scenarios](#real-world-scenarios)
2. [Tool Integration Patterns](#tool-integration-patterns)
3. [Workflow Automation](#workflow-automation)
4. [Performance Optimization](#performance-optimization)
5. [Team Collaboration](#team-collaboration)
6. [Best Practices](#best-practices)
7. [Case Studies](#case-studies)

---

## Real-World Scenarios / Tình Huống Thực Tế

### Scenario 1: Building a Data Processing Pipeline

**Problem:** Need to process user data from multiple sources, transform it, and store in database.

**Solution using Visual Programming (Rivet):**

```typescript
// Visual workflow definition
// Định nghĩa workflow trực quan

interface DataPipelineWorkflow {
  nodes: [
    {
      id: 'fetch-users',
      type: 'api-call',
      config: {
        url: '/api/users',
        method: 'GET'
      }
    },
    {
      id: 'fetch-orders',
      type: 'api-call',
      config: {
        url: '/api/orders',
        method: 'GET'
      }
    },
    {
      id: 'merge-data',
      type: 'transform',
      config: {
        operation: 'merge',
        keys: ['userId']
      }
    },
    {
      id: 'enrich-data',
      type: 'custom-function',
      config: {
        function: 'enrichUserData'
      }
    },
    {
      id: 'validate',
      type: 'validation',
      config: {
        schema: 'UserDataSchema'
      }
    },
    {
      id: 'save-to-db',
      type: 'database',
      config: {
        operation: 'bulkInsert',
        table: 'enriched_users'
      }
    }
  ];
  
  connections: [
    { from: 'fetch-users', to: 'merge-data', port: 'users' },
    { from: 'fetch-orders', to: 'merge-data', port: 'orders' },
    { from: 'merge-data', to: 'enrich-data' },
    { from: 'enrich-data', to: 'validate' },
    { from: 'validate', to: 'save-to-db' }
  ];
}

// Custom function implementation (code)
// Triển khai hàm tùy chỉnh (code)
async function enrichUserData(mergedData: MergedUserData[]): Promise<EnrichedUser[]> {
  return mergedData.map(user => ({
    ...user,
    totalSpent: user.orders.reduce((sum, order) => sum + order.amount, 0),
    orderCount: user.orders.length,
    averageOrderValue: user.orders.length > 0
      ? user.orders.reduce((sum, order) => sum + order.amount, 0) / user.orders.length
      : 0,
    lastOrderDate: user.orders.length > 0
      ? Math.max(...user.orders.map(o => new Date(o.date).getTime()))
      : null,
    customerSegment: calculateSegment(user)
  }));
}

function calculateSegment(user: MergedUserData): string {
  const totalSpent = user.orders.reduce((sum, order) => sum + order.amount, 0);
  
  if (totalSpent > 10000) return 'VIP';
  if (totalSpent > 5000) return 'Premium';
  if (totalSpent > 1000) return 'Regular';
  return 'New';
}

interface MergedUserData {
  userId: string;
  name: string;
  email: string;
  orders: Order[];
}

interface Order {
  id: string;
  amount: number;
  date: string;
}

interface EnrichedUser extends MergedUserData {
  totalSpent: number;
  orderCount: number;
  averageOrderValue: number;
  lastOrderDate: number | null;
  customerSegment: string;
}
```

**Benefits:**
- Visual workflow easy to understand and modify
- Parallel execution of independent API calls
- Clear data flow
- Easy to add new transformation steps
- Non-technical stakeholders can understand the process

---

### Scenario 2: AI-Assisted Code Refactoring

**Problem:** Legacy codebase with poor structure needs refactoring.

**Solution using AI Tools:**

```typescript
// Original code (poor quality)
// Code gốc (chất lượng kém)

function processUserData(data) {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].active) {
      if (data[i].age > 18) {
        if (data[i].country === 'US') {
          let user = {
            id: data[i].id,
            name: data[i].firstName + ' ' + data[i].lastName,
            email: data[i].email,
            age: data[i].age
          };
          result.push(user);
        }
      }
    }
  }
  return result;
}

// AI-suggested refactoring
// Refactoring đề xuất bởi AI

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  active: boolean;
  country: string;
}

interface ProcessedUser {
  id: string;
  name: string;
  email: string;
  age: number;
}

// Step 1: Extract validation logic
function isEligibleUser(user: User): boolean {
  return user.active && user.age > 18 && user.country === 'US';
}

// Step 2: Extract transformation logic
function transformUser(user: User): ProcessedUser {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    age: user.age
  };
}

// Step 3: Use functional approach
function processUserData(users: User[]): ProcessedUser[] {
  return users
    .filter(isEligibleUser)
    .map(transformUser);
}

// AI Reasoning:
// 1. Added TypeScript types for type safety
// 2. Extracted validation logic to separate function (Single Responsibility)
// 3. Extracted transformation logic to separate function
// 4. Replaced imperative loop with functional approach
// 5. Reduced nesting from 4 levels to 0
// 6. Improved readability and testability
```

**AI Analysis Report:**

```typescript
interface RefactoringReport {
  improvements: {
    complexity: {
      before: { cyclomatic: 5, cognitive: 8, nesting: 4 },
      after: { cyclomatic: 2, cognitive: 2, nesting: 0 },
      improvement: '75% reduction in complexity'
    },
    maintainability: {
      before: 45,
      after: 85,
      improvement: '89% increase'
    },
    testability: {
      before: 30,
      after: 95,
      improvement: '217% increase'
    },
    readability: {
      before: 40,
      after: 90,
      improvement: '125% increase'
    }
  },
  
  changes: [
    'Added TypeScript type definitions',
    'Extracted isEligibleUser function',
    'Extracted transformUser function',
    'Replaced for loop with filter/map',
    'Reduced nesting depth',
    'Improved naming conventions'
  ],
  
  testSuggestions: [
    'Test isEligibleUser with various user states',
    'Test transformUser with different name formats',
    'Test processUserData with empty array',
    'Test processUserData with mixed eligible/ineligible users'
  ]
}
```

---

### Scenario 3: Automated Code Review

**Problem:** Need to maintain code quality across large team.

**Solution using AI Code Analysis:**

```typescript
// Automated code review system
// Hệ thống review code tự động

class AutomatedCodeReviewer {
  private analyzer: CodeQualityAnalyzer;
  private aiModel: NeuralCodeAnalyzer;
  
  constructor() {
    this.analyzer = new CodeQualityAnalyzer();
    this.aiModel = new NeuralCodeAnalyzer();
  }
  
  async reviewPullRequest(pr: PullRequest): Promise<ReviewReport> {
    const changedFiles = await this.getChangedFiles(pr);
    const reviews: FileReview[] = [];
    
    for (const file of changedFiles) {
      const review = await this.reviewFile(file);
      reviews.push(review);
    }
    
    return this.generateReport(reviews, pr);
  }
  
  private async reviewFile(file: ChangedFile): Promise<FileReview> {
    const code = file.content;
    
    // 1. Static analysis
    const qualityReport = this.analyzer.analyze(code, {
      language: file.language,
      framework: file.framework,
      testFiles: []
    });
    
    // 2. AI prediction
    const aiPrediction = this.aiModel.predict(code);
    
    // 3. Detect patterns
    const patterns = this.detectPatterns(code);
    
    // 4. Security scan
    const securityIssues = this.scanSecurity(code);
    
    // 5. Performance analysis
    const performanceIssues = this.analyzePerformance(code);
    
    return {
      file: file.path,
      qualityScore: qualityReport.overall,
      aiQuality: aiPrediction.predicted,
      issues: [
        ...qualityReport.issues,
        ...securityIssues,
        ...performanceIssues
      ],
      patterns,
      recommendations: qualityReport.recommendations
    };
  }
  
  private detectPatterns(code: string): DetectedPattern[] {
    const patterns: DetectedPattern[] = [];
    
    // Detect anti-patterns
    if (this.hasGodClass(code)) {
      patterns.push({
        type: 'anti-pattern',
        name: 'God Class',
        severity: 'high',
        description: 'Class has too many responsibilities',
        suggestion: 'Split into smaller, focused classes'
      });
    }
    
    if (this.hasLongParameterList(code)) {
      patterns.push({
        type: 'anti-pattern',
        name: 'Long Parameter List',
        severity: 'medium',
        description: 'Function has too many parameters',
        suggestion: 'Use parameter object or builder pattern'
      });
    }
    
    // Detect good patterns
    if (this.usesFactoryPattern(code)) {
      patterns.push({
        type: 'good-pattern',
        name: 'Factory Pattern',
        severity: 'info',
        description: 'Proper use of factory pattern',
        suggestion: 'Good job!'
      });
    }
    
    return patterns;
  }
  
  private scanSecurity(code: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    
    // Check for common vulnerabilities
    if (code.includes('eval(')) {
      issues.push({
        type: 'security',
        severity: 'critical',
        message: 'Use of eval() is dangerous',
        location: this.findLocation(code, 'eval('),
        cwe: 'CWE-95',
        suggestion: 'Use safer alternatives like JSON.parse()'
      });
    }
    
    if (this.hasHardcodedSecrets(code)) {
      issues.push({
        type: 'security',
        severity: 'critical',
        message: 'Hardcoded secrets detected',
        location: this.findSecretLocation(code),
        cwe: 'CWE-798',
        suggestion: 'Use environment variables or secret management'
      });
    }
    
    if (this.hasSQLInjection(code)) {
      issues.push({
        type: 'security',
        severity: 'critical',
        message: 'Potential SQL injection vulnerability',
        location: this.findSQLLocation(code),
        cwe: 'CWE-89',
        suggestion: 'Use parameterized queries'
      });
    }
    
    return issues;
  }
  
  private analyzePerformance(code: string): PerformanceIssue[] {
    const issues: PerformanceIssue[] = [];
    
    // Detect inefficient patterns
    if (this.hasNestedLoops(code)) {
      issues.push({
        type: 'performance',
        severity: 'medium',
        message: 'Nested loops detected - O(n²) complexity',
        location: this.findNestedLoops(code),
        impact: 'High time complexity for large datasets',
        suggestion: 'Consider using hash map for O(n) solution'
      });
    }
    
    if (this.hasUnnecessaryReRenders(code)) {
      issues.push({
        type: 'performance',
        severity: 'medium',
        message: 'Component may re-render unnecessarily',
        location: this.findComponentLocation(code),
        impact: 'Poor React performance',
        suggestion: 'Use React.memo or useMemo'
      });
    }
    
    return issues;
  }
  
  private generateReport(reviews: FileReview[], pr: PullRequest): ReviewReport {
    const allIssues = reviews.flatMap(r => r.issues);
    const criticalIssues = allIssues.filter(i => i.severity === 'critical');
    const highIssues = allIssues.filter(i => i.severity === 'high');
    
    const approved = criticalIssues.length === 0 && highIssues.length <= 2;
    
    return {
      pullRequest: pr.id,
      approved,
      overallQuality: this.calculateOverallQuality(reviews),
      fileReviews: reviews,
      summary: {
        totalIssues: allIssues.length,
        critical: criticalIssues.length,
        high: highIssues.length,
        medium: allIssues.filter(i => i.severity === 'medium').length,
        low: allIssues.filter(i => i.severity === 'low').length
      },
      recommendations: this.generateRecommendations(reviews),
      estimatedReviewTime: this.estimateReviewTime(reviews)
    };
  }
  
  private calculateOverallQuality(reviews: FileReview[]): number {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.qualityScore, 0) / reviews.length;
  }
  
  private generateRecommendations(reviews: FileReview[]): string[] {
    const recommendations: string[] = [];
    
    const avgQuality = this.calculateOverallQuality(reviews);
    if (avgQuality < 60) {
      recommendations.push('Code quality is below acceptable threshold. Consider refactoring.');
    }
    
    const hasSecurityIssues = reviews.some(r =>
      r.issues.some(i => i.type === 'security')
    );
    if (hasSecurityIssues) {
      recommendations.push('Address all security issues before merging.');
    }
    
    return recommendations;
  }
  
  private estimateReviewTime(reviews: FileReview[]): number {
    // Estimate in minutes
    const baseTime = 5;
    const timePerIssue = 2;
    const totalIssues = reviews.reduce((sum, r) => sum + r.issues.length, 0);
    
    return baseTime + totalIssues * timePerIssue;
  }
  
  // Helper methods
  private async getChangedFiles(pr: PullRequest): Promise<ChangedFile[]> { return []; }
  private hasGodClass(code: string): boolean { return false; }
  private hasLongParameterList(code: string): boolean { return false; }
  private usesFactoryPattern(code: string): boolean { return false; }
  private findLocation(code: string, pattern: string): CodeLocation { return {} as CodeLocation; }
  private hasHardcodedSecrets(code: string): boolean { return false; }
  private findSecretLocation(code: string): CodeLocation { return {} as CodeLocation; }
  private hasSQLInjection(code: string): boolean { return false; }
  private findSQLLocation(code: string): CodeLocation { return {} as CodeLocation; }
  private hasNestedLoops(code: string): boolean { return false; }
  private findNestedLoops(code: string): CodeLocation { return {} as CodeLocation; }
  private hasUnnecessaryReRenders(code: string): boolean { return false; }
  private findComponentLocation(code: string): CodeLocation { return {} as CodeLocation; }
}

interface PullRequest {
  id: string;
  title: string;
  author: string;
  files: string[];
}

interface ChangedFile {
  path: string;
  content: string;
  language: string;
  framework: string;
}

interface FileReview {
  file: string;
  qualityScore: number;
  aiQuality: string;
  issues: QualityIssue[];
  patterns: DetectedPattern[];
  recommendations: string[];
}

interface DetectedPattern {
  type: 'anti-pattern' | 'good-pattern';
  name: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  description: string;
  suggestion: string;
}

interface SecurityIssue extends QualityIssue {
  cwe: string;
}

interface PerformanceIssue extends QualityIssue {
  impact: string;
}

interface ReviewReport {
  pullRequest: string;
  approved: boolean;
  overallQuality: number;
  fileReviews: FileReview[];
  summary: {
    totalIssues: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  recommendations: string[];
  estimatedReviewTime: number;
}
```

---

## Tool Integration Patterns / Patterns Tích Hợp Công Cụ

### Pattern 1: CI/CD Integration

```typescript
// Integrate AI tools into CI/CD pipeline
// Tích hợp công cụ AI vào pipeline CI/CD

class CICDIntegration {
  async runPipeline(commit: Commit): Promise<PipelineResult> {
    const stages: PipelineStage[] = [
      {
        name: 'Code Quality Check',
        run: () => this.checkCodeQuality(commit)
      },
      {
        name: 'Security Scan',
        run: () => this.scanSecurity(commit)
      },
      {
        name: 'AI Code Review',
        run: () => this.aiReview(commit)
      },
      {
        name: 'Performance Analysis',
        run: () => this.analyzePerformance(commit)
      },
      {
        name: 'Build',
        run: () => this.build(commit)
      },
      {
        name: 'Test',
        run: () => this.test(commit)
      },
      {
        name: 'Deploy',
        run: () => this.deploy(commit)
      }
    ];
    
    const results: StageResult[] = [];
    
    for (const stage of stages) {
      console.log(`Running stage: ${stage.name}`);
      const result = await stage.run();
      results.push(result);
      
      if (!result.passed) {
        console.log(`Stage ${stage.name} failed`);
        break;
      }
    }
    
    return {
      commit: commit.sha,
      passed: results.every(r => r.passed),
      stages: results
    };
  }
  
  private async checkCodeQuality(commit: Commit): Promise<StageResult> {
    const analyzer = new CodeQualityAnalyzer();
    const files = await this.getChangedFiles(commit);
    
    let passed = true;
    const issues: string[] = [];
    
    for (const file of files) {
      const report = analyzer.analyze(file.content, {
        language: file.language,
        framework: 'unknown',
        testFiles: []
      });
      
      if (report.overall < 70) {
        passed = false;
        issues.push(`${file.path}: Quality score ${report.overall} below threshold`);
      }
    }
    
    return { passed, issues };
  }
  
  private async scanSecurity(commit: Commit): Promise<StageResult> {
    // Security scanning logic
    return { passed: true, issues: [] };
  }
  
  private async aiReview(commit: Commit): Promise<StageResult> {
    // AI review logic
    return { passed: true, issues: [] };
  }
  
  private async analyzePerformance(commit: Commit): Promise<StageResult> {
    // Performance analysis logic
    return { passed: true, issues: [] };
  }
  
  private async build(commit: Commit): Promise<StageResult> {
    // Build logic
    return { passed: true, issues: [] };
  }
  
  private async test(commit: Commit): Promise<StageResult> {
    // Test logic
    return { passed: true, issues: [] };
  }
  
  private async deploy(commit: Commit): Promise<StageResult> {
    // Deploy logic
    return { passed: true, issues: [] };
  }
  
  private async getChangedFiles(commit: Commit): Promise<ChangedFile[]> {
    return [];
  }
}

interface Commit {
  sha: string;
  message: string;
  author: string;
}

interface PipelineStage {
  name: string;
  run: () => Promise<StageResult>;
}

interface StageResult {
  passed: boolean;
  issues: string[];
}

interface PipelineResult {
  commit: string;
  passed: boolean;
  stages: StageResult[];
}
```

---

## Summary / Tóm Tắt

This document demonstrates practical applications of modern development tools:

**Key Takeaways:**
1. Visual programming excels at workflow orchestration
2. AI tools significantly improve code quality
3. Automated code review saves time and maintains standards
4. Integration with CI/CD ensures quality gates
5. Hybrid approach (visual + code) provides best results

**Best Practices:**
- Use visual tools for high-level workflows
- Use AI for code quality and refactoring suggestions
- Always review AI-generated code
- Integrate tools into CI/CD pipeline
- Maintain balance between automation and human oversight

---

[← Back to Interview Questions](./07-tools-interview-questions.md) | [Back to Table of Contents](../00-table-of-contents.md)
