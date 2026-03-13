# Modern React Features (18-19) - Theory / Tính Năng React Hiện Đại - Lý Thuyết

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Table of Contents / Mục Lục

1. [React 18 Features](#react-18-features)
2. [Concurrent Rendering](#concurrent-rendering)
3. [Server Components](#server-components)
4. [React 19 Features](#react-19-features)
5. [Compiler and Optimization](#compiler-and-optimization)
6. [Best Practices](#best-practices)
7. [Interview Questions](#interview-questions)

---

## React 18 Features / Tính Năng React 18

### Concurrent Rendering / Render Đồng Thời

**English:** React 18 introduces concurrent rendering, allowing React to work on multiple state updates simultaneously and interrupt rendering work.

**Tiếng Việt:** React 18 giới thiệu render đồng thời, cho phép React làm việc trên nhiều cập nhật state đồng thời và ngắt công việc render.

#### Concurrency Theory / Lý Thuyết Đồng Thời

**Traditional Rendering (React 17):**
- Synchronous rendering
- Blocking updates
- All-or-nothing
- Cannot interrupt
- UI freezes during updates

**Concurrent Rendering (React 18):**
- Interruptible rendering
- Prioritized updates
- Time-slicing
- Can pause and resume
- Responsive UI

**Key Concepts:**

**1. Interruptibility / Khả Năng Ngắt**
- React can pause rendering
- Handle urgent updates
- Resume later
- Better responsiveness

**2. Priority-Based Updates / Cập Nhật Dựa Trên Ưu Tiên**
- Urgent updates (user input)
- Normal updates (data fetching)
- Low priority updates (analytics)
- Automatic prioritization

**3. Time Slicing / Phân Chia Thời Gian**
- Break work into chunks
- Yield to browser
- Maintain 60fps
- Smooth animations

### Automatic Batching / Gộp Tự Động

**English:** React 18 automatically batches all state updates, not just in event handlers.

**Tiếng Việt:** React 18 tự động gộp tất cả cập nhật state, không chỉ trong event handlers.

**React 17 Behavior:**
```javascript
// Batched (in event handler)
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // One render
}

// Not batched (in async)
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // Two renders
}, 1000);
```

**React 18 Behavior:**
```javascript
// Always batched
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // One render
}, 1000);

fetch('/api').then(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // One render
});
```

**Benefits:**
- Fewer renders
- Better performance
- Consistent behavior
- Simpler mental model

**Opt-out:**
```javascript
import { flushSync } from 'react-dom';

flushSync(() => {
  setCount(c => c + 1);
});
// Renders immediately

flushSync(() => {
  setFlag(f => !f);
});
// Renders immediately
```

### Transitions / Chuyển Đổi

**English:** Mark updates as non-urgent to keep UI responsive.

**Tiếng Việt:** Đánh dấu cập nhật là không khẩn cấp để giữ UI phản hồi.

**useTransition Hook:**
```javascript
const [isPending, startTransition] = useTransition();

function handleChange(e) {
  // Urgent: Update input
  setInput(e.target.value);
  
  // Non-urgent: Filter results
  startTransition(() => {
    setFilteredResults(filter(e.target.value));
  });
}
```

**Behavior:**
- Urgent updates render immediately
- Transition updates can be interrupted
- Shows pending state
- Keeps UI responsive

**useDeferredValue:**
```javascript
const deferredValue = useDeferredValue(value);

// Use deferredValue for expensive renders
<ExpensiveComponent value={deferredValue} />
```

**Comparison:**
- **useTransition**: Control when update happens
- **useDeferredValue**: Defer value itself
- Both enable concurrent features

**Use Cases:**
- Search filtering
- Tab switching
- Route transitions
- Large list updates

### Suspense Improvements / Cải Tiến Suspense

**English:** React 18 enhances Suspense with better streaming and concurrent features.

**Tiếng Việt:** React 18 nâng cao Suspense với streaming tốt hơn và tính năng đồng thời.

**Suspense for Data Fetching:**
```javascript
<Suspense fallback={<Loading />}>
  <UserProfile userId={id} />
</Suspense>
```

**Nested Suspense:**
```javascript
<Suspense fallback={<PageSkeleton />}>
  <Header />
  <Suspense fallback={<ContentSkeleton />}>
    <Content />
  </Suspense>
  <Footer />
</Suspense>
```

**Streaming SSR:**
- Send HTML progressively
- Hydrate as components load
- Better Time to Interactive
- Improved user experience

**SuspenseList (Experimental):**
```javascript
<SuspenseList revealOrder="forwards">
  <Suspense fallback={<Loading />}>
    <Component1 />
  </Suspense>
  <Suspense fallback={<Loading />}>
    <Component2 />
  </Suspense>
</SuspenseList>
```

**Reveal Orders:**
- `forwards`: Top to bottom
- `backwards`: Bottom to top
- `together`: All at once

### New Hooks / Hooks Mới

**useId:**
```javascript
const id = useId();

<label htmlFor={id}>Name</label>
<input id={id} />
```

**Benefits:**
- Unique IDs
- SSR-safe
- No hydration mismatches
- Accessibility

**useSyncExternalStore:**
```javascript
const state = useSyncExternalStore(
  subscribe,
  getSnapshot,
  getServerSnapshot
);
```

**Purpose:**
- Subscribe to external stores
- Tearing prevention
- Concurrent-safe
- Library authors

**useInsertionEffect:**
```javascript
useInsertionEffect(() => {
  // Insert styles before DOM mutations
}, []);
```

**Purpose:**
- CSS-in-JS libraries
- Before layout effects
- Style injection
- Performance optimization

---

## Server Components / Components Server

### React Server Components Theory / Lý Thuyết React Server Components

**English:** Server Components run on the server, reducing client bundle size and enabling direct backend access.

**Tiếng Việt:** Server Components chạy trên server, giảm kích thước bundle client và cho phép truy cập backend trực tiếp.

#### Architecture / Kiến Trúc

**Component Types:**

**1. Server Components (Default)**
- Run on server only
- No client JavaScript
- Direct database access
- Async by default
- Cannot use hooks
- Cannot use browser APIs

**2. Client Components**
- Run on client
- Interactive
- Use hooks
- Browser APIs
- Event handlers
- Marked with 'use client'

**3. Shared Components**
- Run on both
- No side effects
- Pure rendering
- Limited APIs

**Benefits:**

**1. Zero Bundle Size:**
- Server components not in bundle
- Smaller client JavaScript
- Faster initial load
- Better performance

**2. Direct Backend Access:**
- Query database directly
- Access file system
- Call internal APIs
- No API layer needed

**3. Automatic Code Splitting:**
- Only client components bundled
- Lazy loading built-in
- Optimal splitting
- Better performance

**4. Streaming:**
- Progressive rendering
- Send HTML as ready
- Better perceived performance
- Improved UX

**Limitations:**

**Cannot Use:**
- useState, useEffect, hooks
- Browser APIs
- Event handlers
- Context (with exceptions)

**Can Use:**
- async/await
- Server-only code
- Database queries
- File system access

#### Server vs Client Boundary / Ranh Giới Server vs Client

**Rules:**

**1. Server Components Can:**
- Import client components
- Pass props to client components
- Render client components

**2. Client Components Cannot:**
- Import server components directly
- Must use children prop
- Composition pattern

**Example:**
```javascript
// Server Component
async function ServerComponent() {
  const data = await fetchData();
  
  return (
    <ClientComponent data={data}>
      <AnotherServerComponent />
    </ClientComponent>
  );
}

// Client Component
'use client';
function ClientComponent({ data, children }) {
  const [state, setState] = useState();
  
  return (
    <div onClick={() => setState(...)}>
      {data.map(...)}
      {children}
    </div>
  );
}
```

**Data Flow:**
- Server → Client: Props (serializable)
- Client → Server: Not directly
- Use Server Actions

---

## React 19 Features / Tính Năng React 19

### React Compiler / Trình Biên Dịch React

**English:** Automatic optimization without manual memoization.

**Tiếng Việt:** Tối ưu hóa tự động mà không cần memoization thủ công.

**Problem:**
- Manual useMemo/useCallback
- Easy to forget
- Performance issues
- Maintenance burden

**Solution:**
- Automatic memoization
- Compiler optimization
- No manual work
- Better performance

**What It Does:**
- Analyzes component code
- Identifies pure computations
- Automatically memoizes
- Optimizes re-renders
- Removes unnecessary work

**Benefits:**
- No useMemo needed
- No useCallback needed
- Simpler code
- Better performance
- Fewer bugs

**Migration:**
- Gradual adoption
- Opt-in per component
- Backward compatible
- No breaking changes

### Actions / Actions

**English:** Simplified async state management with built-in pending states.

**Tiếng Việt:** Quản lý state bất đồng bộ đơn giản với trạng thái pending tích hợp.

**useActionState:**
```javascript
const [state, submitAction, isPending] = useActionState(
  async (previousState, formData) => {
    const result = await saveData(formData);
    return result;
  },
  initialState
);

<form action={submitAction}>
  <input name="text" />
  <button disabled={isPending}>
    {isPending ? 'Saving...' : 'Save'}
  </button>
</form>
```

**Benefits:**
- Built-in pending state
- Error handling
- Optimistic updates
- Form integration
- Simpler async logic

**useOptimistic:**
```javascript
const [optimisticState, addOptimistic] = useOptimistic(
  state,
  (currentState, optimisticValue) => {
    return [...currentState, optimisticValue];
  }
);

async function handleSubmit(data) {
  addOptimistic(data);
  await saveData(data);
}
```

**Purpose:**
- Instant UI updates
- Rollback on error
- Better UX
- Perceived performance

### use() Hook / Hook use()

**English:** Read resources (Promises, Context) in render.

**Tiếng Việt:** Đọc resources (Promises, Context) trong render.

**With Promises:**
```javascript
function Component({ dataPromise }) {
  const data = use(dataPromise);
  
  return <div>{data.name}</div>;
}

// Wrap in Suspense
<Suspense fallback={<Loading />}>
  <Component dataPromise={fetchData()} />
</Suspense>
```

**With Context:**
```javascript
function Component() {
  const theme = use(ThemeContext);
  
  return <div className={theme}>Content</div>;
}
```

**Benefits:**
- Conditional usage
- Can use in loops
- Simpler than useContext
- Works with Suspense

### Document Metadata / Metadata Tài Liệu

**English:** Built-in support for document metadata.

**Tiếng Việt:** Hỗ trợ tích hợp cho metadata tài liệu.

**Syntax:**
```javascript
function Page() {
  return (
    <>
      <title>Page Title</title>
      <meta name="description" content="Page description" />
      <link rel="canonical" href="https://example.com" />
      
      <h1>Content</h1>
    </>
  );
}
```

**Benefits:**
- No react-helmet needed
- Automatic hoisting
- SSR support
- Simpler API

### Asset Loading / Tải Tài Sản

**English:** Built-in resource preloading.

**Tiếng Việt:** Preload tài nguyên tích hợp.

**APIs:**
```javascript
import { preload, preinit } from 'react-dom';

// Preload resource
preload('/font.woff2', { as: 'font' });

// Preinit stylesheet
preinit('/styles.css', { as: 'style' });
```

**Benefits:**
- Better performance
- Automatic optimization
- No manual link tags
- Framework integration

---

## Concurrent Features Deep Dive / Tìm Hiểu Sâu Tính Năng Đồng Thời

### Transition Theory / Lý Thuyết Transition

**English:** Transitions separate urgent from non-urgent updates.

**Tiếng Việt:** Transitions tách cập nhật khẩn cấp khỏi không khẩn cấp.

#### Update Priority Levels / Mức Độ Ưu Tiên Cập Nhật

**Discrete Updates (Highest Priority):**
- User input (typing, clicking)
- Must be immediate
- Cannot be interrupted
- Synchronous feel

**Continuous Updates (Medium Priority):**
- Hover effects
- Scroll position
- Animation frames
- Can be throttled

**Transition Updates (Low Priority):**
- Search results
- Data filtering
- Route changes
- Can be interrupted

**Default Updates (Normal Priority):**
- Regular setState calls
- Standard priority
- Most common

#### How Transitions Work / Cách Transitions Hoạt Động

**Mechanism:**

**1. Mark Update as Transition:**
```javascript
startTransition(() => {
  setSearchResults(filter(query));
});
```

**2. React Behavior:**
- Starts rendering transition
- Keeps old UI visible
- Can interrupt if urgent update
- Shows pending state
- Commits when ready

**3. Interruption:**
- Urgent update arrives
- Pauses transition
- Handles urgent update
- Resumes transition
- Or restarts if needed

**Benefits:**
- UI stays responsive
- No janky interactions
- Better perceived performance
- Smooth experience

### Suspense Architecture / Kiến Trúc Suspense

**English:** Suspense enables declarative loading states and code splitting.

**Tiếng Việt:** Suspense cho phép trạng thái loading khai báo và code splitting.

#### Suspense Theory / Lý Thuyết Suspense

**Concept:**
- Component "suspends" while loading
- Shows fallback UI
- Resumes when ready
- Declarative loading

**How It Works:**

**1. Component Throws Promise:**
```javascript
function Component() {
  const data = resource.read();  // Throws promise if not ready
  return <div>{data}</div>;
}
```

**2. React Catches Promise:**
- Catches thrown promise
- Shows fallback
- Waits for promise
- Re-renders when resolved

**3. Boundary Handling:**
```javascript
<Suspense fallback={<Loading />}>
  <Component />
</Suspense>
```

**Streaming SSR:**

**Traditional SSR:**
1. Server fetches all data
2. Renders complete HTML
3. Sends to client
4. Client hydrates all at once

**Streaming SSR:**
1. Server sends HTML shell
2. Streams components as ready
3. Client hydrates progressively
4. Interactive sooner

**Benefits:**
- Faster Time to Interactive
- Progressive enhancement
- Better perceived performance
- Improved UX

---

## Server Components / Components Server

### Server Component Theory / Lý Thuyết Server Component

**English:** Server Components fundamentally change how React applications are architected.

**Tiếng Việt:** Server Components thay đổi cơ bản cách ứng dụng React được kiến trúc.

#### Mental Model / Mô Hình Tư Duy

**Traditional React:**
- Everything runs on client
- Large JavaScript bundles
- API calls from client
- Waterfall requests
- Slow initial load

**With Server Components:**
- Split server/client
- Server components = zero JS
- Direct backend access
- Parallel data fetching
- Fast initial load

#### Rendering Flow / Luồng Render

**Server Side:**
1. Receive request
2. Render server components
3. Fetch data in parallel
4. Serialize to RSC payload
5. Send to client

**Client Side:**
1. Receive RSC payload
2. Reconstruct component tree
3. Render client components
4. Hydrate interactive parts
5. Ready for interaction

**RSC Payload Format:**
- JSON-like format
- Component tree structure
- Props and data
- Client component references
- Streaming support

#### Data Fetching Patterns / Patterns Lấy Dữ Liệu

**Parallel Fetching:**
```javascript
// Server Component
async function Page() {
  // Fetches in parallel
  const [user, posts] = await Promise.all([
    fetchUser(),
    fetchPosts()
  ]);
  
  return (
    <>
      <UserProfile user={user} />
      <PostList posts={posts} />
    </>
  );
}
```

**Sequential Fetching:**
```javascript
async function Page() {
  const user = await fetchUser();
  const posts = await fetchPosts(user.id);
  
  return <PostList posts={posts} />;
}
```

**Waterfall Prevention:**
```javascript
// Bad: Waterfall
async function Page() {
  const user = await fetchUser();
  return <Posts userId={user.id} />;  // Another fetch
}

// Good: Parallel
async function Page() {
  const userPromise = fetchUser();
  const postsPromise = fetchPosts();
  
  return (
    <>
      <Suspense fallback={<Loading />}>
        <User promise={userPromise} />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <Posts promise={postsPromise} />
      </Suspense>
    </>
  );
}
```

#### Server Actions / Actions Server

**English:** Server-side functions callable from client.

**Tiếng Việt:** Hàm phía server có thể gọi từ client.

**Definition:**
```javascript
'use server';

export async function saveData(formData) {
  const data = {
    name: formData.get('name'),
    email: formData.get('email')
  };
  
  await database.save(data);
  revalidatePath('/dashboard');
}
```

**Usage:**
```javascript
'use client';

function Form() {
  return (
    <form action={saveData}>
      <input name="name" />
      <input name="email" />
      <button>Save</button>
    </form>
  );
}
```

**Benefits:**
- No API routes needed
- Type-safe
- Progressive enhancement
- Automatic serialization
- Built-in error handling

**Capabilities:**
- Database operations
- File system access
- Authentication
- Revalidation
- Redirect

---

## React 19 Features / Tính Năng React 19

### React Compiler / Trình Biên Dịch React

**English:** Automatic optimization compiler (formerly React Forget).

**Tiếng Việt:** Trình biên dịch tối ưu hóa tự động (trước đây là React Forget).

#### Compiler Theory / Lý Thuyết Compiler

**Purpose:**
- Automatic memoization
- Eliminate manual optimization
- Better performance
- Simpler code

**What It Optimizes:**

**1. Component Memoization:**
```javascript
// Before: Manual
const Component = memo(function Component({ data }) {
  return <div>{data}</div>;
});

// After: Automatic
function Component({ data }) {
  return <div>{data}</div>;
}
// Compiler automatically optimizes
```

**2. Value Memoization:**
```javascript
// Before: Manual
const value = useMemo(() => expensive(data), [data]);

// After: Automatic
const value = expensive(data);
// Compiler memoizes automatically
```

**3. Callback Memoization:**
```javascript
// Before: Manual
const handler = useCallback(() => {
  doSomething(data);
}, [data]);

// After: Automatic
const handler = () => {
  doSomething(data);
};
// Compiler memoizes automatically
```

**How It Works:**

**1. Static Analysis:**
- Analyzes component code
- Identifies dependencies
- Detects pure computations
- Finds optimization opportunities

**2. Dependency Tracking:**
- Tracks prop usage
- Tracks state usage
- Builds dependency graph
- Determines when to recompute

**3. Code Generation:**
- Inserts memoization
- Adds dependency checks
- Optimizes renders
- Generates efficient code

**Rules of React:**
- Components must be pure
- Props and state immutable
- No side effects in render
- Predictable behavior

**Benefits:**
- No manual memoization
- Better performance
- Simpler code
- Fewer bugs
- Easier maintenance

### Asset Loading Improvements / Cải Tiến Tải Tài Sản

**Preloading APIs:**
```javascript
import { preload, preinit, prefetchDNS, preconnect } from 'react-dom';

// Preload resource
preload('/font.woff2', { as: 'font', type: 'font/woff2' });

// Preinit stylesheet (blocking)
preinit('/critical.css', { as: 'style' });

// DNS prefetch
prefetchDNS('https://api.example.com');

// Preconnect
preconnect('https://api.example.com');
```

**Benefits:**
- Better performance
- Declarative API
- Framework integration
- Automatic optimization

### Form Actions / Actions Form

**English:** Enhanced form handling with built-in states.

**Tiếng Việt:** Xử lý form nâng cao với trạng thái tích hợp.

**useFormStatus:**
```javascript
function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();
  
  return (
    <button disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}
```

**useFormState:**
```javascript
const [state, formAction] = useFormState(serverAction, initialState);

<form action={formAction}>
  {state.error && <div>{state.error}</div>}
  <input name="text" />
  <button>Submit</button>
</form>
```

**Benefits:**
- Built-in pending states
- Error handling
- Progressive enhancement
- Server actions integration
- Simpler forms

### ref as Prop / ref như Prop

**English:** Pass ref as regular prop without forwardRef.

**Tiếng Việt:** Truyền ref như prop thông thường mà không cần forwardRef.

**Before:**
```javascript
const Component = forwardRef((props, ref) => {
  return <div ref={ref}>{props.children}</div>;
});
```

**After:**
```javascript
function Component({ ref, children }) {
  return <div ref={ref}>{children}</div>;
}
```

**Benefits:**
- Simpler API
- No forwardRef needed
- Cleaner code
- Better TypeScript support

---

## Interview Questions / Câu Hỏi Phỏng Vấn

### Q1: Explain React 18 concurrent rendering — 🟡 [Mid]

**English Answer:**

**Concurrent Rendering** allows React to work on multiple updates simultaneously.

**Key Concepts:**

**1. Interruptibility:**
- React can pause rendering
- Handle urgent updates
- Resume later
- Better responsiveness

**2. Priority-Based:**
- Urgent: User input
- Normal: Regular updates
- Low: Transitions
- Automatic prioritization

**3. Time Slicing:**
- Break work into chunks
- Yield to browser
- Maintain 60fps
- Smooth experience

**Features:**
- Automatic batching
- Transitions (useTransition)
- Deferred values (useDeferredValue)
- Suspense improvements

**Benefits:**
- Responsive UI
- Better performance
- Smooth interactions
- Improved UX

**Tiếng Việt:**

Concurrent rendering cho phép React làm việc trên nhiều updates đồng thời. Key concepts: interruptibility, priority-based, time slicing. Features: automatic batching, transitions, deferred values, Suspense. Benefits: responsive UI, better performance.

### Q2: What are React Server Components? — 🔴 [Senior]

**English Answer:**

**Server Components** run on server, reducing client bundle.

**Characteristics:**
- Run on server only
- Zero client JavaScript
- Direct backend access
- Async by default
- Cannot use hooks

**Benefits:**
1. **Zero Bundle Size**: Not in client bundle
2. **Direct Access**: Database, file system
3. **Automatic Splitting**: Only client components bundled
4. **Streaming**: Progressive rendering

**Limitations:**
- No useState/useEffect
- No browser APIs
- No event handlers
- Must mark client components

**Architecture:**
- Server components (default)
- Client components ('use client')
- Shared components (both)

**Data Flow:**
- Server → Client: Props
- Client → Server: Server Actions

**Tiếng Việt:**

Server Components chạy trên server, zero client JS. Benefits: zero bundle size, direct backend access, automatic splitting, streaming. Limitations: no hooks, no browser APIs, no event handlers. Architecture: server (default), client ('use client'), shared.

### Q3: Explain React Compiler — 🟡 [Mid]

**English Answer:**

**React Compiler** automatically optimizes components.

**Purpose:**
- Automatic memoization
- No manual useMemo/useCallback
- Better performance
- Simpler code

**What It Does:**
1. Analyzes component code
2. Identifies pure computations
3. Tracks dependencies
4. Inserts memoization
5. Optimizes re-renders

**Benefits:**
- No manual optimization
- Better performance
- Fewer bugs
- Easier maintenance
- Simpler code

**Requirements:**
- Components must be pure
- Follow Rules of React
- No side effects in render
- Predictable behavior

**Migration:**
- Gradual adoption
- Opt-in per component
- Backward compatible
- No breaking changes

**Tiếng Việt:**

React Compiler tự động tối ưu components. Purpose: automatic memoization, no manual useMemo/useCallback. What it does: analyzes code, identifies pure computations, tracks dependencies, inserts memoization. Benefits: better performance, simpler code, fewer bugs.

---

## Summary / Tóm Tắt

**Key Modern Features:**

**React 18:**
- Concurrent rendering
- Automatic batching
- Transitions (useTransition, useDeferredValue)
- Suspense improvements
- New hooks (useId, useSyncExternalStore, useInsertionEffect)
- Streaming SSR

**Server Components:**
- Zero bundle size
- Direct backend access
- Automatic code splitting
- Server Actions
- Streaming

**React 19:**
- React Compiler (automatic optimization)
- Actions (useActionState, useOptimistic)
- use() hook
- Document metadata
- Asset loading
- ref as prop

**Best Practices:**
- Use transitions for non-urgent updates
- Leverage Server Components
- Let compiler optimize
- Use Suspense for loading
- Implement streaming SSR
- Follow Rules of React

---

[← Previous: TypeScript Modern Features](../02-typescript/06-typescript-modern-features.md) | [Back to Table of Contents](../../00-table-of-contents.md)
