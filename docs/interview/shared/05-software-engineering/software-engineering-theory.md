# Software Engineering Theory
## Principles, Methodologies, and Best Practices

**English:** Software engineering is the systematic application of engineering principles to software development, encompassing methodologies, processes, and practices for creating reliable, efficient, and maintainable software systems.

**Tiếng Việt:** Kỹ nghệ phần mềm là việc áp dụng có hệ thống các nguyên tắc kỹ thuật vào phát triển phần mềm, bao gồm các phương pháp, quy trình và thực hành để tạo ra các hệ thống phần mềm đáng tin cậy, hiệu quả và dễ bảo trì.

## Table of Contents
1. [Software Engineering Fundamentals](#software-engineering-fundamentals)
2. [Software Development Life Cycle](#software-development-life-cycle)
3. [Development Methodologies](#development-methodologies)
4. [Software Design Principles](#software-design-principles)
5. [Software Architecture](#software-architecture)
6. [Requirements Engineering](#requirements-engineering)
7. [Software Testing](#software-testing)
8. [Software Maintenance](#software-maintenance)
9. [Project Management](#project-management)
10. [Quality Assurance](#quality-assurance)

## Software Engineering Fundamentals

### Definition and Scope

**Software Engineering:**
- Systematic approach to software development
- Application of engineering principles
- Focus on quality, reliability, maintainability
- Encompasses entire software lifecycle

**Key Aspects:**
```
Technical:
- Programming and coding
- System design and architecture
- Testing and quality assurance
- Tools and technologies

Process:
- Requirements gathering
- Project planning
- Development methodologies
- Change management

Management:
- Team coordination
- Resource allocation
- Risk management
- Stakeholder communication
```

### Software Crisis

**Historical Context:**
```
1960s-1970s: Software Crisis
- Projects over budget
- Projects behind schedule
- Poor quality software
- Unmaintainable code
- User dissatisfaction

Causes:
- Increasing complexity
- Lack of methodology
- Poor project management
- Inadequate tools
- Insufficient training

Solution:
- Software engineering discipline
- Structured methodologies
- Better tools and practices
- Professional standards
```

### Software Characteristics

**Essential Characteristics:**
```
Functionality:
- Does what it's supposed to do
- Meets requirements
- Provides value

Reliability:
- Works consistently
- Handles errors gracefully
- Available when needed

Usability:
- Easy to learn
- Easy to use
- Good user experience

Efficiency:
- Optimal resource usage
- Fast response times
- Scalable performance

Maintainability:
- Easy to understand
- Easy to modify
- Well-documented

Portability:
- Works on different platforms
- Easy to adapt
- Platform-independent where possible
```

## Software Development Life Cycle

### SDLC Phases

**1. Planning:**
```
Purpose: Define project scope and feasibility

Activities:
- Identify stakeholders
- Define objectives
- Assess feasibility
- Estimate resources
- Create project plan

Deliverables:
- Project charter
- Feasibility study
- Resource plan
- Initial schedule
```

**2. Requirements Analysis:**
```
Purpose: Understand what software should do

Activities:
- Gather requirements
- Analyze needs
- Document specifications
- Validate with stakeholders

Deliverables:
- Requirements specification
- Use cases
- User stories
- Acceptance criteria
```

**3. Design:**
```
Purpose: Plan how software will be built

Activities:
- System architecture design
- Database design
- Interface design
- Component design

Deliverables:
- Architecture diagrams
- Database schema
- Interface mockups
- Design specifications
```

**4. Implementation:**
```
Purpose: Build the software

Activities:
- Write code
- Follow coding standards
- Conduct code reviews
- Version control

Deliverables:
- Source code
- Unit tests
- Documentation
- Build artifacts
```

**5. Testing:**
```
Purpose: Verify software quality

Activities:
- Unit testing
- Integration testing
- System testing
- Acceptance testing

Deliverables:
- Test plans
- Test cases
- Test results
- Bug reports
```

**6. Deployment:**
```
Purpose: Release software to users

Activities:
- Prepare environment
- Deploy software
- Configure systems
- Train users

Deliverables:
- Deployed system
- User documentation
- Training materials
- Deployment report
```

**7. Maintenance:**
```
Purpose: Keep software operational

Activities:
- Fix bugs
- Add features
- Optimize performance
- Update documentation

Types:
- Corrective (bug fixes)
- Adaptive (environment changes)
- Perfective (enhancements)
- Preventive (future-proofing)
```

### SDLC Models

**Waterfall Model:**
```
Sequential phases
Each phase must complete before next
No going back to previous phase

Phases:
Requirements → Design → Implementation → Testing → Deployment → Maintenance

Advantages:
- Simple and easy to understand
- Well-documented
- Clear milestones
- Works for small projects

Disadvantages:
- Inflexible
- Late testing
- No working software until late
- Difficult to accommodate changes
```

**V-Model:**
```
Extension of waterfall
Testing planned in parallel with development
Verification and validation emphasis

Left Side (Development):
Requirements → System Design → Architecture → Module Design → Coding

Right Side (Testing):
Acceptance Testing ← System Testing ← Integration Testing ← Unit Testing

Advantages:
- Testing planned early
- Clear test objectives
- Good for small to medium projects

Disadvantages:
- Still inflexible
- No early prototypes
- Expensive to make changes
```

**Iterative Model:**
```
Develop software in iterations
Each iteration produces working software
Refine in subsequent iterations

Process:
Initial Planning → Requirements → Design → Implementation → Testing → Evaluation → Next Iteration

Advantages:
- Working software early
- Easier to accommodate changes
- Risk management
- Continuous improvement

Disadvantages:
- Requires good planning
- More resources
- Complex management
```

**Spiral Model:**
```
Risk-driven approach
Combines iterative and waterfall
Four phases per spiral

Phases per Spiral:
1. Planning (objectives, alternatives)
2. Risk Analysis (identify and resolve risks)
3. Engineering (development and testing)
4. Evaluation (customer review)

Advantages:
- Risk management focus
- Flexible
- Customer involvement
- Good for large projects

Disadvantages:
- Complex
- Expensive
- Requires risk expertise
- Time-consuming
```

## Development Methodologies

### Agile Methodology

**Core Values (Agile Manifesto):**
```
1. Individuals and interactions over processes and tools
2. Working software over comprehensive documentation
3. Customer collaboration over contract negotiation
4. Responding to change over following a plan
```

**Principles:**
```
- Customer satisfaction through early and continuous delivery
- Welcome changing requirements
- Deliver working software frequently
- Business and developers work together daily
- Build projects around motivated individuals
- Face-to-face conversation
- Working software is primary measure of progress
- Sustainable development pace
- Continuous attention to technical excellence
- Simplicity
- Self-organizing teams
- Regular reflection and adjustment
```

**Scrum Framework:**
```
Roles:
- Product Owner (what to build)
- Scrum Master (facilitator)
- Development Team (builders)

Artifacts:
- Product Backlog (all features)
- Sprint Backlog (sprint features)
- Increment (working software)

Events:
- Sprint (1-4 weeks)
- Sprint Planning (plan sprint)
- Daily Scrum (15-min standup)
- Sprint Review (demo)
- Sprint Retrospective (improve)

Process:
Product Backlog → Sprint Planning → Sprint Backlog → Daily Scrum → Sprint Review → Sprint Retrospective → Increment
```

**Kanban:**
```
Visual workflow management
Continuous delivery
Limit work in progress

Board Columns:
To Do → In Progress → Testing → Done

Principles:
- Visualize workflow
- Limit WIP
- Manage flow
- Make policies explicit
- Implement feedback loops
- Improve collaboratively

Advantages:
- Flexible
- Continuous delivery
- Visual management
- Reduced waste

Disadvantages:
- Less structured
- Requires discipline
- Can become chaotic
```

**Extreme Programming (XP):**
```
Engineering practices focus
Short development cycles
Frequent releases

Practices:
- Pair programming
- Test-driven development (TDD)
- Continuous integration
- Refactoring
- Simple design
- Collective code ownership
- Coding standards
- Sustainable pace

Values:
- Communication
- Simplicity
- Feedback
- Courage
- Respect
```

### Traditional Methodologies

**Waterfall:**
```
Sequential phases
Complete one before next
Extensive documentation

Best for:
- Well-defined requirements
- Stable requirements
- Small projects
- Regulated industries
```

**RAD (Rapid Application Development):**
```
Quick development
User involvement
Prototyping focus

Phases:
1. Requirements Planning
2. User Design
3. Construction
4. Cutover

Advantages:
- Fast development
- User feedback
- Reduced risk

Disadvantages:
- Requires skilled team
- Not for large projects
- Requires user commitment
```

## Software Design Principles

### SOLID Principles

**Single Responsibility Principle:**
```
Definition: Class should have one reason to change

Explanation:
- One class, one responsibility
- Separation of concerns
- Easier to understand and maintain

Example:
Bad: User class handles authentication, database, email
Good: User, Authenticator, UserRepository, EmailService classes

Benefits:
- Easier testing
- Lower coupling
- Better organization
```

**Open/Closed Principle:**
```
Definition: Open for extension, closed for modification

Explanation:
- Add new functionality without changing existing code
- Use abstraction and polymorphism
- Protect stable code

Example:
Bad: Modify existing class for new feature
Good: Extend through inheritance or composition

Benefits:
- Stable codebase
- Reduced bugs
- Easier maintenance
```

**Liskov Substitution Principle:**
```
Definition: Subtypes must be substitutable for base types

Explanation:
- Derived classes must honor base class contract
- No surprising behavior
- Proper inheritance

Example:
Bad: Square extends Rectangle but breaks area calculation
Good: Proper inheritance hierarchy

Benefits:
- Reliable polymorphism
- Predictable behavior
- Correct abstractions
```

**Interface Segregation Principle:**
```
Definition: Clients shouldn't depend on unused interfaces

Explanation:
- Many specific interfaces better than one general
- No fat interfaces
- Clients use only what they need

Example:
Bad: One interface with many methods
Good: Multiple focused interfaces

Benefits:
- Flexible design
- Easier implementation
- Reduced coupling
```

**Dependency Inversion Principle:**
```
Definition: Depend on abstractions, not concretions

Explanation:
- High-level modules don't depend on low-level
- Both depend on abstractions
- Abstractions don't depend on details

Example:
Bad: Class directly instantiates dependencies
Good: Dependency injection with interfaces

Benefits:
- Loose coupling
- Testability
- Flexibility
```

### DRY Principle

**Don't Repeat Yourself:**
```
Definition: Every piece of knowledge should have single representation

Explanation:
- Avoid code duplication
- Extract common functionality
- Single source of truth

Benefits:
- Easier maintenance
- Consistency
- Reduced bugs

Application:
- Extract methods
- Create utilities
- Use inheritance/composition
- Configuration management
```

### KISS Principle

**Keep It Simple, Stupid:**
```
Definition: Simplicity should be key goal

Explanation:
- Avoid unnecessary complexity
- Simple solutions preferred
- Easy to understand

Benefits:
- Easier maintenance
- Fewer bugs
- Better performance
- Faster development

Application:
- Clear naming
- Simple algorithms
- Minimal dependencies
- Straightforward logic
```

### YAGNI Principle

**You Aren't Gonna Need It:**
```
Definition: Don't add functionality until needed

Explanation:
- Avoid premature optimization
- Build what's required now
- Don't anticipate future needs

Benefits:
- Faster development
- Less code to maintain
- Focused features
- Reduced complexity

Application:
- Implement current requirements
- Refactor when needed
- Avoid over-engineering
```

## Software Architecture

### Architectural Patterns

**Layered Architecture:**
```
Horizontal layers
Each layer has specific responsibility
Communication through adjacent layers

Typical Layers:
Presentation Layer (UI)
    ↓
Business Logic Layer (Domain)
    ↓
Data Access Layer (Persistence)
    ↓
Database

Advantages:
- Separation of concerns
- Easy to understand
- Testable layers
- Reusable layers

Disadvantages:
- Performance overhead
- Tight coupling between layers
- Monolithic deployment
```

**Microservices Architecture:**
```
Small, independent services
Each service has single responsibility
Communicate via APIs

Characteristics:
- Independently deployable
- Technology diversity
- Decentralized data
- Failure isolation

Advantages:
- Scalability
- Flexibility
- Resilience
- Team autonomy

Disadvantages:
- Complexity
- Distributed system challenges
- Network latency
- Data consistency
```

**Event-Driven Architecture:**
```
Components communicate via events
Asynchronous communication
Loose coupling

Components:
- Event Producers
- Event Consumers
- Event Bus/Broker

Advantages:
- Loose coupling
- Scalability
- Flexibility
- Real-time processing

Disadvantages:
- Complexity
- Debugging difficulty
- Event ordering
- Eventual consistency
```

**Hexagonal Architecture (Ports and Adapters):**
```
Core business logic in center
External concerns at edges
Ports define interfaces
Adapters implement interfaces

Structure:
External Systems → Adapters → Ports → Core Domain

Advantages:
- Testability
- Flexibility
- Technology independence
- Clear boundaries

Disadvantages:
- Initial complexity
- More code
- Learning curve
```

### Architectural Styles

**Monolithic:**
```
Single deployable unit
All components together
Shared database

Advantages:
- Simple development
- Easy deployment
- Easy testing
- Performance

Disadvantages:
- Scaling challenges
- Technology lock-in
- Long deployment cycles
- Tight coupling
```

**Service-Oriented Architecture (SOA):**
```
Services communicate via protocols
Enterprise service bus
Shared services

Characteristics:
- Reusable services
- Standardized contracts
- Loose coupling
- Discoverability

Advantages:
- Reusability
- Interoperability
- Scalability

Disadvantages:
- Complexity
- Performance overhead
- Governance challenges
```

## Requirements Engineering

### Requirements Types

**Functional Requirements:**
```
What system should do
Specific behaviors and functions
User interactions

Examples:
- User can log in with email and password
- System sends confirmation email
- User can search products by category
- System calculates total price with tax
```

**Non-Functional Requirements:**
```
How system should be
Quality attributes
Constraints

Categories:
Performance:
- Response time < 2 seconds
- Support 10,000 concurrent users
- Process 1000 transactions/second

Security:
- Encrypt data in transit and at rest
- Multi-factor authentication
- Role-based access control

Usability:
- Intuitive interface
- Accessible (WCAG 2.1)
- Mobile-responsive

Reliability:
- 99.9% uptime
- Automatic failover
- Data backup every hour

Maintainability:
- Modular architecture
- Comprehensive documentation
- Automated testing

Scalability:
- Horizontal scaling
- Handle 10x growth
- Cloud-native design
```

### Requirements Gathering

**Techniques:**
```
Interviews:
- One-on-one discussions
- Stakeholder insights
- Detailed information

Workshops:
- Group sessions
- Collaborative
- Consensus building

Surveys:
- Large audience
- Quantitative data
- Statistical analysis

Observation:
- Watch users
- Understand workflow
- Identify pain points

Prototyping:
- Visual representation
- Early feedback
- Validate concepts

Document Analysis:
- Existing documentation
- Business processes
- Regulatory requirements
```

### Requirements Documentation

**User Stories:**
```
Format: As a [role], I want [feature], so that [benefit]

Example:
As a customer, I want to save items to wishlist, so that I can purchase them later

Acceptance Criteria:
- User can add items to wishlist
- User can view wishlist
- User can remove items from wishlist
- Wishlist persists across sessions
```

**Use Cases:**
```
Structured description of interactions

Components:
- Actor (who)
- Goal (what)
- Preconditions (requirements)
- Main Flow (steps)
- Alternative Flows (variations)
- Postconditions (results)

Example:
Use Case: Purchase Product
Actor: Customer
Goal: Complete purchase
Preconditions: User logged in, items in cart
Main Flow:
1. User views cart
2. User proceeds to checkout
3. User enters shipping address
4. User selects payment method
5. User confirms order
6. System processes payment
7. System sends confirmation
Postconditions: Order created, inventory updated
```

## Software Testing

### Testing Levels

**Unit Testing:**
```
Test individual components
Isolated from dependencies
Automated

Characteristics:
- Fast execution
- High coverage
- Early bug detection
- Developer-written

Tools:
- Jest, Mocha (JavaScript)
- JUnit (Java)
- pytest (Python)
```

**Integration Testing:**
```
Test component interactions
Verify interfaces
Database integration

Characteristics:
- Tests multiple units
- Verifies data flow
- Catches interface issues

Approaches:
- Big Bang (all at once)
- Top-Down (from top)
- Bottom-Up (from bottom)
- Sandwich (combination)
```

**System Testing:**
```
Test complete system
End-to-end scenarios
Production-like environment

Types:
- Functional testing
- Performance testing
- Security testing
- Usability testing
```

**Acceptance Testing:**
```
Validate against requirements
User perspective
Production environment

Types:
- User Acceptance Testing (UAT)
- Business Acceptance Testing (BAT)
- Alpha Testing (internal)
- Beta Testing (external)
```

### Testing Types

**Functional Testing:**
```
Verify functionality
Test against requirements
Black-box approach

Includes:
- Unit testing
- Integration testing
- System testing
- Acceptance testing
```

**Non-Functional Testing:**
```
Verify quality attributes
Performance, security, usability

Types:
Performance Testing:
- Load testing (expected load)
- Stress testing (beyond capacity)
- Spike testing (sudden increase)
- Endurance testing (extended period)

Security Testing:
- Vulnerability scanning
- Penetration testing
- Security audits

Usability Testing:
- User experience
- Accessibility
- Intuitiveness
```

**Regression Testing:**
```
Verify existing functionality
After changes
Prevent breaking changes

Approach:
- Automated test suite
- Run after each change
- Continuous integration
```

### Testing Strategies

**Test-Driven Development (TDD):**
```
Write tests before code
Red-Green-Refactor cycle

Process:
1. Write failing test (Red)
2. Write minimal code to pass (Green)
3. Refactor code (Refactor)
4. Repeat

Benefits:
- Better design
- High coverage
- Confidence in changes
- Documentation
```

**Behavior-Driven Development (BDD):**
```
Specify behavior in plain language
Collaboration between technical and non-technical
Given-When-Then format

Example:
Given user is logged in
When user clicks logout button
Then user is logged out
And user is redirected to home page

Benefits:
- Clear requirements
- Shared understanding
- Living documentation
```

## Software Maintenance

### Maintenance Types

**Corrective Maintenance:**
```
Fix bugs and defects
Reactive approach
Highest priority

Activities:
- Bug identification
- Root cause analysis
- Fix implementation
- Testing
- Deployment
```

**Adaptive Maintenance:**
```
Adapt to environment changes
Operating system updates
Third-party API changes
Regulatory compliance

Activities:
- Monitor environment
- Assess impact
- Plan changes
- Implement updates
- Test compatibility
```

**Perfective Maintenance:**
```
Enhance functionality
Improve performance
Better user experience

Activities:
- Gather feedback
- Prioritize enhancements
- Design improvements
- Implement changes
- Measure impact
```

**Preventive Maintenance:**
```
Prevent future problems
Code refactoring
Technical debt reduction
Documentation updates

Activities:
- Code reviews
- Refactoring
- Update dependencies
- Improve tests
- Update documentation
```

### Technical Debt

**Definition:**
```
Cost of additional work caused by choosing quick solution over better approach

Types:
- Deliberate (conscious decision)
- Accidental (lack of knowledge)
- Bit rot (code aging)

Causes:
- Time pressure
- Lack of knowledge
- Changing requirements
- Poor practices

Impact:
- Slower development
- More bugs
- Difficult maintenance
- Lower morale

Management:
- Track technical debt
- Prioritize repayment
- Allocate time for refactoring
- Prevent accumulation
```

## Project Management

### Project Planning

**Work Breakdown Structure (WBS):**
```
Hierarchical decomposition
Break project into tasks
Manageable components

Levels:
Project
  ├── Phase 1
  │   ├── Task 1.1
  │   └── Task 1.2
  └── Phase 2
      ├── Task 2.1
      └── Task 2.2

Benefits:
- Clear scope
- Better estimation
- Resource allocation
- Progress tracking
```

### Estimation Techniques

**Story Points:**
```
Relative estimation
Fibonacci sequence (1, 2, 3, 5, 8, 13)
Team velocity

Process:
1. Reference story
2. Compare complexity
3. Assign points
4. Track velocity
5. Plan sprints
```

**Planning Poker:**
```
Collaborative estimation
Team consensus
Fibonacci cards

Process:
1. Present story
2. Discussion
3. Private estimation
4. Reveal cards
5. Discuss differences
6. Re-estimate
7. Consensus
```

### Risk Management

**Risk Process:**
```
1. Identification
   - Brainstorming
   - Checklists
   - Expert judgment

2. Analysis
   - Probability
   - Impact
   - Priority

3. Planning
   - Mitigation strategies
   - Contingency plans
   - Risk owners

4. Monitoring
   - Track risks
   - Update status
   - Trigger responses
```

## Quality Assurance

### Code Quality

**Metrics:**
```
Code Coverage:
- Percentage of code tested
- Target: 80%+

Cyclomatic Complexity:
- Number of paths through code
- Lower is better
- Target: < 10

Code Duplication:
- Repeated code blocks
- Target: < 5%

Maintainability Index:
- Composite metric
- 0-100 scale
- Target: > 65
```

### Code Review

**Process:**
```
1. Author submits code
2. Reviewers assigned
3. Review conducted
4. Feedback provided
5. Author addresses feedback
6. Approval and merge

Best Practices:
- Small, focused changes
- Clear description
- Automated checks first
- Constructive feedback
- Timely reviews
```

### Continuous Integration/Deployment

**CI/CD Pipeline:**
```
Code Commit
    ↓
Build
    ↓
Unit Tests
    ↓
Integration Tests
    ↓
Code Quality Checks
    ↓
Deploy to Staging
    ↓
Acceptance Tests
    ↓
Deploy to Production

Benefits:
- Fast feedback
- Early bug detection
- Automated deployment
- Reduced risk
```

## Interview Questions

**Q: Explain Agile vs Waterfall methodology.**

A: Waterfall is sequential (requirements→design→implementation→testing), rigid, extensive documentation, late testing. Agile is iterative, flexible, working software focus, continuous testing. Waterfall for stable requirements and regulated industries. Agile for changing requirements and fast delivery. Agile enables faster feedback and adaptation.

**Q: What are SOLID principles?**

A: Five object-oriented design principles: Single Responsibility (one reason to change), Open/Closed (open for extension, closed for modification), Liskov Substitution (subtypes substitutable), Interface Segregation (specific interfaces), Dependency Inversion (depend on abstractions). Improve maintainability, flexibility, testability.

**Q: Explain technical debt.**

A: Cost of choosing quick solution over better approach. Types: deliberate (conscious), accidental (lack of knowledge), bit rot (aging). Causes: time pressure, poor practices, changing requirements. Impact: slower development, more bugs, difficult maintenance. Manage by tracking, prioritizing repayment, preventing accumulation.

**Q: What is Test-Driven Development?**

A: Write tests before code. Red-Green-Refactor cycle: write failing test, write minimal code to pass, refactor. Benefits: better design, high coverage, confidence in changes, living documentation. Ensures testable code and clear requirements. Requires discipline but improves quality.

**Q: Explain microservices architecture.**

A: Small, independent services with single responsibility, communicate via APIs. Benefits: scalability, flexibility, resilience, team autonomy, technology diversity. Challenges: complexity, distributed system issues, network latency, data consistency. Use for large systems needing independent scaling and deployment.

---

[← Back to Network Theory](./13-network-theory.md) | [Next: Information Theory →](./15-information-theory.md)
