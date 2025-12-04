"use client";

import { Diagram } from "@/components/mdx/Diagram";

export default function TestDiagramPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem" }}>Diagram Component Test Page</h1>

      <section style={{ marginBottom: "3rem" }}>
        <h2>1. Simple Flowchart</h2>
        <Diagram title="Basic Flowchart Example">
          {`graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]`}
        </Diagram>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2>2. Sequence Diagram</h2>
        <Diagram
          title="User Authentication Flow"
          caption="Figure 1: Typical authentication sequence"
        >
          {`sequenceDiagram
    participant User
    participant Client
    participant Server
    participant Database
    
    User->>Client: Enter credentials
    Client->>Server: POST /login
    Server->>Database: Verify credentials
    Database-->>Server: User data
    Server-->>Client: JWT token
    Client-->>User: Login successful`}
        </Diagram>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2>3. Architecture Diagram</h2>
        <Diagram title="System Architecture">
          {`graph LR
    subgraph "Frontend"
        A[React App]
        B[Next.js]
    end
    
    subgraph "Backend"
        C[API Gateway]
        D[Microservices]
        E[Database]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E`}
        </Diagram>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2>4. Class Diagram</h2>
        <Diagram title="Object-Oriented Design">
          {`classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    
    class Dog {
        +String breed
        +bark()
    }
    
    class Cat {
        +String color
        +meow()
    }
    
    Animal <|-- Dog
    Animal <|-- Cat`}
        </Diagram>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2>5. State Diagram</h2>
        <Diagram title="Order Processing States">
          {`stateDiagram-v2
    [*] --> Pending
    Pending --> Processing: Payment Confirmed
    Processing --> Shipped: Items Packed
    Shipped --> Delivered: Received
    Delivered --> [*]
    
    Processing --> Cancelled: Payment Failed
    Pending --> Cancelled: User Cancelled
    Cancelled --> [*]`}
        </Diagram>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2>6. Error Handling Test</h2>
        <Diagram title="Invalid Diagram Syntax">
          {`this is not valid mermaid syntax
    it should show an error`}
        </Diagram>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2>7. Git Flow Diagram</h2>
        <Diagram
          title="Git Branching Strategy"
          caption="Figure 2: Feature branch workflow"
        >
          {`gitGraph
    commit
    branch develop
    checkout develop
    commit
    branch feature
    checkout feature
    commit
    commit
    checkout develop
    merge feature
    checkout main
    merge develop
    commit`}
        </Diagram>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2>8. Entity Relationship Diagram</h2>
        <Diagram title="Database Schema">
          {`erDiagram
    USER ||--o{ ORDER : places
    USER {
        string id
        string name
        string email
    }
    ORDER ||--|{ ORDER_ITEM : contains
    ORDER {
        string id
        date orderDate
        string status
    }
    PRODUCT ||--o{ ORDER_ITEM : "ordered in"
    PRODUCT {
        string id
        string name
        decimal price
    }
    ORDER_ITEM {
        int quantity
        decimal price
    }`}
        </Diagram>
      </section>
    </div>
  );
}
