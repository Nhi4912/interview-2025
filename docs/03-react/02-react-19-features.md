# React 19 New Features
## React - Chapter 2

[← Previous: React Fundamentals](./01-react-fundamentals.md) | [Back to Table of Contents](../00-table-of-contents.md) | [Next: Hooks Deep Dive →](./03-hooks-deep-dive.md)

---

## Overview

React 19 introduces groundbreaking features that revolutionize how we build React applications, including the React Compiler, Actions, the new `use()` hook, and enhanced Server Components integration.

---

## Table of Contents
1. [React Compiler (Automatic Optimization)](#react-compiler)
2. [Actions & useActionState](#actions-useactionstate)
3. [use() Hook](#use-hook)
4. [Document Metadata](#document-metadata)
5. [useOptimistic Hook](#useoptimistic-hook)
6. [useFormStatus Hook](#useformstatus-hook)
7. [Server Components Enhancements](#server-components-enhancements)
8. [Interview Questions](#interview-questions)

---

## React Compiler

### What is React Compiler?

**Definition:** React Compiler automatically optimizes your components by memoizing expensive computations and preventing unnecessary re-renders, eliminating the need for manual `useMemo`, `useCallback`, and `React.memo`.

### Before React 19 (Manual Optimization)

```typescript
// ❌ Without compiler - manual optimization needed
function ExpensiveComponent({ items, filter }: Props) {
  // Need useMemo to prevent recalculation
  const filteredItems = useMemo(() => {
    return items
      .filter(item => item.category === filter)
      .map(item => ({
        ...item,
        displayName: item.name.toUpperCase()
      }));
  }, [items, filter]);

  // Need useCallback to prevent function recreation
  const handleClick = useCallback((id: string) => {
    console.log('Clicked:', id);
  }, []);

  return (
    <div>
      {filteredItems.map(item => (
        <ItemCard 
          key={item.id} 
          item={item} 
          onClick={handleClick}
        />
      ))}
    </div>
  );
}

// Need React.memo to prevent unnecessary re-renders
const ItemCard = React.memo(({ item, onClick }: ItemCardProps) => {
  return (
    <div onClick={() => onClick(item.id)}>
      {item.displayName}
    </div>
  );
});
```

### With React 19 Compiler (Automatic)

```typescript
// ✅ With compiler - automatic optimization!
function ExpensiveComponent({ items, filter }: Props) {
  // Compiler automatically memoizes this
  const filteredItems = items
    .filter(item => item.category === filter)
    .map(item => ({
      ...item,
      displayName: item.name.toUpperCase()
    }));

  // Compiler automatically stabilizes this function
  const handleClick = (id: string) => {
    console.log('Clicked:', id);
  };

  return (
    <div>
      {filteredItems.map(item => (
        <ItemCard 
          key={item.id} 
          item={item} 
          onClick={handleClick}
        />
      ))}
    </div>
  );
}

// No need for React.memo - compiler handles it
function ItemCard({ item, onClick }: ItemCardProps) {
  return (
    <div onClick={() => onClick(item.id)}>
      {item.displayName}
    </div>
  );
}
```

### Compiler Configuration

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
};

module.exports = nextConfig;
```

### When Compiler Can't Optimize

```typescript
// ⚠️ Compiler can't optimize side effects in render
function ProblematicComponent({ data }: Props) {
  // ❌ Side effect in render - compiler can't optimize
  localStorage.setItem('data', JSON.stringify(data));
  
  return <div>{data.name}</div>;
}

// ✅ Move side effects to useEffect
function OptimizedComponent({ data }: Props) {
  useEffect(() => {
    localStorage.setItem('data', JSON.stringify(data));
  }, [data]);
  
  return <div>{data.name}</div>;
}
```

---

## Actions & useActionState

### What are Actions?

**Definition:** Actions are async functions that handle form submissions and data mutations with built-in pending states, error handling, and optimistic updates.

### Basic Action Example

```typescript
'use client';

import { useActionState } from 'react';

interface FormState {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
  };
}

async function submitForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  // Validation
  const errors: FormState['errors'] = {};
  
  if (!name || name.length < 2) {
    errors.name = ['Name must be at least 2 characters'];
  }
  
  if (!email || !email.includes('@')) {
    errors.email = ['Invalid email address'];
  }

  if (Object.keys(errors).length > 0) {
    return { message: 'Validation failed', errors };
  }

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit');
    }

    return { message: 'Form submitted successfully!' };
  } catch (error) {
    return { 
      message: 'Failed to submit form. Please try again.',
      errors: { name: ['Server error'] }
    };
  }
}

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitForm,
    { message: '' }
  );

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="name">Name</label>
        <input 
          id="name" 
          name="name" 
          type="text" 
          required 
          disabled={isPending}
        />
        {state.errors?.name && (
          <p className="error">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          required 
          disabled={isPending}
        />
        {state.errors?.email && (
          <p className="error">{state.errors.email[0]}</p>
        )}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit'}
      </button>

      {state.message && (
        <p className={state.errors ? 'error' : 'success'}>
          {state.message}
        </p>
      )}
    </form>
  );
}
```

### Server Actions (Next.js)

```typescript
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  // Validation
  if (!title || title.length < 3) {
    return { error: 'Title must be at least 3 characters' };
  }

  // Save to database
  const post = await db.post.create({
    data: { title, content, published: true }
  });

  // Revalidate the posts page cache
  revalidatePath('/posts');
  
  // Redirect to the new post
  redirect(`/posts/${post.id}`);
}

// app/posts/new/page.tsx
import { createPost } from '@/app/actions';

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="Post title" required />
      <textarea name="content" placeholder="Post content" required />
      <button type="submit">Create Post</button>
    </form>
  );
}
```

### Progressive Enhancement

```typescript
// Works without JavaScript!
export function TodoForm() {
  async function addTodo(formData: FormData) {
    'use server';
    
    const text = formData.get('text') as string;
    await db.todo.create({ data: { text } });
    revalidatePath('/todos');
  }

  return (
    <form action={addTodo}>
      <input name="text" placeholder="Add todo" required />
      <button type="submit">Add</button>
    </form>
  );
}
```

---

## use() Hook

### What is use()?

**Definition:** The `use()` hook allows you to read the value of a Promise or Context directly in your component, with automatic Suspense integration.

### Reading Promises

```typescript
import { use, Suspense } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

// Promise-based data fetching
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
}

function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  // use() suspends until promise resolves
  const user = use(userPromise);
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

export default function UserPage({ params }: { params: { id: string } }) {
  const userPromise = fetchUser(params.id);
  
  return (
    <Suspense fallback={<div>Loading user...</div>}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}
```

### Conditional use() Hook

```typescript
// ✅ use() can be called conditionally!
function UserOrGuest({ userPromise }: { userPromise: Promise<User> | null }) {
  if (!userPromise) {
    return <div>Guest User</div>;
  }
  
  // This is allowed with use()!
  const user = use(userPromise);
  
  return <div>Welcome, {user.name}!</div>;
}

// ❌ Other hooks can't be conditional
function BadExample({ shouldFetch }: { shouldFetch: boolean }) {
  // This would be an error!
  // if (shouldFetch) {
  //   const data = useQuery(...);
  // }
}
```

### Reading Context with use()

```typescript
import { createContext, use } from 'react';

const ThemeContext = createContext<'light' | 'dark'>('light');

function ThemedButton() {
  // Alternative to useContext
  const theme = use(ThemeContext);
  
  return (
    <button className={`btn-${theme}`}>
      Themed Button
    </button>
  );
}

// Can be used conditionally
function ConditionalTheme({ useTheme }: { useTheme: boolean }) {
  if (!useTheme) {
    return <button>Default Button</button>;
  }
  
  const theme = use(ThemeContext);
  return <button className={`btn-${theme}`}>Themed Button</button>;
}
```

### Streaming Data with use()

```typescript
async function* streamMessages() {
  const messages = ['Hello', 'World', 'from', 'React', '19'];
  
  for (const message of messages) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    yield message;
  }
}

function StreamingMessages() {
  const messageStream = streamMessages();
  
  return (
    <Suspense fallback={<div>Loading messages...</div>}>
      <MessageList stream={messageStream} />
    </Suspense>
  );
}

function MessageList({ stream }: { stream: AsyncGenerator<string> }) {
  const messages: string[] = [];
  
  for (const message of use(stream)) {
    messages.push(message);
  }
  
  return (
    <ul>
      {messages.map((msg, i) => (
        <li key={i}>{msg}</li>
      ))}
    </ul>
  );
}
```

---

## Document Metadata

### Built-in Metadata Support

```typescript
// No need for react-helmet or next/head!
function BlogPost({ post }: { post: Post }) {
  return (
    <>
      {/* These are hoisted to <head> automatically */}
      <title>{post.title} | My Blog</title>
      <meta name="description" content={post.excerpt} />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.excerpt} />
      <meta property="og:image" content={post.coverImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={`https://myblog.com/posts/${post.slug}`} />
      
      <article>
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </>
  );
}
```

### Dynamic Metadata

```typescript
function ProductPage({ product }: { product: Product }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <title>{product.name} - Buy Now</title>
      <meta name="description" content={product.description} />
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div>
        <h1>{product.name}</h1>
        <p>${product.price}</p>
      </div>
    </>
  );
}
```

---

## useOptimistic Hook

### Optimistic UI Updates

```typescript
'use client';

import { useOptimistic } from 'react';
import { addTodo } from './actions';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: string) => [
      ...state,
      { id: 'temp-' + Date.now(), text: newTodo, completed: false }
    ]
  );

  async function handleSubmit(formData: FormData) {
    const text = formData.get('text') as string;
    
    // Immediately show the new todo (optimistic update)
    addOptimisticTodo(text);
    
    // Actually save to server
    await addTodo(text);
  }

  return (
    <div>
      <form action={handleSubmit}>
        <input name="text" placeholder="Add todo" required />
        <button type="submit">Add</button>
      </form>

      <ul>
        {optimisticTodos.map(todo => (
          <li 
            key={todo.id}
            style={{ opacity: todo.id.startsWith('temp-') ? 0.5 : 1 }}
          >
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Like Button with Optimistic Update

```typescript
'use client';

import { useOptimistic } from 'react';

interface Post {
  id: string;
  likes: number;
  isLiked: boolean;
}

export function LikeButton({ post }: { post: Post }) {
  const [optimisticPost, setOptimisticPost] = useOptimistic(
    post,
    (state, isLiked: boolean) => ({
      ...state,
      likes: state.likes + (isLiked ? 1 : -1),
      isLiked
    })
  );

  async function handleLike() {
    const newLikedState = !optimisticPost.isLiked;
    
    // Optimistic update
    setOptimisticPost(newLikedState);
    
    // Server update
    await fetch(`/api/posts/${post.id}/like`, {
      method: 'POST',
      body: JSON.stringify({ liked: newLikedState })
    });
  }

  return (
    <button onClick={handleLike}>
      {optimisticPost.isLiked ? '❤️' : '🤍'} {optimisticPost.likes}
    </button>
  );
}
```

---

## useFormStatus Hook

### Form Submission Status

```typescript
'use client';

import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

export function ContactForm() {
  async function handleSubmit(formData: FormData) {
    'use server';
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Form submitted:', Object.fromEntries(formData));
  }

  return (
    <form action={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <SubmitButton />
    </form>
  );
}
```

### Multiple Submit Buttons

```typescript
function FormWithMultipleActions() {
  const { pending, data } = useFormStatus();
  const submittedAction = data?.get('action');

  return (
    <form action={handleForm}>
      <input name="title" placeholder="Title" />
      
      <button 
        name="action" 
        value="draft"
        disabled={pending}
      >
        {pending && submittedAction === 'draft' ? 'Saving...' : 'Save Draft'}
      </button>
      
      <button 
        name="action" 
        value="publish"
        disabled={pending}
      >
        {pending && submittedAction === 'publish' ? 'Publishing...' : 'Publish'}
      </button>
    </form>
  );
}
```

---

## Server Components Enhancements

### Async Server Components

```typescript
// app/posts/page.tsx
async function getPosts() {
  const response = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // ISR - revalidate every hour
  });
  return response.json();
}

// Server Component - async by default!
export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map((post: Post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

### Parallel Data Fetching

```typescript
async function getUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}

async function getPosts(userId: string) {
  const res = await fetch(`/api/users/${userId}/posts`);
  return res.json();
}

export default async function UserPage({ params }: { params: { id: string } }) {
  // Fetch in parallel
  const [user, posts] = await Promise.all([
    getUser(params.id),
    getPosts(params.id)
  ]);

  return (
    <div>
      <h1>{user.name}</h1>
      <PostList posts={posts} />
    </div>
  );
}
```

---

## Interview Questions

### Q1: What is the React Compiler and how does it improve performance?

**Answer:**
The React Compiler automatically optimizes components by:
- Memoizing expensive computations
- Stabilizing function references
- Preventing unnecessary re-renders
- Eliminating need for manual `useMemo`, `useCallback`, `React.memo`

### Q2: How do Actions differ from traditional form handling?

**Answer:**
Actions provide:
- Built-in pending states
- Automatic error handling
- Progressive enhancement (works without JS)
- Optimistic updates support
- Server-side execution with Server Actions

### Q3: When should you use the use() hook vs useEffect?

**Answer:**
- `use()`: For reading Promises/Context, can be conditional, suspends component
- `useEffect()`: For side effects, subscriptions, can't be conditional, doesn't suspend

### Q4: What are the benefits of useOptimistic?

**Answer:**
- Immediate UI feedback
- Better user experience
- Automatic rollback on error
- Simplified optimistic update logic

---

## Summary

React 19 introduces:
- **React Compiler**: Automatic optimization
- **Actions**: Better form handling
- **use() Hook**: Flexible Promise/Context reading
- **Document Metadata**: Built-in head management
- **useOptimistic**: Easy optimistic updates
- **useFormStatus**: Form submission states
- **Enhanced Server Components**: Better async support

---

[← Previous: React Fundamentals](./01-react-fundamentals.md) | [Back to Table of Contents](../00-table-of-contents.md) | [Next: Hooks Deep Dive →](./03-hooks-deep-dive.md)
