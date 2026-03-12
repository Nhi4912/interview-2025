# Data Fetching - Server & Client Patterns

> Data fetching trong Next.js App Router khác biệt hoàn toàn với Pages Router. Hiểu patterns để optimize performance.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA FETCHING PATTERNS                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   SERVER SIDE                       CLIENT SIDE                  │
│   ┌─────────────────────┐          ┌─────────────────────┐      │
│   │ • Server Components │          │ • Client Components │      │
│   │ • Route Handlers    │          │ • React Query       │      │
│   │ • Server Actions    │          │ • SWR               │      │
│   │ • Direct DB access  │          │ • fetch + useEffect │      │
│   └─────────────────────┘          └─────────────────────┘      │
│                                                                   │
│   Prefer Server:                   Use Client when:              │
│   • Initial page load              • Real-time updates           │
│   • SEO-critical data              • User interactions           │
│   • Sensitive operations           • Optimistic UI               │
│   • Large data processing          • Polling/WebSockets          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🖥️ Server-Side Data Fetching

### async Server Components

```typescript
// app/users/page.tsx - Server Component (default)

async function UsersPage() {
    // Fetch directly in component - no useEffect needed!
    const users = await fetch('https://api.example.com/users').then(r => r.json());

    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
}

export default UsersPage;
```

### Caching Strategies

```typescript
// Default - cache forever (SSG behavior)
const data = await fetch('https://api.example.com/data');
// Equivalent to:
const data = await fetch('https://api.example.com/data', {
    cache: 'force-cache'
});

// No caching - always fresh (SSR behavior)
const data = await fetch('https://api.example.com/data', {
    cache: 'no-store'
});

// Revalidate after time (ISR behavior)
const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 } // 1 hour
});

// Tag-based caching
const data = await fetch('https://api.example.com/products', {
    next: { tags: ['products'] }
});
```

### Direct Database Access

```typescript
// app/posts/page.tsx
import { db } from '@/lib/db';

async function PostsPage() {
    // Direct database query - no API needed!
    const posts = await db.post.findMany({
        include: { author: true },
        orderBy: { createdAt: 'desc' },
        take: 10
    });

    return (
        <div>
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}

// Data never leaves the server
// Secrets are safe
// No network round-trip
```

### Parallel Data Fetching

```typescript
// ✅ Parallel - Start all fetches at once
async function Dashboard() {
    const [user, orders, analytics] = await Promise.all([
        getUser(),
        getOrders(),
        getAnalytics()
    ]);

    return <DashboardView {...{ user, orders, analytics }} />;
}

// ❌ Sequential - Each waits for previous
async function Dashboard() {
    const user = await getUser();       // 100ms
    const orders = await getOrders();   // 200ms
    const analytics = await getAnalytics(); // 150ms
    // Total: 450ms

    return <DashboardView {...{ user, orders, analytics }} />;
}

// With Promise.all: ~200ms (longest request)
```

### Preloading Data

```typescript
// lib/data.ts
import { cache } from 'react';

// Create cached version of data function
export const getUser = cache(async (id: string) => {
    const res = await fetch(`/api/users/${id}`);
    return res.json();
});

// Preload function
export const preloadUser = (id: string) => {
    void getUser(id);
};

// app/user/[id]/page.tsx
import { getUser, preloadUser } from '@/lib/data';

export default async function UserPage({ params }) {
    // Start fetching early
    preloadUser(params.id);

    // Do other work...

    // Data might already be cached
    const user = await getUser(params.id);

    return <UserProfile user={user} />;
}
```

---

## 🌐 Client-Side Data Fetching

### SWR Pattern

```typescript
'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function UserProfile({ userId }) {
    const { data, error, isLoading, mutate } = useSWR(
        `/api/users/${userId}`,
        fetcher,
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            refreshInterval: 30000, // Poll every 30s
        }
    );

    if (isLoading) return <Skeleton />;
    if (error) return <Error message={error.message} />;

    return (
        <div>
            <h1>{data.name}</h1>
            <button onClick={() => mutate()}>Refresh</button>
        </div>
    );
}
```

### React Query / TanStack Query

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function ProductList() {
    const queryClient = useQueryClient();

    // Fetch data
    const { data, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: () => fetch('/api/products').then(r => r.json()),
        staleTime: 60000, // Consider fresh for 1 minute
        cacheTime: 300000, // Keep in cache for 5 minutes
    });

    // Mutation with optimistic update
    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            fetch(`/api/products/${id}`, { method: 'DELETE' }),

        onMutate: async (id) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['products'] });

            // Snapshot previous value
            const previous = queryClient.getQueryData(['products']);

            // Optimistically remove from cache
            queryClient.setQueryData(['products'], (old: any[]) =>
                old.filter(p => p.id !== id)
            );

            return { previous };
        },

        onError: (err, id, context) => {
            // Rollback on error
            queryClient.setQueryData(['products'], context?.previous);
        },

        onSettled: () => {
            // Refetch after mutation
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    if (isLoading) return <Loading />;
    if (error) return <Error />;

    return (
        <ul>
            {data.map(product => (
                <li key={product.id}>
                    {product.name}
                    <button onClick={() => deleteMutation.mutate(product.id)}>
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    );
}
```

### useEffect Fetch (Basic)

```typescript
'use client';

import { useState, useEffect } from 'react';

function SearchResults({ query }) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!query) return;

        const controller = new AbortController();

        async function fetchResults() {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`/api/search?q=${query}`, {
                    signal: controller.signal
                });

                if (!res.ok) throw new Error('Search failed');

                const data = await res.json();
                setResults(data);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchResults();

        // Cleanup - cancel request on unmount or query change
        return () => controller.abort();
    }, [query]);

    if (loading) return <Spinner />;
    if (error) return <Error message={error} />;

    return <ResultsList results={results} />;
}
```

---

## ⚡ Server Actions

### Form Submission

```typescript
// app/contact/page.tsx
async function ContactPage() {
    async function submitForm(formData: FormData) {
        'use server';

        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const message = formData.get('message') as string;

        // Validate
        if (!name || !email || !message) {
            return { error: 'All fields required' };
        }

        // Save to database
        await db.contact.create({
            data: { name, email, message }
        });

        // Revalidate if needed
        revalidatePath('/contacts');

        return { success: true };
    }

    return (
        <form action={submitForm}>
            <input name="name" placeholder="Name" required />
            <input name="email" type="email" placeholder="Email" required />
            <textarea name="message" placeholder="Message" required />
            <button type="submit">Send</button>
        </form>
    );
}
```

### With Client-Side State

```typescript
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitContact } from './actions';

const initialState = { message: '', success: false };

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button type="submit" disabled={pending}>
            {pending ? 'Sending...' : 'Send Message'}
        </button>
    );
}

export function ContactForm() {
    const [state, formAction] = useFormState(submitContact, initialState);

    return (
        <form action={formAction}>
            <input name="name" placeholder="Name" required />
            <input name="email" type="email" placeholder="Email" required />
            <textarea name="message" placeholder="Message" required />

            {state.message && (
                <p className={state.success ? 'success' : 'error'}>
                    {state.message}
                </p>
            )}

            <SubmitButton />
        </form>
    );
}
```

```typescript
// app/contact/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function submitContact(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    try {
        await db.contact.create({
            data: { name, email, message }
        });

        revalidatePath('/contacts');

        return { message: 'Message sent successfully!', success: true };
    } catch (error) {
        return { message: 'Failed to send message', success: false };
    }
}
```

### Mutations with Server Actions

```typescript
// actions.ts
'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    const post = await db.post.create({
        data: { title, content }
    });

    revalidateTag('posts');
    redirect(`/posts/${post.id}`);
}

export async function deletePost(id: string) {
    await db.post.delete({ where: { id } });

    revalidatePath('/posts');
    redirect('/posts');
}

export async function likePost(id: string) {
    await db.post.update({
        where: { id },
        data: { likes: { increment: 1 } }
    });

    revalidateTag(`post-${id}`);
}
```

---

## 🔄 Route Handlers (API Routes)

### Basic API Route

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const users = await db.user.findMany();
    return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    const user = await db.user.create({
        data: body
    });

    return NextResponse.json(user, { status: 201 });
}
```

### Dynamic Route Handler

```typescript
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const user = await db.user.findUnique({
        where: { id: params.id }
    });

    if (!user) {
        return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
        );
    }

    return NextResponse.json(user);
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const body = await request.json();

    const user = await db.user.update({
        where: { id: params.id },
        data: body
    });

    return NextResponse.json(user);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    await db.user.delete({
        where: { id: params.id }
    });

    return new Response(null, { status: 204 });
}
```

### Route Handler with Streaming

```typescript
// app/api/stream/route.ts
export async function GET() {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            for (let i = 0; i < 10; i++) {
                const data = `data: Message ${i}\n\n`;
                controller.enqueue(encoder.encode(data));
                await new Promise(r => setTimeout(r, 1000));
            }
            controller.close();
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        }
    });
}
```

---

## 📊 Patterns Comparison

| Pattern | Use Case | Pros | Cons |
|---------|----------|------|------|
| Server Component | Initial load | SEO, performance | No interactivity |
| Server Action | Mutations | Simple, progressive | Limited to forms |
| Route Handler | API endpoints | Full control | More setup |
| SWR/React Query | Client data | Caching, revalidation | Bundle size |
| useEffect | Simple fetch | No deps | No caching |

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: Server Component vs Client Component fetching?**

A:
- Server: async/await directly in component, runs on server
- Client: useEffect or data fetching library, runs in browser

**Q: Tại sao dùng Server Actions thay vì API route?**

A: Server Actions simpler, integrated với forms, progressive enhancement (works without JS). API routes cho complex APIs, webhooks, external access.

### 🟡 Mid-level

**Q: Explain fetch caching trong Next.js App Router**

A: fetch() được extended với caching:
- `cache: 'force-cache'` (default): Cache forever
- `cache: 'no-store'`: No caching
- `next: { revalidate: N }`: Cache for N seconds
- `next: { tags: ['x'] }`: Tag-based invalidation

**Q: When to use SWR vs React Query?**

A:
- SWR: Simpler API, smaller bundle, good for basic use cases
- React Query: More features (mutations, infinite queries, devtools), better for complex apps

### 🔴 Senior

**Q: Design data fetching architecture cho large app**

A:
1. Server Components cho initial data + SEO
2. React Query cho client-side với caching
3. Server Actions cho mutations
4. Optimistic updates cho UX
5. Error boundaries cho graceful degradation
6. Parallel fetching với Promise.all
7. Preloading cho anticipated navigation

---

## 📚 Active Recall

1. [ ] 3 caching options với fetch()
2. [ ] Server Action syntax
3. [ ] Parallel vs Sequential fetching
4. [ ] Route Handler dynamic params
5. [ ] SWR vs React Query differences

---

> **Tiếp theo:** [05-routing-layouts.md](./05-routing-layouts.md) - Routing & Layouts
