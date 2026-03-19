# Database Theory / Lý Thuyết Cơ Sở Dữ Liệu

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Data Structures](../01-cs-fundamentals/data-structures-theory.md)
> **See also**: [Indexing & Optimization](./02-indexing-and-optimization.md) | [NoSQL & NewSQL](./03-nosql-and-newsql.md) | [BE Database Advanced](../../be-track/03-database-advanced/)

---

## Real-World Scenario / Tình Huống Thực Tế

E-commerce app của bạn bắt đầu chậm. User phàn nàn checkout mất 8 giây. Bạn xem query logs: `SELECT * FROM orders JOIN users JOIN products WHERE ...` đang chạy full table scan trên bảng 10 triệu rows.

**Không có index → O(n) scan.** Add index đúng chỗ → O(log n) B-Tree lookup → query xuống còn 50ms.

Đây là lý do mọi developer cần hiểu database internals: không chỉ biết cách write queries, mà biết **tại sao** query chậm và cách fix.

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng — Thư viện:**
- **Table** = kệ sách (rows = sách, columns = thông tin mỗi cuốn)
- **Index** = mục lục — không có mục lục phải đọc từng trang (full scan)
- **Transaction** = quy trình mượn sách: chưa ký giấy xong thì chưa tính là đã mượn
- **ACID** = đảm bảo thư viện không bao giờ mất sách (Durability), không đếm nhầm (Consistency)

| Concept | "Chết vì không biết" example |
|---------|------------------------------|
| **Index** | Full table scan trên bảng 10M rows |
| **N+1 query** | Load 100 posts + 100 queries riêng cho comments |
| **Transaction** | Double charge user vì race condition |
| **Normalization** | Duplicate data → inconsistency khi update |
| **NoSQL trade-offs** | Chọn MongoDB vì "flexible" → schema chaos |

---

## Concept Map / Bản Đồ Khái Niệm

```
    [Data Structures: B-Tree, Hash Table]
                    │
                    ▼
           [DATABASE THEORY]  ← bạn đang ở đây
                    │
         ┌──────────┼──────────┐
         ▼          ▼          ▼
  [Relational]  [Storage]  [Transactions]
  Tables/Keys   B-Tree idx   ACID
  Normalization  WAL/Redo    Isolation levels
  SQL/joins      Heap files  Deadlocks
         │
         ▼
  [NoSQL: Document | Key-Value | Column | Graph]
         │
         ▼
  [Scale: Sharding | Replication | Connection pool]
```

---

## Foundations of Data Management / Nền Tảng Quản Lý Dữ Liệu

**English:** Database theory encompasses the mathematical and logical foundations of database systems, including data models, query languages, transaction processing, and storage mechanisms.

**Tiếng Việt:** Lý thuyết cơ sở dữ liệu bao gồm các nền tảng toán học và logic của hệ thống cơ sở dữ liệu, bao gồm mô hình dữ liệu, ngôn ngữ truy vấn, xử lý giao dịch và cơ chế lưu trữ.

## Table of Contents
1. [Database Fundamentals](#database-fundamentals)
2. [Relational Model Theory](#relational-model-theory)
3. [Normalization Theory](#normalization-theory)
4. [Transaction Theory](#transaction-theory)
5. [Query Processing](#query-processing)
6. [Indexing Strategies](#indexing-strategies)
7. [Concurrency Control](#concurrency-control)
8. [Recovery Systems](#recovery-systems)
9. [Distributed Databases](#distributed-databases)
10. [NoSQL Theory](#nosql-theory)

## Database Fundamentals

### What is a Database?

**Definition:** A database is an organized collection of structured information stored electronically and managed by a Database Management System (DBMS).

**Key Components:**
- **Data:** Raw facts and figures
- **Database:** Organized collection of data
- **DBMS:** Software to manage database
- **Database System:** Database + DBMS + Applications

### Database Models Evolution

**Hierarchical Model (1960s):**
```
Company
├── Department A
│   ├── Employee 1
│   └── Employee 2
└── Department B
    ├── Employee 3
    └── Employee 4
```

**Characteristics:**
- Tree-like structure
- Parent-child relationships
- One-to-many only
- Fast navigation but inflexible

**Network Model (1970s):**
```
Employee ←→ Project
    ↓         ↓
Department ←→ Location
```

**Characteristics:**
- Graph structure
- Many-to-many relationships
- More flexible but complex
- CODASYL standard

**Relational Model (1970s-present):**
```sql
Employees Table:
| EmployeeID | Name  | DeptID |
|------------|-------|--------|
| 1          | John  | 10     |
| 2          | Jane  | 20     |

Departments Table:
| DeptID | DeptName |
|--------|----------|
| 10     | Sales    |
| 20     | IT       |
```

**Characteristics:**
- Data in tables (relations)
- Mathematical foundation
- SQL as standard language
- Most widely used

## Relational Model Theory

### Mathematical Foundation

**Set Theory Basis:**

A relation R is a subset of the Cartesian product of domains:
```
R ⊆ D₁ × D₂ × ... × Dₙ

Where:
- R is a relation (table)
- D₁, D₂, ..., Dₙ are domains (data types)
- × represents Cartesian product
```

**Example:**
```
Domain D₁ = {1, 2, 3} (EmployeeID)
Domain D₂ = {John, Jane, Bob} (Name)

Cartesian Product D₁ × D₂:
{(1, John), (1, Jane), (1, Bob),
 (2, John), (2, Jane), (2, Bob),
 (3, John), (3, Jane), (3, Bob)}

Relation R (actual data):
{(1, John), (2, Jane), (3, Bob)}
```

### Relational Algebra

**Selection (σ):**
```
σ_condition(R)

Example: σ_age>25(Employee)
Result: All employees where age > 25
```

**SQL Equivalent:**
```sql
SELECT * FROM Employee WHERE age > 25;
```

**Projection (π):**
```
π_attributes(R)

Example: π_name,salary(Employee)
Result: Only name and salary columns
```

**SQL Equivalent:**
```sql
SELECT name, salary FROM Employee;
```

**Union (∪):**
```
R ∪ S

Requirements:
- Same number of attributes
- Compatible domains
- Union compatible
```

**SQL Equivalent:**
```sql
SELECT * FROM R
UNION
SELECT * FROM S;
```

**Intersection (∩):**
```
R ∩ S

Result: Tuples present in both relations
```

**SQL Equivalent:**
```sql
SELECT * FROM R
INTERSECT
SELECT * FROM S;
```

**Difference (−):**
```
R − S

Result: Tuples in R but not in S
```

**SQL Equivalent:**
```sql
SELECT * FROM R
EXCEPT
SELECT * FROM S;
```

**Cartesian Product (×):**
```
R × S

Result: All possible combinations
```

**SQL Equivalent:**
```sql
SELECT * FROM R CROSS JOIN S;
```

**Join (⋈):**

**Natural Join:**
```
R ⋈ S

Joins on common attributes
```

**Theta Join:**
```
R ⋈_condition S

Joins with specific condition
```

**SQL Examples:**
```sql
-- Natural Join
SELECT * FROM Employee NATURAL JOIN Department;

-- Inner Join
SELECT * FROM Employee e
INNER JOIN Department d ON e.dept_id = d.id;

-- Left Outer Join
SELECT * FROM Employee e
LEFT JOIN Department d ON e.dept_id = d.id;

-- Right Outer Join
SELECT * FROM Employee e
RIGHT JOIN Department d ON e.dept_id = d.id;

-- Full Outer Join
SELECT * FROM Employee e
FULL OUTER JOIN Department d ON e.dept_id = d.id;
```

### Keys and Constraints

**Superkey:**
- Set of attributes that uniquely identifies tuples
- May contain redundant attributes

**Example:**
```
Employee(ID, SSN, Name, Email)

Superkeys:
- {ID}
- {SSN}
- {Email}
- {ID, Name}
- {SSN, Email}
- {ID, SSN, Name, Email}
```

**Candidate Key:**
- Minimal superkey
- No proper subset is a superkey

**Example:**
```
Candidate Keys:
- {ID}
- {SSN}
- {Email}
```

**Primary Key:**
- Chosen candidate key
- Cannot be null
- Uniquely identifies each tuple

**Foreign Key:**
- References primary key of another relation
- Maintains referential integrity

**Example:**
```sql
CREATE TABLE Department (
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(100)
);

CREATE TABLE Employee (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100),
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES Department(dept_id)
);
```

### Integrity Constraints

**Entity Integrity:**
```sql
-- Primary key cannot be null
CREATE TABLE Employee (
    emp_id INT PRIMARY KEY NOT NULL,
    name VARCHAR(100)
);
```

**Referential Integrity:**
```sql
-- Foreign key must reference existing primary key
CREATE TABLE Employee (
    emp_id INT PRIMARY KEY,
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES Department(dept_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```

**Domain Integrity:**
```sql
-- Attribute values must be from specified domain
CREATE TABLE Employee (
    emp_id INT PRIMARY KEY,
    age INT CHECK (age >= 18 AND age <= 65),
    email VARCHAR(100) CHECK (email LIKE '%@%.%'),
    status ENUM('active', 'inactive', 'suspended')
);
```

**User-Defined Integrity:**
```sql
-- Business rules
CREATE TABLE Employee (
    emp_id INT PRIMARY KEY,
    salary DECIMAL(10,2),
    manager_id INT,
    CONSTRAINT salary_check CHECK (
        salary > 0 AND 
        (manager_id IS NULL OR salary < (
            SELECT salary FROM Employee WHERE emp_id = manager_id
        ))
    )
);
```

## Normalization Theory

### Purpose and Goals

**Objectives:**
1. Eliminate redundancy
2. Prevent update anomalies
3. Ensure data integrity
4. Optimize storage
5. Improve query performance

### Anomalies

**Insertion Anomaly:**
```
StudentCourse Table:
| StudentID | StudentName | CourseID | CourseName |
|-----------|-------------|----------|------------|
| 1         | John        | CS101    | Databases  |

Problem: Cannot add a course without a student
Cannot add a student without a course
```

**Update Anomaly:**
```
| StudentID | StudentName | CourseID | CourseName |
|-----------|-------------|----------|------------|
| 1         | John        | CS101    | Databases  |
| 1         | John        | CS102    | Algorithms |

Problem: If John changes name, must update multiple rows
Risk of inconsistency if some rows not updated
```

**Deletion Anomaly:**
```
| StudentID | StudentName | CourseID | CourseName |
|-----------|-------------|----------|------------|
| 1         | John        | CS101    | Databases  |

Problem: If John drops CS101, we lose course information
If it's the last student in CS101
```

### Functional Dependencies

**Definition:** X → Y means if two tuples have the same X value, they must have the same Y value.

**Example:**
```
Employee(ID, SSN, Name, DeptID, DeptName)

Functional Dependencies:
- ID → SSN, Name, DeptID
- SSN → ID, Name, DeptID
- DeptID → DeptName
```

**Armstrong's Axioms:**

**Reflexivity:**
```
If Y ⊆ X, then X → Y

Example: {ID, Name} → {ID}
```

**Augmentation:**
```
If X → Y, then XZ → YZ

Example: If ID → Name
Then {ID, DeptID} → {Name, DeptID}
```

**Transitivity:**
```
If X → Y and Y → Z, then X → Z

Example: If ID → DeptID and DeptID → DeptName
Then ID → DeptName
```

### Normal Forms

**First Normal Form (1NF):**

**Requirements:**
- Atomic values only
- No repeating groups
- Each cell contains single value

**Violation Example:**
```
| StudentID | Name | Courses              |
|-----------|------|----------------------|
| 1         | John | Math, Physics, Chem  |
| 2         | Jane | Biology, Chemistry   |
```

**1NF Solution:**
```
| StudentID | Name | Course    |
|-----------|------|-----------|
| 1         | John | Math      |
| 1         | John | Physics   |
| 1         | John | Chemistry |
| 2         | Jane | Biology   |
| 2         | Jane | Chemistry |
```

**Second Normal Form (2NF):**

**Requirements:**
- Must be in 1NF
- No partial dependencies
- Non-key attributes fully dependent on entire primary key

**Violation Example:**
```
Enrollment(StudentID, CourseID, StudentName, CourseName, Grade)
Primary Key: {StudentID, CourseID}

Partial Dependencies:
- StudentID → StudentName (partial)
- CourseID → CourseName (partial)
```

**2NF Solution:**
```sql
-- Students table
CREATE TABLE Students (
    student_id INT PRIMARY KEY,
    student_name VARCHAR(100)
);

-- Courses table
CREATE TABLE Courses (
    course_id INT PRIMARY KEY,
    course_name VARCHAR(100)
);

-- Enrollments table
CREATE TABLE Enrollments (
    student_id INT,
    course_id INT,
    grade CHAR(1),
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);
```

**Third Normal Form (3NF):**

**Requirements:**
- Must be in 2NF
- No transitive dependencies
- Non-key attributes depend only on primary key

**Violation Example:**
```
Employee(EmpID, Name, DeptID, DeptName, DeptLocation)
Primary Key: EmpID

Transitive Dependency:
EmpID → DeptID → DeptName, DeptLocation
```

**3NF Solution:**
```sql
-- Employees table
CREATE TABLE Employees (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100),
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES Departments(dept_id)
);

-- Departments table
CREATE TABLE Departments (
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(100),
    dept_location VARCHAR(100)
);
```

**Boyce-Codd Normal Form (BCNF):**

**Requirements:**
- Must be in 3NF
- For every functional dependency X → Y, X must be a superkey

**Violation Example:**
```
CourseInstructor(StudentID, Course, Instructor)
Assumptions:
- Each student takes each course once
- Each course has multiple instructors
- Each instructor teaches only one course

Functional Dependencies:
- {StudentID, Course} → Instructor
- Instructor → Course (violates BCNF)
```

**BCNF Solution:**
```sql
-- Student Courses
CREATE TABLE StudentCourses (
    student_id INT,
    instructor_id INT,
    PRIMARY KEY (student_id, instructor_id)
);

-- Instructor Courses
CREATE TABLE InstructorCourses (
    instructor_id INT PRIMARY KEY,
    course_id INT
);
```

**Fourth Normal Form (4NF):**

**Requirements:**
- Must be in BCNF
- No multi-valued dependencies

**Violation Example:**
```
Employee(EmpID, Skill, Language)
- One employee can have multiple skills
- One employee can speak multiple languages
- Skills and languages are independent

Multi-valued Dependencies:
- EmpID →→ Skill
- EmpID →→ Language
```

**4NF Solution:**
```sql
CREATE TABLE EmployeeSkills (
    emp_id INT,
    skill VARCHAR(100),
    PRIMARY KEY (emp_id, skill)
);

CREATE TABLE EmployeeLanguages (
    emp_id INT,
    language VARCHAR(100),
    PRIMARY KEY (emp_id, language)
);
```

## Transaction Theory

### ACID Properties

**Atomicity:**
```sql
BEGIN TRANSACTION;
    UPDATE Account SET balance = balance - 100 WHERE id = 1;
    UPDATE Account SET balance = balance + 100 WHERE id = 2;
COMMIT; -- Both succeed or both fail
```

**Consistency:**
```sql
-- Constraint: balance >= 0
BEGIN TRANSACTION;
    UPDATE Account SET balance = balance - 100 WHERE id = 1;
    -- If this violates constraint, transaction rolls back
COMMIT;
```

**Isolation:**
```sql
-- Transaction 1
BEGIN TRANSACTION;
    SELECT balance FROM Account WHERE id = 1; -- 1000
    -- Other transactions don't see uncommitted changes
    UPDATE Account SET balance = 900 WHERE id = 1;
COMMIT;
```

**Durability:**
```sql
BEGIN TRANSACTION;
    INSERT INTO Orders VALUES (1, 'Product', 100);
COMMIT; -- Data persists even if system crashes
```

### Concurrency Problems

**Lost Update:**
```
Time | Transaction 1        | Transaction 2
-----|---------------------|---------------------
T1   | READ X (100)        |
T2   |                     | READ X (100)
T3   | X = X + 50 (150)    |
T4   |                     | X = X + 30 (130)
T5   | WRITE X (150)       |
T6   |                     | WRITE X (130) ← Lost T1's update
```

**Dirty Read:**
```
Time | Transaction 1        | Transaction 2
-----|---------------------|---------------------
T1   | READ X (100)        |
T2   | X = X + 50 (150)    |
T3   | WRITE X (150)       |
T4   |                     | READ X (150) ← Dirty
T5   | ROLLBACK            |
T6   |                     | Uses wrong value
```

**Non-Repeatable Read:**
```
Time | Transaction 1        | Transaction 2
-----|---------------------|---------------------
T1   | READ X (100)        |
T2   |                     | READ X (100)
T3   |                     | X = X + 50 (150)
T4   |                     | WRITE X (150)
T5   |                     | COMMIT
T6   | READ X (150)        | ← Different value
```

**Phantom Read:**
```
Time | Transaction 1                    | Transaction 2
-----|----------------------------------|------------------
T1   | SELECT COUNT(*) WHERE age > 25   |
T2   | Result: 5                        |
T3   |                                  | INSERT age = 30
T4   |                                  | COMMIT
T5   | SELECT COUNT(*) WHERE age > 25   |
T6   | Result: 6 ← Phantom record       |
```

### Isolation Levels

**Read Uncommitted:**
```sql
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
BEGIN TRANSACTION;
    -- Can read uncommitted changes from other transactions
    SELECT * FROM Account;
COMMIT;
```

**Problems:** Dirty reads, non-repeatable reads, phantom reads

**Read Committed:**
```sql
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN TRANSACTION;
    -- Only reads committed data
    SELECT * FROM Account;
COMMIT;
```

**Problems:** Non-repeatable reads, phantom reads

**Repeatable Read:**
```sql
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;
    -- Same query returns same results
    SELECT * FROM Account WHERE id = 1;
    -- ... other operations ...
    SELECT * FROM Account WHERE id = 1; -- Same result
COMMIT;
```

**Problems:** Phantom reads

**Serializable:**
```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;
    -- Complete isolation, equivalent to serial execution
    SELECT * FROM Account;
COMMIT;
```

**Problems:** None, but lowest performance

### Locking Mechanisms

**Shared Lock (S-Lock):**
```sql
-- Multiple transactions can hold shared locks
BEGIN TRANSACTION;
    SELECT * FROM Account WHERE id = 1 LOCK IN SHARE MODE;
    -- Other transactions can read but not write
COMMIT;
```

**Exclusive Lock (X-Lock):**
```sql
-- Only one transaction can hold exclusive lock
BEGIN TRANSACTION;
    SELECT * FROM Account WHERE id = 1 FOR UPDATE;
    -- Other transactions cannot read or write
    UPDATE Account SET balance = 1000 WHERE id = 1;
COMMIT;
```

**Lock Compatibility Matrix:**
```
        | S-Lock | X-Lock
--------|--------|--------
S-Lock  |   ✓    |   ✗
X-Lock  |   ✗    |   ✗
```

**Two-Phase Locking (2PL):**

**Growing Phase:**
- Transaction acquires locks
- Cannot release any locks

**Shrinking Phase:**
- Transaction releases locks
- Cannot acquire new locks

```sql
BEGIN TRANSACTION;
    -- Growing Phase
    LOCK TABLE Account IN SHARE MODE;
    SELECT * FROM Account WHERE id = 1;
    
    LOCK TABLE Account IN EXCLUSIVE MODE;
    UPDATE Account SET balance = 1000 WHERE id = 1;
    
    -- Shrinking Phase
    COMMIT; -- Releases all locks
```

**Deadlock:**
```
Time | Transaction 1        | Transaction 2
-----|---------------------|---------------------
T1   | LOCK A              |
T2   |                     | LOCK B
T3   | Wait for B          |
T4   |                     | Wait for A ← Deadlock
```

**Deadlock Detection:**
```sql
-- MySQL shows deadlocks
SHOW ENGINE INNODB STATUS;

-- PostgreSQL
SELECT * FROM pg_locks WHERE NOT granted;
```

**Deadlock Prevention:**
```sql
-- Timeout approach
SET innodb_lock_wait_timeout = 50;

-- Ordered locking
BEGIN TRANSACTION;
    -- Always lock in same order
    LOCK TABLE Account, Transaction IN EXCLUSIVE MODE;
COMMIT;
```

## Query Processing

### Query Execution Pipeline

**Steps:**
1. **Parsing:** Convert SQL to parse tree
2. **Optimization:** Generate execution plan
3. **Execution:** Execute plan
4. **Result:** Return data

**Example:**
```sql
SELECT e.name, d.dept_name
FROM Employee e
JOIN Department d ON e.dept_id = d.dept_id
WHERE e.salary > 50000;
```

**Parse Tree:**
```
        SELECT
       /      \
    PROJECT   FROM
      |         |
   name,     JOIN
   dept_name  / \
            e   d
            |
         WHERE
            |
        salary > 50000
```

### Query Optimization

**Cost-Based Optimization:**

**Cost Factors:**
- I/O cost (disk reads/writes)
- CPU cost (processing)
- Memory cost (buffer usage)
- Network cost (distributed queries)

**Example:**
```sql
-- Query
SELECT * FROM Employee WHERE dept_id = 10;

-- Option 1: Table Scan
Cost = (Number of pages) × (I/O cost per page)
     = 1000 × 1 = 1000

-- Option 2: Index Scan
Cost = (Index levels) × (I/O cost) + (Result pages) × (I/O cost)
     = 3 × 1 + 10 × 1 = 13

-- Optimizer chooses Option 2
```

**Join Algorithms:**

**Nested Loop Join:**
```
for each row r in R:
    for each row s in S:
        if r.key == s.key:
            output (r, s)

Cost: O(|R| × |S|)
```

**Hash Join:**
```
1. Build hash table on smaller relation
2. Probe with larger relation

Cost: O(|R| + |S|)
```

**Sort-Merge Join:**
```
1. Sort both relations on join key
2. Merge sorted relations

Cost: O(|R| log |R| + |S| log |S|)
```

### Execution Plans

**EXPLAIN Command:**
```sql
EXPLAIN SELECT e.name, d.dept_name
FROM Employee e
JOIN Department d ON e.dept_id = d.dept_id
WHERE e.salary > 50000;
```

**Output:**
```
+----+-------------+-------+------+---------------+------+---------+------+------+-------------+
| id | select_type | table | type | possible_keys | key  | key_len | ref  | rows | Extra       |
+----+-------------+-------+------+---------------+------+---------+------+------+-------------+
|  1 | SIMPLE      | e     | ALL  | dept_id       | NULL | NULL    | NULL | 1000 | Using where |
|  1 | SIMPLE      | d     | ref  | PRIMARY       | PRIMARY | 4    | e.dept_id | 1 |        |
+----+-------------+-------+------+---------------+------+---------+------+------+-------------+
```

## Indexing Strategies

### Index Types

**B-Tree Index:**
```
                [50]
               /    \
          [25]      [75]
         /    \    /    \
    [10,20] [30,40] [60,70] [80,90]
```

**Characteristics:**
- Balanced tree structure
- O(log n) search time
- Good for range queries
- Default in most databases

**Hash Index:**
```
Hash Function: h(key) = key % 10

Key 15 → Bucket 5
Key 25 → Bucket 5 (collision)
Key 35 → Bucket 5 (collision)
```

**Characteristics:**
- O(1) average search time
- Only equality searches
- No range queries
- Collision handling needed

**Bitmap Index:**
```
Gender Index:
Male:   [1, 0, 1, 0, 1, 0]
Female: [0, 1, 0, 1, 0, 1]

Status Index:
Active:   [1, 1, 0, 1, 0, 1]
Inactive: [0, 0, 1, 0, 1, 0]
```

**Characteristics:**
- Efficient for low cardinality
- Fast bitwise operations
- Good for data warehouses

### Index Design

**Single-Column Index:**
```sql
CREATE INDEX idx_employee_name ON Employee(name);

-- Good for:
SELECT * FROM Employee WHERE name = 'John';
```

**Composite Index:**
```sql
CREATE INDEX idx_emp_dept_salary ON Employee(dept_id, salary);

-- Good for:
SELECT * FROM Employee WHERE dept_id = 10 AND salary > 50000;
SELECT * FROM Employee WHERE dept_id = 10;

-- Not good for:
SELECT * FROM Employee WHERE salary > 50000; -- Doesn't use index
```

**Covering Index:**
```sql
CREATE INDEX idx_covering ON Employee(dept_id, name, salary);

-- Query can be satisfied entirely from index
SELECT name, salary FROM Employee WHERE dept_id = 10;
```

**Partial Index:**
```sql
CREATE INDEX idx_active_employees ON Employee(name)
WHERE status = 'active';

-- Only indexes active employees
```

### Index Maintenance

**Index Fragmentation:**
```sql
-- Check fragmentation
SELECT index_name, avg_fragmentation_in_percent
FROM sys.dm_db_index_physical_stats(DB_ID(), OBJECT_ID('Employee'), NULL, NULL, 'DETAILED');

-- Rebuild index
ALTER INDEX idx_employee_name ON Employee REBUILD;

-- Reorganize index
ALTER INDEX idx_employee_name ON Employee REORGANIZE;
```

## Distributed Databases

### CAP Theorem

**Consistency:** All nodes see the same data at the same time

**Availability:** Every request receives a response

**Partition Tolerance:** System continues despite network partitions

**Trade-offs:**
- **CP Systems:** Consistency + Partition Tolerance (MongoDB, HBase)
- **AP Systems:** Availability + Partition Tolerance (Cassandra, DynamoDB)
- **CA Systems:** Consistency + Availability (Traditional RDBMS, not partition tolerant)

### Replication Strategies

**Master-Slave Replication:**
```
    Master (Write)
    /    |    \
Slave  Slave  Slave (Read)
```

**Master-Master Replication:**
```
Master 1 ←→ Master 2
   ↓           ↓
Slave 1    Slave 2
```

**Quorum-Based Replication:**
```
W + R > N

Where:
- W = Write quorum
- R = Read quorum
- N = Total replicas
```

### Sharding

**Horizontal Sharding:**
```
Users Table:
Shard 1: user_id 1-1000
Shard 2: user_id 1001-2000
Shard 3: user_id 2001-3000
```

**Vertical Sharding:**
```
Shard 1: user_id, name, email
Shard 2: user_id, address, phone
Shard 3: user_id, preferences, settings
```

**Sharding Strategies:**

**Range-Based:**
```sql
-- Shard by user_id range
IF user_id <= 1000 THEN shard_1
ELSIF user_id <= 2000 THEN shard_2
ELSE shard_3
```

**Hash-Based:**
```sql
-- Shard by hash of user_id
shard = hash(user_id) % num_shards
```

**Directory-Based:**
```sql
-- Lookup table maps keys to shards
SELECT shard_id FROM shard_directory WHERE key = user_id;
```

## NoSQL Theory

### Document Stores

**Example: MongoDB**
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001"
  },
  "orders": [
    { "id": 1, "total": 100 },
    { "id": 2, "total": 200 }
  ]
}
```

**Characteristics:**
- Flexible schema
- Nested documents
- Horizontal scaling
- Eventual consistency

### Key-Value Stores

**Example: Redis**
```
SET user:1000:name "John Doe"
SET user:1000:email "john@example.com"
HSET user:1000 name "John Doe" email "john@example.com"
```

**Characteristics:**
- Simple data model
- Very fast reads/writes
- In-memory storage
- Limited query capabilities

### Column-Family Stores

**Example: Cassandra**
```
CREATE TABLE users (
    user_id uuid PRIMARY KEY,
    name text,
    email text,
    created_at timestamp
) WITH CLUSTERING ORDER BY (created_at DESC);
```

**Characteristics:**
- Wide-column storage
- Distributed architecture
- High write throughput
- Tunable consistency

### Graph Databases

**Example: Neo4j**
```cypher
CREATE (john:Person {name: 'John', age: 30})
CREATE (jane:Person {name: 'Jane', age: 28})
CREATE (john)-[:KNOWS {since: 2020}]->(jane)

MATCH (p:Person)-[:KNOWS]->(friend)
WHERE p.name = 'John'
RETURN friend.name
```

**Characteristics:**
- Nodes and relationships
- Graph traversal
- Relationship-focused
- Complex queries

## Interview Questions

**Q: Explain ACID properties with examples. 🟢 [Junior]**

A: ACID ensures reliable transactions:
- **Atomicity:** All operations succeed or all fail (bank transfer: debit and credit both happen or neither)
- **Consistency:** Database remains in valid state (account balance never negative)
- **Isolation:** Concurrent transactions don't interfere (two transfers don't see each other's intermediate states)
- **Durability:** Committed changes persist (transaction survives system crash)

**Q: What's the difference between 2NF and 3NF? 🟡 [Mid]**

A: 2NF eliminates partial dependencies (non-key attributes must depend on entire primary key), while 3NF eliminates transitive dependencies (non-key attributes must depend only on primary key, not on other non-key attributes).

**Q: How do you choose between SQL and NoSQL? 🟡 [Mid]**

A: Consider:
- **SQL:** Complex queries, ACID requirements, structured data, relationships
- **NoSQL:** Horizontal scaling, flexible schema, high throughput, eventual consistency acceptable

**Q: Explain the CAP theorem. 🟡 [Mid]**

A: CAP states you can only guarantee 2 of 3: Consistency (all nodes see same data), Availability (every request gets response), Partition Tolerance (system works despite network failures). In practice, partition tolerance is required, so you choose between CP (consistent but may be unavailable) or AP (available but may be inconsistent).

**Q: What's the difference between clustered and non-clustered indexes? 🟡 [Mid]**

A: Clustered index determines physical order of data (one per table, usually primary key). Non-clustered index is separate structure with pointers to data (multiple per table). Clustered is faster for range queries, non-clustered is better for specific lookups.

---

[← Back to Algorithms](../01-cs-fundamentals/algorithms-theory.md) | [Next: Memory Management →](../01-cs-fundamentals/os-theory.md)

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What are ACID properties in databases? / ACID properties trong database là gì? 🟢 Junior

**A:** ACID ensures database transaction reliability: **Atomicity** (all or nothing — commit or rollback), **Consistency** (transaction takes DB from one valid state to another), **Isolation** (concurrent transactions don't see each other's intermediate state), **Durability** (committed data survives crashes).

```
Bank transfer (demonstrates all ACID):
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1; ← debit
  UPDATE accounts SET balance = balance + 100 WHERE id = 2; ← credit
COMMIT;

Atomicity: if credit fails → debit also rolled back (no money disappears)
Consistency: total money in system unchanged before and after
Isolation: other transactions see either both changes or neither
Durability: after COMMIT, survives power failure (WAL log flushed to disk)
```

Vietnamese explanation: ACID vs BASE (NoSQL): Base = Basically Available, Soft state, Eventually consistent. SQL databases: ACID by default. NoSQL trade consistency for availability/performance. Isolation levels (least to most strict): Read Uncommitted, Read Committed, Repeatable Read, Serializable. PostgreSQL default: Read Committed. MySQL InnoDB default: Repeatable Read.

---

### Q: What is the difference between SQL and NoSQL databases? / SQL vs NoSQL khác nhau thế nào? 🟡 Mid

**A:** **SQL** (relational): structured schema, ACID transactions, powerful JOIN queries, vertical scaling. Best for complex relationships, financial data. **NoSQL**: flexible schema, horizontal scaling, eventual consistency, optimized for specific access patterns. Subtypes: document (MongoDB), key-value (Redis), column-family (Cassandra), graph (Neo4j).

```
SQL (PostgreSQL, MySQL):
+ ACID transactions
+ JOIN across tables
+ Mature tooling
- Schema changes costly
- Vertical scaling (mostly)

NoSQL (MongoDB, Cassandra, Redis):
+ Flexible schema
+ Horizontal scaling
+ Optimized read/write patterns
- Limited JOIN support
- Eventual consistency (usually)

Choose SQL when:           Choose NoSQL when:
Complex relationships      Simple access patterns (K/V)
Financial transactions     High write throughput
Reporting queries          Flexible schema
Team knows SQL well        Horizontal scaling needed
```

Vietnamese explanation: "Use SQL" là safe default. NoSQL khi: (1) Schema highly variable (user-generated content). (2) Extreme write scale (Cassandra: 100K writes/sec). (3) Specific data structures (Redis for caching, sorted sets). (4) Document-oriented data without complex joins (MongoDB). Nhiều production systems dùng cả hai: PostgreSQL for source of truth + Redis for caching + Elasticsearch for search.

---

## Interview Q&A Summary / Tổng Kết

| Question | Level | Key Point |
|----------|-------|-----------|
| ACID properties | 🟢 | Atomicity+Consistency+Isolation+Durability; bank transfer example |
| SQL vs NoSQL | 🟡 | SQL=ACID+joins; NoSQL=flexible+scale; use SQL by default |

---

## Self-Check / Tự Kiểm Tra

- [ ] Tôi có thể giải thích ACID và cho ví dụ khi nào mỗi property quan trọng không?
- [ ] Tôi có thể giải thích B-Tree index hoạt động như thế nào và tại sao `WHERE email = ?` nhanh hơn `WHERE LOWER(email) = ?` không?
- [ ] Tôi có thể giải thích N+1 query problem và cách dùng JOIN hoặc eager loading để fix không?
- [ ] Tôi có thể giải thích khi nào nên dùng SQL vs NoSQL không?
- [ ] Tôi có thể giải thích transaction isolation levels (Read Committed vs Repeatable Read vs Serializable) không?

💬 **Feynman Prompt:** Giải thích database index cho manager không biết kỹ thuật. Tại sao thêm index làm SELECT nhanh hơn nhưng INSERT/UPDATE chậm hơn?

---

## Connections / Liên Kết

- ⬅️ **Built on:** [Data Structures](../01-cs-fundamentals/data-structures-theory.md) — B-Tree, Hash Table là cấu trúc bên trong database engines
- ➡️ **Enables:** [Indexing & Optimization](./02-indexing-and-optimization.md) | [Sharding & Transactions](./04-sharding-and-transactions.md)
- 🔗 **Applied in:** Every backend system | ORM (GORM, Sequelize) generates SQL — you still need to understand it
