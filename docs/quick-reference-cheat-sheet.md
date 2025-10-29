# Quick Reference Cheat Sheet
## Frontend Interview Preparation

[← Back to Table of Contents](./00-table-of-contents.md)

---

## JavaScript Quick Reference

### Data Types
```javascript
// Primitives: string, number, boolean, null, undefined, symbol, bigint
// Reference: object (includes arrays, functions, dates, etc.)

typeof "hello"        // "string"
typeof 42             // "number"
typeof true           // "boolean"
typeof undefined      // "undefined"
typeof null           // "object" (bug!)
typeof Symbol()       // "symbol"
typeof 10n            // "bigint"
typeof {}             // "object"
typeof []             // "object"
typeof function(){}   // "function"
```

### Variable Declarations
```javascript
var x = 1;    // Function-scoped, hoisted, can redeclare
let y = 2;    // Block-scoped, TDZ, no redeclare
const z = 3;  // Block-scoped, TDZ, no reassign
```

### Array Methods
```javascript
// Mutating
arr.push(item)           // Add to end
arr.pop()                // Remove from end
arr.unshift(item)        // Add to start
arr.shift()              // Remove from start
arr.splice(i, n, items)  // Remove/add at index

// Non-mutating
arr.map(fn)              // Transform each element
arr.filter(fn)           // Keep elements that pass test
arr.reduce(fn, init)     // Reduce to single value
arr.find(fn)             // First element that passes
arr.findIndex(fn)        // Index of first match
arr.some(fn)             // At least one passes
arr.every(fn)            // All pass
arr.slice(start, end)    // Shallow copy portion
arr.concat(arr2)         // Merge arrays
```

### String Methods
```javascript
str.length               // Length
str.charAt(i)            // Character at index
str.indexOf(substr)      // First occurrence index
str.slice(start, end)    // Extract substring
str.substring(start, end)// Extract substring
str.split(delimiter)     // Split into array
str.toUpperCase()        // Convert to uppercase
str.toLowerCase()        // Convert to lowercase
str.trim()               // Remove whitespace
str.replace(old, new)    // Replace first occurrence
str.replaceAll(old, new) // Replace all occurrences
```

### Object Methods
```javascript
Object.keys(obj)         // Array of keys
Object.values(obj)       // Array of values
Object.entries(obj)      // Array of [key, value] pairs
Object.assign(target, src) // Merge objects
Object.freeze(obj)       // Make immutable
Object.seal(obj)         // Prevent add/remove props
Object.create(proto)     // Create with prototype
```

### Promises & Async
```javascript
// Promise
new Promise((resolve, reject) => {
  // async operation
  if (success) resolve(value);
  else reject(error);
});

promise
  .then(result => {})
  .catch(error => {})
  .finally(() => {});

// Async/Await
async function fetchData() {
  try {
    const result = await promise;
    return result;
  } catch (error) {
    console.error(error);
  }
}

// Promise utilities
Promise.all([p1, p2])      // Wait for all
Promise.race([p1, p2])     // First to settle
Promise.allSettled([p1, p2]) // Wait for all to settle
Promise.any([p1, p2])      // First to fulfill
```

---

## TypeScript Quick Reference

### Basic Types
```typescript
let str: string = "hello";
let num: number = 42;
let bool: boolean = true;
let arr: number[] = [1, 2, 3];
let tuple: [string, number] = ["hello", 42];
let obj: { name: string; age: number } = { name: "John", age: 30 };
let any: any = "anything";
let unknown: unknown = "safe any";
let never: never; // Never returns
let void: void; // No return value
```

### Interfaces & Types
```typescript
// Interface
interface User {
  id: number;
  name: string;
  email?: string;  // Optional
  readonly created: Date;  // Read-only
}

// Type alias
type ID = string | number;
type Status = "pending" | "approved" | "rejected";

// Intersection
type Admin = User & { role: "admin" };

// Union
type StringOrNumber = string | number;
```

### Generics
```typescript
function identity<T>(arg: T): T {
  return arg;
}

interface Box<T> {
  value: T;
}

type Nullable<T> = T | null;
```

### Utility Types
```typescript
Partial<T>       // All properties optional
Required<T>      // All properties required
Readonly<T>      // All properties readonly
Pick<T, K>       // Pick specific properties
Omit<T, K>       // Omit specific properties
Record<K, T>     // Object with keys K and values T
Exclude<T, U>    // Exclude types from T
Extract<T, U>    // Extract types from T
NonNullable<T>   // Exclude null and undefined
ReturnType<T>    // Return type of function
Parameters<T>    // Parameter types of function
```

---

## React Quick Reference

### Component Basics
```typescript
// Function component
function MyComponent({ prop1, prop2 }: Props) {
  return <div>{prop1}</div>;
}

// With children
interface Props {
  children: React.ReactNode;
}
```

### Hooks
```typescript
// State
const [state, setState] = useState(initialValue);

// Effect
useEffect(() => {
  // Side effect
  return () => {
    // Cleanup
  };
}, [dependencies]);

// Ref
const ref = useRef(initialValue);

// Context
const value = useContext(MyContext);

// Reducer
const [state, dispatch] = useReducer(reducer, initialState);

// Memo
const memoized = useMemo(() => compute(), [deps]);

// Callback
const callback = useCallback(() => {}, [deps]);

// Custom hook
function useCustomHook() {
  const [state, setState] = useState();
  // ... logic
  return state;
}
```

### React 19 New Features
```typescript
// use() hook
const data = use(promise);
const theme = use(ThemeContext);

// useActionState
const [state, formAction, isPending] = useActionState(
  submitAction,
  initialState
);

// useOptimistic
const [optimisticState, addOptimistic] = useOptimistic(
  state,
  updateFn
);

// useFormStatus
const { pending, data } = useFormStatus();
```

---

## Next.js 16 Quick Reference

### App Router
```typescript
// app/page.tsx - Server Component
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// app/layout.tsx - Root Layout
export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

// Metadata
export const metadata = {
  title: 'My App',
  description: 'Description',
};
```

### Server Actions
```typescript
// app/actions.ts
'use server';

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  // ... save to database
  revalidatePath('/posts');
  redirect('/posts');
}

// Usage in component
<form action={createPost}>
  <input name="title" />
  <button type="submit">Submit</button>
</form>
```

### Data Fetching
```typescript
// Static (default)
const data = await fetch('https://api.example.com/data');

// Revalidate every hour
const data = await fetch('url', {
  next: { revalidate: 3600 }
});

// No cache
const data = await fetch('url', {
  cache: 'no-store'
});
```

---

## CSS Quick Reference

### Flexbox
```css
.container {
  display: flex;
  flex-direction: row | column;
  justify-content: flex-start | center | space-between | space-around;
  align-items: flex-start | center | flex-end | stretch;
  flex-wrap: nowrap | wrap;
  gap: 1rem;
}

.item {
  flex: 1; /* flex-grow flex-shrink flex-basis */
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: auto;
}
```

### Grid
```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
}

.item {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  grid-area: header;
}
```

### Modern CSS
```css
/* Container queries */
@container (min-width: 400px) {
  .card { padding: 2rem; }
}

/* Custom properties */
:root {
  --primary-color: #007bff;
}
.button {
  background: var(--primary-color);
}

/* Logical properties */
.element {
  margin-inline: 1rem;  /* left + right */
  margin-block: 1rem;   /* top + bottom */
  padding-inline-start: 1rem;  /* left in LTR */
}
```

---

## Performance Quick Reference

### Core Web Vitals
```
LCP (Largest Contentful Paint): < 2.5s
FID (First Input Delay): < 100ms
CLS (Cumulative Layout Shift): < 0.1
```

### Optimization Techniques
```typescript
// Code splitting
const Component = lazy(() => import('./Component'));

// Memoization
const memoized = useMemo(() => expensive(), [deps]);
const callback = useCallback(() => {}, [deps]);
const Component = React.memo(MyComponent);

// Image optimization
<Image
  src="/image.jpg"
  width={800}
  height={600}
  priority
  placeholder="blur"
/>

// Virtual scrolling
import { FixedSizeList } from 'react-window';
```

---

## Security Quick Reference

### Common Vulnerabilities
```typescript
// ❌ XSS - Don't do this
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ XSS - Sanitize first
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userInput) 
}} />

// ❌ CSRF - Missing token
<form action="/api/transfer" method="POST">
  <input name="amount" />
</form>

// ✅ CSRF - Include token
<form action="/api/transfer" method="POST">
  <input type="hidden" name="csrf_token" value={token} />
  <input name="amount" />
</form>
```

### Security Headers
```typescript
// next.config.js
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      {
        key: 'Content-Security-Policy',
        value: "default-src 'self'"
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY'
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      }
    ]
  }];
}
```

---

## Time Complexity Cheat Sheet

```
O(1)      - Constant       - Array access, hash lookup
O(log n)  - Logarithmic    - Binary search
O(n)      - Linear         - Array iteration
O(n log n)- Linearithmic   - Efficient sorting (merge, quick)
O(n²)     - Quadratic      - Nested loops
O(2ⁿ)     - Exponential    - Recursive fibonacci
O(n!)     - Factorial      - Permutations
```

---

## Common Interview Patterns

### Two Pointers
```typescript
function twoSum(arr: number[], target: number): [number, number] | null {
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  
  return null;
}
```

### Sliding Window
```typescript
function maxSubarraySum(arr: number[], k: number): number {
  let maxSum = 0;
  let windowSum = 0;
  
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;
  
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }
  
  return maxSum;
}
```

### Hash Map
```typescript
function firstNonRepeating(str: string): string | null {
  const charCount = new Map<string, number>();
  
  for (const char of str) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }
  
  for (const char of str) {
    if (charCount.get(char) === 1) return char;
  }
  
  return null;
}
```

---

## Git Commands Quick Reference

```bash
# Basic
git init                    # Initialize repo
git clone <url>             # Clone repo
git status                  # Check status
git add .                   # Stage all changes
git commit -m "message"     # Commit changes
git push origin main        # Push to remote
git pull origin main        # Pull from remote

# Branching
git branch                  # List branches
git branch <name>           # Create branch
git checkout <name>         # Switch branch
git checkout -b <name>      # Create and switch
git merge <branch>          # Merge branch
git branch -d <name>        # Delete branch

# Undoing
git reset HEAD~1            # Undo last commit (keep changes)
git reset --hard HEAD~1     # Undo last commit (discard changes)
git revert <commit>         # Create new commit that undoes
git stash                   # Temporarily save changes
git stash pop               # Restore stashed changes

# History
git log                     # View commit history
git log --oneline           # Compact history
git diff                    # View changes
```

---

## Useful VS Code Shortcuts

```
Ctrl/Cmd + P        - Quick file open
Ctrl/Cmd + Shift + P - Command palette
Ctrl/Cmd + /        - Toggle comment
Ctrl/Cmd + D        - Select next occurrence
Ctrl/Cmd + Shift + L - Select all occurrences
Alt + Up/Down       - Move line up/down
Shift + Alt + Up/Down - Copy line up/down
Ctrl/Cmd + B        - Toggle sidebar
Ctrl/Cmd + `        - Toggle terminal
F2                  - Rename symbol
F12                 - Go to definition
Ctrl/Cmd + Click    - Go to definition
```

---

## Interview Day Checklist

### Before Interview
- [ ] Test camera and microphone
- [ ] Prepare quiet environment
- [ ] Have water nearby
- [ ] Open code editor
- [ ] Have notepad ready
- [ ] Review company products
- [ ] Prepare questions to ask

### During Interview
- [ ] Think out loud
- [ ] Ask clarifying questions
- [ ] Start with brute force solution
- [ ] Optimize step by step
- [ ] Test with examples
- [ ] Discuss trade-offs
- [ ] Be honest about what you don't know

### Common Questions to Ask
- What does a typical day look like?
- What's the team structure?
- What technologies does the team use?
- What are the biggest challenges?
- What's the code review process?
- How do you measure success?
- What's the onboarding process?

---

[← Back to Table of Contents](./00-table-of-contents.md)
