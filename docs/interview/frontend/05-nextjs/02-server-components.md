# React Server Components - RSC Deep Dive

> Server Components là paradigm shift trong React. Hiểu khi nào dùng Server vs Client là key skill.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│              SERVER vs CLIENT COMPONENTS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   SERVER COMPONENTS (default)     CLIENT COMPONENTS              │
│   ┌─────────────────────┐        ┌─────────────────────┐        │
│   │ • Run on server only│        │ • Run on client     │        │
│   │ • No JS sent to client│      │ • JS sent to client │        │
│   │ • Can access backend │        │ • Can use hooks     │        │
│   │ • async/await direct │        │ • Event handlers    │        │
│   │ • No useState/useEffect│      │ • Browser APIs     │        │
│   │ • Secrets safe       │        │ • Interactivity    │        │
│   └─────────────────────┘        └─────────────────────┘        │
│                                                                   │
│   Default: Server Component                                      │
│   Add 'use client' at top to make Client Component              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🖥️ Server Components

### Basic Server Component

```typescript
// app/users/page.tsx - Server Component by default
// NO 'use client' directive

async function UsersPage() {
    // Direct database access!
    const users = await db.users.findMany();

    // Direct file system access!
    const config = await fs.readFile('./config.json', 'utf-8');

    // Secrets are safe - never sent to client
    const apiKey = process.env.SECRET_API_KEY;

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default UsersPage;
```

### Benefits

```typescript
// 1. Zero client-side JavaScript for this component
async function ProductList() {
    const products = await fetchProducts();
    return (
        <ul>
            {products.map(p => <li key={p.id}>{p.name}</li>)}
        </ul>
    );
}

// 2. Direct backend access
async function Dashboard() {
    const [users, orders, analytics] = await Promise.all([
        db.users.count(),
        db.orders.findMany({ take: 10 }),
        fetch('https://analytics.api/stats').then(r => r.json())
    ]);

    return <DashboardView data={{ users, orders, analytics }} />;
}

// 3. Secrets stay on server
async function PaymentForm() {
    const stripeKey = process.env.STRIPE_SECRET_KEY; // Never exposed!
    const session = await stripe.checkout.sessions.create({...});
    return <CheckoutForm sessionId={session.id} />;
}
```

---

## 🌐 Client Components

### When to Use Client Components

```typescript
'use client';

import { useState, useEffect } from 'react';

// Need: useState, useEffect
function Counter() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// Need: Event handlers
function SearchBox() {
    const [query, setQuery] = useState('');
    return (
        <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
    );
}

// Need: Browser APIs
function LocationDisplay() {
    const [location, setLocation] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => setLocation(pos.coords)
        );
    }, []);

    return <div>Lat: {location?.latitude}</div>;
}

// Need: Third-party client libraries
import { motion } from 'framer-motion';

function AnimatedCard({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {children}
        </motion.div>
    );
}
```

### Feature Comparison

| Feature | Server Component | Client Component |
|---------|-----------------|------------------|
| async/await in component | ✅ | ❌ |
| Access backend resources | ✅ | ❌ |
| Keep secrets safe | ✅ | ❌ |
| useState, useEffect | ❌ | ✅ |
| Event handlers | ❌ | ✅ |
| Browser APIs | ❌ | ✅ |
| Custom hooks with state | ❌ | ✅ |
| Reduce bundle size | ✅ | ❌ |

---

## 🔀 Composition Patterns

### Server → Client

```typescript
// ✅ Server Components can import Client Components

// app/page.tsx (Server)
import ClientCounter from './Counter'; // Client Component

async function Page() {
    const data = await fetchData();

    return (
        <div>
            <h1>Server rendered: {data.title}</h1>
            <ClientCounter /> {/* Interactive part */}
        </div>
    );
}
```

### Passing Server Data to Client

```typescript
// ✅ Pass serializable props from Server to Client

// app/page.tsx (Server)
async function Page() {
    const user = await getUser();

    return (
        <div>
            <UserProfile user={user} /> {/* Client Component */}
        </div>
    );
}

// components/UserProfile.tsx (Client)
'use client';

export function UserProfile({ user }) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div>
            <h1>{user.name}</h1>
            <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
    );
}
```

### Children Pattern

```typescript
// ✅ Pass Server Components as children to Client Components

// components/ClientWrapper.tsx
'use client';

export function ClientWrapper({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
            {isOpen && children}
        </div>
    );
}

// app/page.tsx (Server)
async function Page() {
    const data = await fetchData(); // Server-side fetch

    return (
        <ClientWrapper>
            {/* ServerContent is NOT converted to Client Component */}
            <ServerContent data={data} />
        </ClientWrapper>
    );
}
```

### ❌ Anti-patterns

```typescript
// ❌ Can't import Server Component into Client Component
'use client';

import ServerComponent from './ServerComponent'; // Error!

function ClientComponent() {
    return <ServerComponent />;
}

// ❌ Can't use hooks in Server Components
async function ServerComponent() {
    const [state, setState] = useState(); // Error!
    return <div />;
}

// ❌ Can't pass non-serializable props
<ClientComponent
    onClick={() => console.log('hi')} // Functions OK
    data={new Map()} // ❌ Non-serializable
/>
```

---

## 📊 Data Fetching

### Server Component Fetching

```typescript
// Direct async/await - no useEffect needed!
async function ProductPage({ params }) {
    const product = await fetch(`/api/products/${params.id}`).then(r => r.json());

    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
        </div>
    );
}

// Parallel fetching
async function Dashboard() {
    // These run in parallel!
    const [users, posts, analytics] = await Promise.all([
        fetchUsers(),
        fetchPosts(),
        fetchAnalytics()
    ]);

    return (
        <div>
            <UserStats data={users} />
            <PostList posts={posts} />
            <AnalyticsChart data={analytics} />
        </div>
    );
}
```

### Sequential vs Parallel

```typescript
// ❌ Sequential (slow)
async function Page() {
    const user = await fetchUser();      // Wait...
    const posts = await fetchPosts();    // Then wait...
    const comments = await fetchComments(); // Then wait...
}

// ✅ Parallel (fast)
async function Page() {
    const [user, posts, comments] = await Promise.all([
        fetchUser(),
        fetchPosts(),
        fetchComments()
    ]);
}

// ✅ Or use Suspense for streaming
async function Page() {
    const user = await fetchUser(); // Critical data first

    return (
        <div>
            <UserHeader user={user} />
            <Suspense fallback={<PostsSkeleton />}>
                <Posts /> {/* Streams in when ready */}
            </Suspense>
        </div>
    );
}
```

---

## ⏳ Streaming & Suspense

### Loading States

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';

async function DashboardPage() {
    return (
        <div>
            <h1>Dashboard</h1>

            {/* Each section streams independently */}
            <Suspense fallback={<StatsSkeleton />}>
                <Stats />
            </Suspense>

            <Suspense fallback={<ChartSkeleton />}>
                <RevenueChart />
            </Suspense>

            <Suspense fallback={<TableSkeleton />}>
                <RecentOrders />
            </Suspense>
        </div>
    );
}

// Each component fetches its own data
async function Stats() {
    const stats = await fetchStats(); // Slow API
    return <StatsDisplay data={stats} />;
}

async function RevenueChart() {
    const revenue = await fetchRevenue(); // Very slow API
    return <Chart data={revenue} />;
}
```

### Nested Suspense

```typescript
async function UserProfile({ userId }) {
    const user = await fetchUser(userId);

    return (
        <div>
            <h1>{user.name}</h1>

            <Suspense fallback={<p>Loading posts...</p>}>
                <UserPosts userId={userId} />

                <Suspense fallback={<p>Loading comments...</p>}>
                    <UserComments userId={userId} />
                </Suspense>
            </Suspense>
        </div>
    );
}
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: Server Component là gì?**

A: Component chạy trên server only. Có thể async/await, access database, giữ secrets. Không gửi JS to client.

**Q: Khi nào dùng 'use client'?**

A: Khi cần: useState, useEffect, event handlers, browser APIs, third-party client libraries.

### 🟡 Mid-level

**Q: Làm sao pass data từ Server to Client Component?**

A: Pass as serializable props. Functions không serialize được nhưng React handles event handlers specially.

**Q: Tại sao không thể import Server Component trong Client Component?**

A: Client Component chạy on client, Server Component cần server environment. Use children pattern instead.

### 🔴 Senior

**Q: Giải thích streaming với Suspense**

A: Suspense boundaries cho phép stream HTML incrementally. Critical content first, secondary content streams in khi ready. Better perceived performance.

---

## 📚 Active Recall

1. [ ] List 5 things only Server Components can do
2. [ ] List 5 things only Client Components can do
3. [ ] Children pattern cho composition
4. [ ] Parallel vs sequential data fetching
5. [ ] Nested Suspense boundaries

---

> **Tiếp theo:** [03-rendering-strategies.md](./03-rendering-strategies.md) - SSR, SSG, ISR
